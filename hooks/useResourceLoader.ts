import { useCallback, useEffect, useState } from 'react';

interface ResourceItem {
  url: string;
  type: 'audio' | 'image';
  size?: number; // Optional size hint for progress calculation
}

interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentResource?: string;
}

const RESOURCES: ResourceItem[] = [
  { url: '/music/ambient-01.ogg', type: 'audio', size: 5000000 }, // 5MB
  { url: '/sounds/click.ogg', type: 'audio' },
  { url: '/sounds/select-yes.ogg', type: 'audio' },
  { url: '/sounds/select-no.ogg', type: 'audio' },
  // Add more resources as needed
];

export function useResourceLoader() {
  const [progress, setProgress] = useState<LoadingProgress>({
    loaded: 0,
    total: RESOURCES.length,
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadedResources, setLoadedResources] = useState<
    Map<string, HTMLAudioElement | HTMLImageElement>
  >(new Map());

  const loadResource = useCallback(
    (resource: ResourceItem): Promise<HTMLAudioElement | HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (resource.type === 'audio') {
          const audio = new Audio();

          const handleLoad = () => {
            audio.removeEventListener('canplaythrough', handleLoad);
            audio.removeEventListener('error', handleError);
            resolve(audio);
          };

          const handleError = () => {
            audio.removeEventListener('canplaythrough', handleLoad);
            audio.removeEventListener('error', handleError);
            reject(new Error(`Failed to load audio: ${resource.url}`));
          };

          audio.addEventListener('canplaythrough', handleLoad);
          audio.addEventListener('error', handleError);
          audio.preload = 'auto';
          audio.src = resource.url;
          audio.load();
        } else if (resource.type === 'image') {
          const img = new Image();

          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${resource.url}`));
          img.src = resource.url;
        }
      });
    },
    []
  );

  const loadAllResources = useCallback(async () => {
    setIsLoading(true);
    const newLoadedResources = new Map();

    for (let i = 0; i < RESOURCES.length; i++) {
      const resource = RESOURCES[i];

      setProgress((prev) => ({
        ...prev,
        currentResource: resource.url,
        percentage: Math.round((i / RESOURCES.length) * 100),
      }));

      try {
        const loadedResource = await loadResource(resource);
        newLoadedResources.set(resource.url, loadedResource);

        setProgress((_prev) => ({
          loaded: i + 1,
          total: RESOURCES.length,
          percentage: Math.round(((i + 1) / RESOURCES.length) * 100),
          currentResource: resource.url,
        }));

        // Small delay to show progress (optional)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to load resource:', resource.url, error);
        // Continue loading other resources even if one fails
      }
    }

    setLoadedResources(newLoadedResources);
    setIsLoading(false);
  }, [loadResource]);

  const getResource = useCallback(
    (url: string) => {
      return loadedResources.get(url);
    },
    [loadedResources]
  );

  useEffect(() => {
    loadAllResources();
  }, [loadAllResources]);

  return {
    progress,
    isLoading,
    loadedResources,
    getResource,
    reload: loadAllResources,
  };
}

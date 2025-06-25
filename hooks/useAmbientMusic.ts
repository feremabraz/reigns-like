import { useCallback, useEffect, useRef, useState } from 'react';
import { useResourceLoader } from './useResourceLoader';

export function useAmbientMusic() {
  const { getResource, isLoading: resourcesLoading } = useResourceLoader();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default ambient volume
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio when resources are loaded
  useEffect(() => {
    if (!resourcesLoading) {
      const audio = getResource('/music/ambient-01.ogg') as HTMLAudioElement;
      if (audio) {
        audioRef.current = audio;
        audio.loop = true;
        audio.volume = volume;
        audio.muted = isMuted;
      }
    }
  }, [resourcesLoading, getResource, volume, isMuted]);

  const play = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play ambient music:', error);
      }
    }
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolumeLevel = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  // Auto-start ambient music when resources are loaded (optional)
  useEffect(() => {
    if (!resourcesLoading && audioRef.current && !isPlaying) {
      // Uncomment to auto-start ambient music
      // play();
    }
  }, [resourcesLoading, isPlaying]);

  return {
    isPlaying,
    volume,
    isMuted,
    isLoading: resourcesLoading,
    play,
    pause,
    stop,
    togglePlayPause,
    setVolume: setVolumeLevel,
    toggleMute,
  };
}

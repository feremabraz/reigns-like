import type { CSSProperties, HTMLAttributes } from 'react';
import type { PixelCardArt } from '@/lib/types/pixel-art';
import { cn } from '@/lib/utils';

export interface PixelCardLayersProps extends HTMLAttributes<HTMLDivElement> {
  art: PixelCardArt;
}

const pixelRenderingStyle: CSSProperties = {
  imageRendering: 'pixelated',
};

interface LayerImageProps {
  layer: PixelCardArt['background'];
  className?: string;
  style?: CSSProperties;
  pixelated?: boolean;
  loading?: 'eager' | 'lazy';
}

const LayerImage = ({
  layer,
  className,
  style,
  pixelated = true,
  loading = 'lazy',
}: LayerImageProps) => (
  <img
    src={layer.src}
    alt={layer.alt}
    draggable={false}
    loading={loading}
    className={cn('absolute inset-0 h-full w-full object-contain', className)}
    style={pixelated ? { ...pixelRenderingStyle, ...style } : style}
  />
);

export function PixelCardLayers({ art, className, ...rest }: PixelCardLayersProps) {
  const { background, foreground, overlay, frame } = art;

  return (
    <div className={cn('absolute inset-0 w-full h-full', className)} {...rest}>
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: '90%', height: '90%' }}>
            <LayerImage
              layer={background}
              className="object-contain"
              style={{ ...pixelRenderingStyle, objectPosition: 'center center' }}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {overlay ? (
        <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
          <LayerImage layer={overlay} pixelated={false} />
        </div>
      ) : null}

      <div className="absolute inset-0 w-full h-full z-10" style={pixelRenderingStyle}>
        <LayerImage layer={foreground} />
      </div>
      {frame ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 40 }}>
          <LayerImage layer={frame} />
        </div>
      ) : null}
    </div>
  );
}

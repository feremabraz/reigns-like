import type { ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface PixelArtImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  disablePixelation?: boolean;
}

export function PixelArtImage({
  className,
  style,
  alt = 'Pixel art',
  disablePixelation = false,
  ...props
}: PixelArtImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      className={cn('object-contain', className)}
      style={disablePixelation ? style : { imageRendering: 'pixelated', ...style }}
    />
  );
}

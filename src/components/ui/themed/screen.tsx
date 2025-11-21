import * as React from 'react';

import { cn } from '@/lib/utils';

const Screen = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative min-h-screen overflow-hidden bg-gray-900 text-white font-normal',
        className
      )}
      {...props}
    />
  )
);
Screen.displayName = 'Screen';

interface ScreenBackgroundProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
}

const ScreenBackground = ({
  containerClassName,
  imageClassName,
  overlayClassName = 'bg-black/50',
  showOverlay = true,
  draggable = false,
  loading = 'eager',
  alt = 'Screen background',
  ...imageProps
}: ScreenBackgroundProps) => (
  <>
    <div className={cn('absolute inset-0 z-0', containerClassName)}>
      <img
        {...imageProps}
        alt={alt}
        loading={loading}
        draggable={draggable}
        className={cn('absolute inset-0 h-full w-full object-cover opacity-80', imageClassName)}
      />
    </div>
    {showOverlay ? <div className={cn('absolute inset-0 z-5', overlayClassName)} /> : null}
  </>
);

export { Screen, ScreenBackground };

import * as React from 'react';

import { cn } from '@/lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const baseStyles = 'bg-white/10';

const thicknessByOrientation = {
  horizontal: 'h-px w-full',
  vertical: 'w-px h-full',
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', role = 'separator', ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(baseStyles, thicknessByOrientation[orientation], className)}
      {...props}
    />
  )
);

Separator.displayName = 'Separator';

export { Separator };

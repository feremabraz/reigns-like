import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/lib/utils';

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  variant?: 'default' | 'admin';
};

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses =
      variant === 'admin'
        ? 'text-white/80 data-[error=true]:text-red-400'
        : 'text-gray-200 data-[error=true]:text-destructive';

    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          'text-sm font-mono font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          variantClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

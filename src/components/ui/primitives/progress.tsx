import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'church' | 'people' | 'army' | 'wealth';
}

const variantMap: Record<NonNullable<ProgressProps['variant']>, string> = {
  default: 'from-emerald-400 to-green-700',
  church: 'from-yellow-200 to-yellow-500',
  people: 'from-lime-300 to-emerald-500',
  army: 'from-red-400 to-red-700',
  wealth: 'from-cyan-300 to-blue-500',
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, variant = 'default', value = 0, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full border border-gray-800 bg-gray-900/80 shadow-inner',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 rounded-full bg-gradient-to-r', variantMap[variant])}
        style={{ transform: `translateX(-${100 - Number(value ?? 0)}%)` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

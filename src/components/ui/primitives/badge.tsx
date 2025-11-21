import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-gray-900/70 to-gray-950/90 border-gray-700 text-gray-100 shadow-inner',
        glow: 'bg-gradient-to-b from-green-900 to-green-950 border-green-700 text-green-100 shadow-lg',
        warning:
          'bg-gradient-to-b from-amber-500/90 to-amber-700 text-black border-amber-300 shadow-amber-500/50',
        danger: 'bg-gradient-to-b from-red-600 to-red-800 border-red-900 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

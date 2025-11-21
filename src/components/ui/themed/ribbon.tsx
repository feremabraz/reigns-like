import * as React from 'react';

import { cn } from '@/lib/utils';

const baseStyles =
  'pointer-events-none select-none rounded-full border px-4 py-1 text-center font-serif text-sm uppercase tracking-wide shadow';

export interface RibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold';
}

const variantMap = {
  default: 'bg-black/70 border-white/20 text-white/90',
  gold: 'bg-gradient-to-r from-amber-500/90 to-amber-700 border-amber-200 text-black shadow-amber-500/40',
};

const Ribbon = React.forwardRef<HTMLDivElement, RibbonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div ref={ref} className={cn(baseStyles, variantMap[variant], className)} {...props} />
  )
);

Ribbon.displayName = 'Ribbon';

export { Ribbon };

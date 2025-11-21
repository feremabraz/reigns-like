import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const glareCardVariants = cva(
  'relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 text-white shadow-xl backdrop-blur-md',
  {
    variants: {
      tone: {
        default: 'bg-black/60 border-white/10',
        royal: 'bg-gradient-to-b from-gray-900/60 to-black/70 border-white/20',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
      },
    },
    defaultVariants: {
      tone: 'default',
      padding: 'md',
    },
  }
);

interface GlareCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.ComponentPropsWithoutRef<'div'> {
  tone?: 'default' | 'royal';
  padding?: 'none' | 'sm' | 'md';
}

const GlareCard = React.forwardRef<HTMLDivElement, GlareCardProps>(
  ({ className, children, tone, padding, ...props }, ref) => (
    <div ref={ref} className={cn(glareCardVariants({ tone, padding }), className)} {...props}>
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
    </div>
  )
);

GlareCard.displayName = 'GlareCard';

export { GlareCard };

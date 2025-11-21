import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const panelVariants = cva(
  'backdrop-blur-xl rounded-2xl border shadow-lg transition-colors duration-300',
  {
    variants: {
      tone: {
        dark: 'bg-gray-900/70 border-white/10 text-white',
        light: 'bg-white/15 border-white/30 text-white',
      },
      padding: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
    },
    defaultVariants: {
      tone: 'dark',
      padding: 'md',
    },
  }
);

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, tone, padding, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ tone, padding }), className)} {...props} />
  )
);

Panel.displayName = 'Panel';

export { Panel, panelVariants };

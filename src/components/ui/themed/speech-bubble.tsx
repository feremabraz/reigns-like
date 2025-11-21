import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const bubbleVariants = cva(
  'relative isolate rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-colors duration-200',
  {
    variants: {
      tone: {
        parchment: 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-amber-200/40',
        dark: 'bg-black/70 border-white/10 text-white shadow-black/50',
        emerald: 'bg-emerald-900/70 border-emerald-500/40 text-emerald-50 shadow-emerald-900/40',
      },
      size: {
        sm: 'text-xs px-3 py-2',
        md: 'text-sm px-4 py-3',
        lg: 'text-base px-5 py-4',
      },
    },
    defaultVariants: {
      tone: 'parchment',
      size: 'md',
    },
  }
);

const tailVariant = {
  parchment: 'bg-amber-50/90 border-amber-200',
  dark: 'bg-black/70 border-white/10',
  emerald: 'bg-emerald-900/70 border-emerald-500/40',
};

const tailPlacement = {
  bottom: '-bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0',
  top: '-top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0',
};

export interface SpeechBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {
  tail?: 'top' | 'bottom';
}

const SpeechBubble = React.forwardRef<HTMLDivElement, SpeechBubbleProps>(
  ({ className, tone, size, tail = 'bottom', children, ...props }, ref) => (
    <div ref={ref} className={cn(bubbleVariants({ tone, size }), className)} {...props}>
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute h-4 w-4 rotate-45 border shadow-lg',
          tailPlacement[tail],
          tailVariant[tone ?? 'parchment']
        )}
      />
    </div>
  )
);

SpeechBubble.displayName = 'SpeechBubble';

export { SpeechBubble };

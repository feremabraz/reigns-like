import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-orbitron font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-green-900 to-green-950 border border-gray-800 text-green-300 hover:from-green-800 hover:to-green-900 shadow-md',
        destructive:
          'bg-gradient-to-b from-red-900 to-red-950 border border-gray-800 text-red-300 hover:from-red-800 hover:to-red-900 shadow-md',
        outline:
          'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 text-gray-300 hover:from-gray-700 hover:to-gray-800 shadow-md',
        secondary:
          'bg-gradient-to-b from-blue-900 to-blue-950 border border-gray-800 text-blue-300 hover:from-blue-800 hover:to-blue-900 shadow-md',
        ghost:
          'bg-gradient-to-b from-green-900/80 to-green-950/80 border border-gray-800/50 text-green-300 hover:from-green-800/80 hover:to-green-900/80 backdrop-blur-sm shadow-md',
        link: 'underline-offset-4 hover:underline text-green-300 font-orbitron',
      },
      size: {
        default: 'h-10 py-2 px-4 rounded',
        sm: 'h-8 px-3 rounded text-xs',
        lg: 'h-12 px-6 rounded text-base',
        icon: 'h-10 w-10 rounded',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// GBA-style effects component
const GBAEffects = () => (
  <>
    {/* LCD scanlines effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-800/20 to-transparent pointer-events-none" />
    {/* LCD glare effect */}
    <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded" />
  </>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  gbaStyle?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, gbaStyle = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {gbaStyle && <GBAEffects />}
        <span className="relative z-10">{children}</span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

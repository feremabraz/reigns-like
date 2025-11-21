import * as React from 'react';

import { cn } from '@/lib/utils';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  spacing?: 'sm' | 'md';
}

const spacingMap = {
  sm: 'gap-2',
  md: 'gap-3',
};

const directionMap = {
  row: 'flex-row',
  col: 'flex-col',
};

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, direction = 'row', spacing = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-full', directionMap[direction], spacingMap[spacing], className)}
      {...props}
    />
  )
);

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };

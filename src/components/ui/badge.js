import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground ring-primary/20',
        secondary: 'bg-secondary text-secondary-foreground ring-secondary/20',
        destructive: 'bg-destructive text-destructive-foreground ring-destructive/20',
        outline: 'bg-background text-foreground ring-border',
        success: 'bg-success text-success-foreground ring-success/20',
        warning: 'bg-warning text-warning-foreground ring-warning/20',
        info: 'bg-info text-info-foreground ring-info/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
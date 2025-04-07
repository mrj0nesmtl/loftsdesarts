import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        default: 'h-5 w-5',
        sm: 'h-4 w-4',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-primary',
        muted: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, variant, className }: SpinnerProps) {
  return (
    <Loader2 className={cn(spinnerVariants({ size, variant, className }))} />
  );
} 
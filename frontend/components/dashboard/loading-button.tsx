'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type LoadingButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
  secondary:
    'border border-border text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  danger:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 py-2 text-sm gap-1.5',
};

export function LoadingButton({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

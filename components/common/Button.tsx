'use client';

import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-primary text-brand-deep hover:opacity-90 active:opacity-80',
  secondary:
    'bg-surface-card text-text-brand border border-border-default hover:bg-surface-warm active:bg-surface-beige',
  ghost:
    'bg-transparent text-text-muted hover:bg-surface-muted active:bg-surface-beige',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-[13px]',
  md: 'px-6 py-3 text-[14px]',
  lg: 'px-8 py-4 text-[16px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-mono font-medium rounded-pill
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

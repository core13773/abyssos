'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-amber-600 hover:bg-amber-500 text-white border-amber-700',
  secondary:
    'bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600',
  danger:
    'bg-red-800 hover:bg-red-700 text-white border-red-700',
  ghost:
    'bg-transparent hover:bg-white/5 text-stone-300 border-transparent',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-8 py-3 text-base rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        border transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        active:scale-95
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      gradient-primary text-white
      hover:shadow-lg hover:shadow-primary-500/30
      focus:ring-primary-500
      border border-transparent
    `,
    secondary: `
      bg-white text-primary-600
      border border-border-medium
      hover:bg-surface hover:border-primary-500
      focus:ring-primary-500
    `,
    ghost: `
      bg-transparent text-primary-600
      hover:bg-primary-50
      focus:ring-primary-500
      border border-transparent
    `,
    danger: `
      bg-error-500 text-white
      hover:bg-error-700 hover:shadow-lg
      focus:ring-error-500
      border border-transparent
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-700 hover:shadow-lg
      focus:ring-success-500
      border border-transparent
    `,
    gold: `
      gradient-gold text-white
      hover:shadow-lg hover:shadow-gold-500/30
      focus:ring-gold-500
      border border-transparent
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export type { ButtonProps };

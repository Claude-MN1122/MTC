import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  icon,
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center gap-1.5 font-medium rounded-full
    transition-all duration-200 ease-in-out
  `;

  // Variant styles
  const variantStyles = {
    default: `
      bg-surface text-text-secondary border border-border-medium
    `,
    success: `
      bg-success-50 text-success-700 border border-success-500/20
    `,
    warning: `
      bg-warning-50 text-warning-700 border border-warning-500/20
    `,
    error: `
      bg-error-50 text-error-700 border border-error-500/20
    `,
    info: `
      bg-info-50 text-info-700 border border-info-500/20
    `,
    gold: `
      gradient-gold text-white shadow-md shadow-gold-500/20
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <motion.span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.span>
  );
};

export type { BadgeProps };

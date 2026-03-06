import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'elevated' | 'interactive' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  title,
  subtitle,
  action,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    bg-white rounded-2xl
    transition-all duration-200 ease-in-out
  `;

  // Variant styles
  const variantStyles = {
    default: `
      border border-border-light
      shadow-custom-sm
    `,
    elevated: `
      border border-border-light
      shadow-custom-md
    `,
    interactive: `
      border border-border-light
      shadow-custom-sm
      cursor-pointer
      hover-lift
    `,
    bordered: `
      border-2 border-primary-100
      shadow-custom-sm
    `,
  };

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverable ? 'hover-lift' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-h3 text-text-primary">{title}</h3>
            )}
            {subtitle && (
              <p className="text-small text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        {typeof title === 'string' ? (
          <h3 className="text-h3 text-text-primary">{title}</h3>
        ) : (
          title
        )}
        {subtitle && (
          <p className="text-small text-text-muted mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

export type { CardProps, CardHeaderProps };

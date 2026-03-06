'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  variant?: 'default' | 'highlighted';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  variant = 'default',
}) => {
  const isPositive = change && change >= 0;

  return (
    <Card 
      variant={variant === 'highlighted' ? 'elevated' : 'default'} 
      padding="lg"
      className={`
        transition-all duration-200
        ${variant === 'highlighted' ? 'gradient-primary text-white border-none' : 'hover-lift'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className={`p-2 rounded-lg ${
            variant === 'highlighted' ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-600'
          }`}>
            <div className="text-xl">{icon}</div>
          </div>
        )}
        {change !== undefined && (
          <Badge 
            variant={isPositive ? 'success' : 'error'} 
            size="sm"
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </Badge>
        )}
      </div>

      <div>
        <p className={`text-small mb-1 ${variant === 'highlighted' ? 'text-white/80' : 'text-text-muted'}`}>
          {title}
        </p>
        <h3 className={`text-h2 font-bold ${variant === 'highlighted' ? 'text-white' : 'text-text-primary'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {description && (
          <p className={`text-xs mt-1 ${variant === 'highlighted' ? 'text-white/60' : 'text-text-secondary'}`}>
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export type { StatCardProps };

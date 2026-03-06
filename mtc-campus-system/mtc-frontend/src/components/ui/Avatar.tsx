import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
  showStatus = false,
  status = 'offline',
}) => {
  // Get initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Size styles
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  // Status color
  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-text-muted',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        className={`
          ${sizeStyles[size]}
          rounded-full gradient-primary
          flex items-center justify-center
          text-white font-semibold
          overflow-hidden flex-shrink-0
        `}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </motion.div>

      {showStatus && (
        <span
          className={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export type { AvatarProps };

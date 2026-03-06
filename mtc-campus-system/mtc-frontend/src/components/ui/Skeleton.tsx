import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseStyles = `
    skeleton
    transition-all duration-300 ease-in-out
  `;

  const variantStyles = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'string' ? width : `${width}px`;
  if (height) style.height = typeof height === 'string' ? height : `${height}px`;

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
};

interface CardSkeletonProps {
  showHeader?: boolean;
  showImage?: boolean;
  paragraphLines?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showHeader = false,
  showImage = false,
  paragraphLines = 2,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-border-light ${className}`}>
      {showImage && (
        <Skeleton variant="rounded" className="mb-4" width="100%" height="200px" />
      )}
      
      {showHeader && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton variant="text" className="mb-2" width="60%" height="24px" />
            <Skeleton variant="text" width="40%" height="16px" />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: paragraphLines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === paragraphLines - 1 ? '60%' : '100%'}
            height="16px"
          />
        ))}
      </div>
    </div>
  );
};

export type { SkeletonProps, CardSkeletonProps };

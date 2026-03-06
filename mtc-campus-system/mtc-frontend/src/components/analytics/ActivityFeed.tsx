'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiActivity, FiHome, FiUsers, FiCode } from 'react-icons/fi';

interface ActivityItem {
  id: number;
  type: 'student' | 'accommodation' | 'dining' | 'system';
  action: string;
  name: string;
  time: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = [],
  isLoading = false,
  title = 'Recent Activity',
  subtitle = 'Latest actions across the campus system',
  onViewAll,
}) => {
  const getIconForType = (type: ActivityItem['type']) => {
    switch (type) {
      case 'student': return <FiUsers />;
      case 'accommodation': return <FiHome />;
      case 'dining': return <FiCode />;
      default: return <FiActivity />;
    }
  };

  const getColorForType = (type: ActivityItem['type']) => {
    switch (type) {
      case 'student': return 'bg-blue-50 text-blue-600';
      case 'accommodation': return 'bg-green-50 text-green-600';
      case 'dining': return 'bg-orange-50 text-orange-600';
      default: return 'bg-purple-50 text-purple-600';
    }
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="none">
        <div className="p-6 border-b border-border-light">
          <Skeleton variant="text" width="40%" height="24px" />
          <Skeleton variant="text" width="60%" height="16px" className="mt-2" />
        </div>
        <div className="divide-y divide-border-light">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="80%" height="16px" />
                <Skeleton variant="text" width="60%" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none">
      <div className="p-6 border-b border-border-light">
        <h3 className="text-h3 font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-small text-text-muted mt-1">{subtitle}</p>
        )}
      </div>

      <div className="divide-y divide-border-light">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 hover:bg-surface transition-colors flex items-start gap-4"
          >
            <div className={`p-2 rounded-lg ${getColorForType(activity.type)}`}>
              <div className="text-lg">{getIconForType(activity.type)}</div>
            </div>

            <div className="flex-1">
              <p className="text-body font-medium text-text-primary">
                {activity.action}
              </p>
              <p className="text-small text-text-secondary">
                {activity.name}
              </p>
            </div>

            <div className="text-right text-xs text-text-muted">
              {activity.time}
            </div>
          </div>
        ))}
      </div>

      {onViewAll && (
        <div className="p-4 border-t border-border-light bg-surface/50">
          <button
            onClick={onViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View all activity →
          </button>
        </div>
      )}
    </Card>
  );
};

export type { ActivityFeedProps };

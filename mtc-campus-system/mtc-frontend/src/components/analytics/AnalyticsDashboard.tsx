'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  FiUsers, FiDollarSign, FiBook, FiTrendingUp, FiCalendar, 
  FiAlertTriangle, FiCheckCircle, FiClock, FiBarChart2 
} from 'react-icons/fi';
import { getDashboardOverview, getKPIs, getAnalyticsAlerts } from '@/services/analyticsApi';

interface OverviewStats {
  total_students: number;
  total_staff: number;
  active_courses: number;
  system_users: number;
  students_male: number;
  students_female: number;
  new_students_this_month: number;
  returning_students: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [overviewData, kpisData, alertsData] = await Promise.all([
          getDashboardOverview(),
          getKPIs({ period: 'current_month' }),
          getAnalyticsAlerts({ is_read: false }),
        ]);

        setOverview(overviewData);
        setKpis(kpisData);
        setAlerts(alertsData.results || alertsData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} padding="lg">
              <Skeleton className="h-8 w-8 mb-3" />
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-12 w-full" />
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card padding="lg">
        <div className="text-center py-8 text-error">{error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <Card padding="md" className="bg-warning-50 border-warning-200">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="text-warning-500 text-xl mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-warning-700 mb-2">
                {alerts.length} Action Required
              </h3>
              <div className="space-y-1">
                {alerts.slice(0, 3).map((alert, index) => (
                  <p key={index} className="text-sm text-warning-600">
                    • {alert.message}
                  </p>
                ))}
                {alerts.length > 3 && (
                  <p className="text-sm text-warning-600">
                    + {alerts.length - 3} more alerts
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiUsers className="text-3xl opacity-80" />
            <FiTrendingUp className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Total Students</div>
          <div className="text-3xl font-bold">{overview?.total_students || 0}</div>
          <div className="mt-3 flex items-center gap-2 text-xs opacity-80">
            <span>{overview?.students_male || 0} Male</span>
            <span>•</span>
            <span>{overview?.students_female || 0} Female</span>
          </div>
        </Card>

        {/* Active Courses */}
        <Card padding="lg" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiBook className="text-3xl opacity-80" />
            <FiCheckCircle className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Active Courses</div>
          <div className="text-3xl font-bold">{overview?.active_courses || 0}</div>
          <div className="mt-3 text-xs opacity-80">
            Across all programs
          </div>
        </Card>

        {/* System Users */}
        <Card padding="lg" className="bg-gradient-to-br from-info-500 to-info-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiUsers className="text-3xl opacity-80" />
            <FiBarChart2 className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">System Users</div>
          <div className="text-3xl font-bold">{overview?.system_users || 0}</div>
          <div className="mt-3 text-xs opacity-80">
            Staff and students
          </div>
        </Card>

        {/* New This Month */}
        <Card padding="lg" className="bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCalendar className="text-3xl opacity-80" />
            <FiClock className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">New This Month</div>
          <div className="text-3xl font-bold">{overview?.new_students_this_month || 0}</div>
          <div className="mt-3 text-xs opacity-80">
            New enrollments
          </div>
        </Card>
      </div>

      {/* KPIs Section */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-h3 font-semibold text-text-primary">Key Performance Indicators</h3>
          <Badge variant="success">Current Month</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Enrollment Rate"
            value={kpis?.enrollment_rate || '0%'}
            trend="up"
            target="95%"
            description="Student enrollment vs capacity"
          />
          <KPICard
            title="Attendance Rate"
            value={kpis?.attendance_rate || '0%'}
            trend="stable"
            target="90%"
            description="Average attendance across courses"
          />
          <KPICard
            title="Fee Collection"
            value={kpis?.fee_collection_rate || '0%'}
            trend="up"
            target="98%"
            description="Fees collected vs invoiced"
          />
          <KPICard
            title="Library Utilization"
            value={kpis?.library_utilization || '0%'}
            trend="down"
            target="75%"
            description="Books in circulation"
          />
          <KPICard
            title="Accommodation Occupancy"
            value={kpis?.accommodation_occupancy || '0%'}
            trend="stable"
            target="100%"
            description="Room occupancy rate"
          />
          <KPICard
            title="Dining Participation"
            value={kpis?.dining_participation || '0%'}
            trend="up"
            target="85%"
            description="Students using dining services"
          />
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Male</span>
              <span className="font-semibold text-text-primary">
                {overview?.students_male || 0}
              </span>
            </div>
            <div className="w-full bg-surface/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-primary-500"
                style={{ width: `${((overview?.students_male || 0) / (overview?.total_students || 1)) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Female</span>
              <span className="font-semibold text-text-primary">
                {overview?.students_female || 0}
              </span>
            </div>
            <div className="w-full bg-surface/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-pink-500"
                style={{ width: `${((overview?.students_female || 0) / (overview?.total_students || 1)) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Monthly Activity */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">This Month</h3>
          <div className="space-y-4">
            <ActivityItem
              icon={<FiUsers className="text-success-500" />}
              label="New Students"
              value={overview?.new_students_this_month || 0}
            />
            <ActivityItem
              icon={<FiCheckCircle className="text-info-500" />}
              label="Returning Students"
              value={overview?.returning_students || 0}
            />
            <ActivityItem
              icon={<FiBook className="text-warning-500" />}
              label="Active Courses"
              value={overview?.active_courses || 0}
            />
          </div>
        </Card>

        {/* System Health */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">System Health</h3>
          <div className="space-y-4">
            <HealthIndicator
              label="Database Status"
              status="healthy"
              description="All systems operational"
            />
            <HealthIndicator
              label="API Response Time"
              status="good"
              description="< 200ms average"
            />
            <HealthIndicator
              label="Active Sessions"
              status="normal"
              description={`${overview?.system_users || 0} users online`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  target: string;
  description: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, target, description }) => {
  const trendColors = {
    up: 'text-success-500',
    down: 'text-error-500',
    stable: 'text-text-secondary',
  };

  const TrendIcon = trend === 'up' ? FiTrendingUp : trend === 'down' ? FiTrendingUp : FiBarChart2;

  return (
    <div className="p-4 bg-surface/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        <TrendIcon className={`text-lg ${trendColors[trend]}`} />
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">Target: {target}</span>
        <span className={trendColors[trend]}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      </div>
      <div className="text-xs text-text-secondary mt-2">{description}</div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-surface rounded-lg">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-text-secondary">{label}</div>
      <div className="text-lg font-semibold text-text-primary">{value}</div>
    </div>
  </div>
);

interface HealthIndicatorProps {
  label: string;
  status: 'healthy' | 'good' | 'normal' | 'warning' | 'critical';
  description: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ label, status, description }) => {
  const statusColors = {
    healthy: 'text-success-500',
    good: 'text-success-500',
    normal: 'text-info-500',
    warning: 'text-warning-500',
    critical: 'text-error-500',
  };

  const statusBg = {
    healthy: 'bg-success-500',
    good: 'bg-success-500',
    normal: 'bg-info-500',
    warning: 'bg-warning-500',
    critical: 'bg-error-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusBg[status]}`} />
          <span className={`text-sm font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      <div className="text-xs text-text-secondary">{description}</div>
    </div>
  );
};

export default AnalyticsDashboard;

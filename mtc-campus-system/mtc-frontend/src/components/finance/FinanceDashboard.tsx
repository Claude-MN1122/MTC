'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';
import { getDashboardStats } from '@/services/financeApi';
import type { DashboardStats } from '@/services/financeApi';

export const FinanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load finance statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} padding="lg">
            <Skeleton className="h-8 w-8 mb-3" />
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
        ))}
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
      {/* Primary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card padding="lg" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiDollarSign className="text-3xl opacity-80" />
            <FiTrendingUp className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">
            ${stats?.total_collected.toLocaleString() || '0'}
          </div>
        </Card>

        {/* Total Invoiced */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCalendar className="text-3xl opacity-80" />
            <FiDollarSign className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Total Invoiced</div>
          <div className="text-3xl font-bold">
            ${stats?.total_invoiced.toLocaleString() || '0'}
          </div>
        </Card>

        {/* Outstanding Balance */}
        <Card padding="lg" className="bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiAlertCircle className="text-3xl opacity-80" />
            <FiClock className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Outstanding Balance</div>
          <div className="text-3xl font-bold">
            ${stats?.outstanding_balance.toLocaleString() || '0'}
          </div>
        </Card>

        {/* Overdue Amount */}
        <Card padding="lg" className="bg-gradient-to-br from-error-500 to-error-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiAlertCircle className="text-3xl opacity-80" />
            <FiClock className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Overdue Amount</div>
          <div className="text-3xl font-bold">
            ${stats?.overdue_amount.toLocaleString() || '0'}
          </div>
        </Card>
      </div>

      {/* Secondary Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Collection Rate */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <FiCheckCircle className="text-2xl text-success-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Collection Rate</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.collection_rate.toFixed(1) || '0'}%
              </div>
            </div>
          </div>
          <div className="w-full bg-surface/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-success-500 transition-all duration-500"
              style={{ width: `${Math.min(stats?.collection_rate || 0, 100)}%` }}
            />
          </div>
        </Card>

        {/* Pending Invoices */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-warning-100 rounded-lg">
              <FiClock className="text-2xl text-warning-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Pending Invoices</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.invoices_pending || 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">Awaiting payment</div>
        </Card>

        {/* Overdue Invoices */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-error-100 rounded-lg">
              <FiAlertCircle className="text-2xl text-error-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Overdue Invoices</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.invoices_overdue || 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">Requires attention</div>
        </Card>
      </div>

      {/* Payment Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payments Today */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Today's Activity</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold text-text-primary">
                {stats?.payments_today || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">payments received</div>
            </div>
          </div>
        </Card>

        {/* Payments This Month */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">This Month</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold text-text-primary">
                {stats?.payments_this_month || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">total payments</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card padding="lg">
        <h3 className="text-h3 font-semibold text-text-primary mb-6">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="Revenue Collected"
            value={`$${stats?.total_collected.toLocaleString() || '0'}`}
            subtitle={`${((stats?.total_collected || 0) / (stats?.total_invoiced || 1) * 100).toFixed(1)}% of invoiced amount`}
            icon={<FiDollarSign className="text-2xl text-success-500" />}
            trend="positive"
          />
          <InsightCard
            title="Outstanding"
            value={`$${stats?.outstanding_balance.toLocaleString() || '0'}`}
            subtitle={`${stats?.invoices_pending} invoices pending`}
            icon={<FiAlertCircle className="text-2xl text-warning-500" />}
            trend="neutral"
          />
          <InsightCard
            title="Overdue"
            value={`$${stats?.overdue_amount.toLocaleString() || '0'}`}
            subtitle={`${stats?.invoices_overdue} invoices overdue`}
            icon={<FiClock className="text-2xl text-error-500" />}
            trend="negative"
          />
        </div>
      </Card>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: 'positive' | 'neutral' | 'negative';
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, subtitle, icon, trend }) => {
  const trendColors = {
    positive: 'text-success-500',
    neutral: 'text-text-primary',
    negative: 'text-error-500',
  };

  return (
    <div className="p-4 bg-surface/50 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-white rounded-lg ${trendColors[trend]}`}>{icon}</div>
        <span className="text-sm font-medium text-text-secondary">{title}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-xs text-text-secondary">{subtitle}</div>
    </div>
  );
};

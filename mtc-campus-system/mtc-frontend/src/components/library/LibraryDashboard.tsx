'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiBook, FiCheckCircle, FiAlertTriangle, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { getDashboardStats } from '@/services/libraryApi';
import type { DashboardStats } from '@/services/libraryApi';

export const LibraryDashboard: React.FC = () => {
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
        setError(err.message || 'Failed to load library statistics');
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
        {/* Total Books */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiBook className="text-3xl opacity-80" />
            <FiTrendingUp className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Total Books</div>
          <div className="text-3xl font-bold">{stats?.total_books || 0}</div>
        </Card>

        {/* Books Available */}
        <Card padding="lg" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCheckCircle className="text-3xl opacity-80" />
            <FiBook className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Available Books</div>
          <div className="text-3xl font-bold">{stats?.books_available || 0}</div>
        </Card>

        {/* Books Borrowed */}
        <Card padding="lg" className="bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiClock className="text-3xl opacity-80" />
            <FiBook className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Borrowed Books</div>
          <div className="text-3xl font-bold">{stats?.books_borrowed || 0}</div>
        </Card>

        {/* Overdue Books */}
        <Card padding="lg" className="bg-gradient-to-br from-error-500 to-error-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiAlertTriangle className="text-3xl opacity-80" />
            <FiClock className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Overdue Books</div>
          <div className="text-3xl font-bold">{stats?.overdue_books || 0}</div>
        </Card>
      </div>

      {/* Secondary Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Reservations */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-info-100 rounded-lg">
              <FiClock className="text-2xl text-info-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Active Reservations</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.active_reservations || 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">Waiting for books</div>
        </Card>

        {/* Fines Collected */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <FiCheckCircle className="text-2xl text-success-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Fines Collected</div>
              <div className="text-2xl font-bold text-text-primary">
                ${stats?.fines_collected.toLocaleString() || '0'}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">Total collected fines</div>
        </Card>

        {/* Pending Fines */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-warning-100 rounded-lg">
              <FiAlertTriangle className="text-2xl text-warning-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Pending Fines</div>
              <div className="text-2xl font-bold text-text-primary">
                ${stats?.pending_fines.toLocaleString() || '0'}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">Awaiting payment</div>
        </Card>
      </div>

      {/* Daily Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Books Issued Today */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Today's Activity</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold text-text-primary">
                {stats?.books_issued_today || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">books issued</div>
            </div>
          </div>
        </Card>

        {/* Books Returned Today */}
        <Card padding="lg">
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Returns Today</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold text-success-500">
                {stats?.books_returned_today || 0}
              </div>
              <div className="text-sm text-text-secondary mt-1">books returned</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Collection Stats */}
      <Card padding="lg">
        <h3 className="text-h3 font-semibold text-text-primary mb-6">Library Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OverviewCard
            title="Total Categories"
            value={stats?.total_categories || 0}
            subtitle="Book categories"
            icon={<FiBook className="text-2xl text-primary-500" />}
          />
          <OverviewCard
            title="Utilization Rate"
            value={`${(((stats?.books_borrowed || 0) / (stats?.total_books || 1)) * 100).toFixed(1)}%`}
            subtitle="Books in circulation"
            icon={<FiTrendingUp className="text-2xl text-success-500" />}
          />
          <OverviewCard
            title="Availability Rate"
            value={`${(((stats?.books_available || 0) / (stats?.total_books || 1)) * 100).toFixed(1)}%`}
            subtitle="Currently available"
            icon={<FiCheckCircle className="text-2xl text-info-500" />}
          />
        </div>
      </Card>
    </div>
  );
};

interface OverviewCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="p-4 bg-surface/50 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg text-primary-500">{icon}</div>
        <span className="text-sm font-medium text-text-secondary">{title}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-xs text-text-secondary">{subtitle}</div>
    </div>
  );
};

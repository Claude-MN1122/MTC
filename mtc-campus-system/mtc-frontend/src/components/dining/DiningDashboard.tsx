'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiCoffee, FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { getTodayStatistics } from '@/services/diningApi';

interface DiningStats {
  total_meals_served: number;
  breakfast_count: number;
  lunch_count: number;
  dinner_count: number;
  unique_students: number;
  peak_hour?: string;
}

export const DiningDashboard: React.FC = () => {
  const [stats, setStats] = useState<DiningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getTodayStatistics();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load dining statistics');
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Meals */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCoffee className="text-3xl opacity-80" />
            <FiTrendingUp className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Total Meals Today</div>
          <div className="text-3xl font-bold">{stats?.total_meals_served || 0}</div>
        </Card>

        {/* Unique Students */}
        <Card padding="lg" className="bg-gradient-to-br from-success-500 to-success-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiUsers className="text-3xl opacity-80" />
            <FiCheckCircle className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Unique Students</div>
          <div className="text-3xl font-bold">{stats?.unique_students || 0}</div>
        </Card>

        {/* Breakfast Count */}
        <Card padding="lg" className="bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCalendar className="text-3xl opacity-80" />
            <FiClock className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Breakfast Served</div>
          <div className="text-3xl font-bold">{stats?.breakfast_count || 0}</div>
        </Card>

        {/* Lunch Count */}
        <Card padding="lg" className="bg-gradient-to-br from-info-500 to-info-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCoffee className="text-3xl opacity-80" />
            <FiCheckCircle className="text-xl opacity-60" />
          </div>
          <div className="text-sm opacity-80 mb-1">Lunch Served</div>
          <div className="text-3xl font-bold">{stats?.lunch_count || 0}</div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dinner Count */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiCoffee className="text-2xl text-primary-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Dinner Served</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.dinner_count || 0}
              </div>
            </div>
          </div>
        </Card>

        {/* Peak Hour */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <FiClock className="text-2xl text-success-500" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Peak Hour Today</div>
              <div className="text-2xl font-bold text-text-primary">
                {stats?.peak_hour || 'N/A'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Meal Distribution */}
      <Card padding="lg">
        <h3 className="text-h3 font-semibold text-text-primary mb-6">Meal Distribution</h3>
        <div className="space-y-4">
          {stats && (
            <>
              <MealProgressBar
                label="Breakfast"
                count={stats.breakfast_count}
                total={stats.total_meals_served}
                color="bg-warning-500"
              />
              <MealProgressBar
                label="Lunch"
                count={stats.lunch_count}
                total={stats.total_meals_served}
                color="bg-info-500"
              />
              <MealProgressBar
                label="Dinner"
                count={stats.dinner_count}
                total={stats.total_meals_served}
                color="bg-primary-500"
              />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

interface MealProgressBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const MealProgressBar: React.FC<MealProgressBarProps> = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <span className="text-sm text-text-primary font-semibold">
          {count} / {total} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-surface/50 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiBook, FiDollarSign, FiHome, FiCoffee, FiAlertCircle } from 'react-icons/fi';
import { getEnrollmentAnalytics, getAcademicPerformanceAnalytics } from '../../services/analyticsApi';
import type { EnrollmentAnalytics, AcademicPerformance } from '../../services/analyticsApi';

interface EnrollmentCardProps {
  title: string;
  count: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
  color: string;
}

const EnrollmentCard: React.FC<EnrollmentCardProps> = ({ title, count, percentage, trend, color }) => {
  const getColorClass = () => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className={`bg-gradient-to-br ${getColorClass()} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        {trend === 'up' && <FiTrendingUp className="text-white/80" />}
        {trend === 'down' && <FiTrendingDown className="text-white/80" />}
        {trend === 'stable' && <FiAlertCircle className="text-white/80" />}
      </div>
      <div className="text-3xl font-bold mb-2">{count.toLocaleString()}</div>
      <div className="text-sm opacity-90">{percentage.toFixed(1)}% of total</div>
    </div>
  );
};

export const EnrollmentAnalyticsPanel: React.FC = () => {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnrollmentAnalytics = async () => {
      try {
        const data = await getEnrollmentAnalytics({ period: 'yearly' });
        setEnrollmentData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load enrollment analytics');
      } finally {
        setLoading(false);
      }
    };

    loadEnrollmentAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700">
        <FiAlertCircle className="inline mr-2" />
        {error}
      </div>
    );
  }

  if (!enrollmentData) {
    return (
      <div className="text-text-500 text-center py-12">
        No enrollment data available
      </div>
    );
  }

  const getColorForIndex = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Program Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-text-900 mb-4">Enrollment by Program</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollmentData.enrollments_by_program.map((program, index) => (
            <EnrollmentCard
              key={program.program}
              title={program.program}
              count={program.count}
              percentage={program.percentage}
              trend="stable"
              color={getColorForIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Year-over-Year Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Year-over-Year Enrollment Trends</h3>
        <div className="space-y-4">
          {enrollmentData.enrollments_by_year.map((year) => (
            <div key={year.year} className="flex items-center justify-between p-4 bg-bg-50 rounded-lg">
              <div>
                <div className="font-semibold text-text-900">{year.year}</div>
                <div className="text-sm text-text-500">{year.count.toLocaleString()} enrollments</div>
              </div>
              <div className={`flex items-center ${year.growth_rate >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {year.growth_rate >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                <span className="ml-2 font-semibold">{Math.abs(year.growth_rate).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend Data */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Monthly Enrollment Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {enrollmentData.trend_data.map((month, index) => {
            const maxCount = Math.max(...enrollmentData.trend_data.map(d => d.count));
            const heightPercentage = (month.count / maxCount) * 100;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-600 rounded-t transition-all duration-300"
                  style={{ height: `${heightPercentage}%` }}
                />
                <div className="text-xs text-text-500 mt-2 transform -rotate-45 origin-top-left">
                  {month.month.substring(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

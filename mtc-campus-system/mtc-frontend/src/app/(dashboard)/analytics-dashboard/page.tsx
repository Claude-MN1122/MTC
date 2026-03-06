'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, ActivityFeed } from '@/components/analytics';
import { Chart } from '@/components/charts';
import { FiUsers, FiHome, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

// Sample data for charts - Replace with real API data
const enrollmentData = [
  { name: 'Jan', students: 1100 },
  { name: 'Feb', students: 1150 },
  { name: 'Mar', students: 1200 },
  { name: 'Apr', students: 1180 },
  { name: 'May', students: 1248 },
];

const revenueData = [
  { name: 'Jan', revenue: 95000 },
  { name: 'Feb', revenue: 105000 },
  { name: 'Mar', revenue: 115000 },
  { name: 'Apr', revenue: 120000 },
  { name: 'May', revenue: 125000 },
];

const occupancyData = [
  { name: 'Hostel A', value: 85 },
  { name: 'Hostel B', value: 72 },
  { name: 'Hostel C', value: 65 },
  { name: 'Hostel D', value: 90 },
];

const mealPlanData = [
  { name: 'Basic', value: 350 },
  { name: 'Standard', value: 520 },
  { name: 'Premium', value: 280 },
  { name: 'VIP', value: 98 },
];

const recentActivities: import('@/components/analytics/ActivityFeed').ActivityFeedProps['activities'] = [
  { id: 1, type: 'student', action: 'New student registered', name: 'Tinashe Moyo', time: '5 min ago' },
  { id: 2, type: 'accommodation', action: 'Room allocated', name: 'Farai Chikomo - Room 204', time: '12 min ago' },
  { id: 3, type: 'dining', action: 'Meal plan purchased', name: 'Luvuyo Mthembu', time: '25 min ago' },
  { id: 4, type: 'student', action: 'ID card generated', name: 'Ruvimbo Ncube', time: '1 hour ago' },
  { id: 5, type: 'accommodation', action: 'Maintenance completed', name: 'Block C - Room 301', time: '2 hours ago' },
];

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout pageTitle="Analytics Dashboard">
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-h1 font-bold text-text-primary mb-2">
            Campus Analytics Overview
          </h1>
          <p className="text-body text-text-secondary">
            Comprehensive insights into campus operations and performance
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={1248}
            change={12.5}
            icon={<FiUsers />}
            description="Active enrollments"
          />
          <StatCard
            title="Accommodation Revenue"
            value="$125,000"
            change={8.7}
            icon={<FiHome />}
            description="Monthly revenue"
          />
          <StatCard
            title="Dining Revenue"
            value="$87,500"
            change={5.3}
            icon={<FiDollarSign />}
            description="Monthly revenue"
          />
          <StatCard
            title="Overall Growth"
            value="9.8%"
            change={2.1}
            icon={<FiTrendingUp />}
            description="Year-over-year"
          />
        </div>

        {/* Charts Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Enrollment Trend */}
          <Chart
            type="line"
            title="Student Enrollment Trends"
            subtitle="Monthly enrollment over the past 5 months"
            data={enrollmentData}
            dataKey="students"
            isLoading={isLoading}
            height={300}
            stroke="#3B82F6"
          />

          {/* Revenue Analysis */}
          <Chart
            type="area"
            title="Revenue Analysis"
            subtitle="Monthly revenue trend (USD)"
            data={revenueData}
            dataKey="revenue"
            isLoading={isLoading}
            height={300}
            stroke="#10B981"
          />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hostel Occupancy */}
          <Chart
            type="bar"
            title="Hostel Occupancy Rates"
            subtitle="Current occupancy by hostel (%)"
            data={occupancyData}
            dataKey="value"
            isLoading={isLoading}
            height={300}
            fill="#3B82F6"
          />

          {/* Meal Plan Distribution */}
          <Chart
            type="pie"
            title="Meal Plan Distribution"
            subtitle="Students by meal plan type"
            data={mealPlanData}
            dataKey="value"
            nameKey="name"
            isLoading={isLoading}
            height={300}
            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
          />
        </div>

        {/* Recent Activity Feed */}
        <div>
          <ActivityFeed
            activities={recentActivities}
            isLoading={isLoading}
            title="Recent Campus Activity"
            subtitle="Latest actions and events across all departments"
            onViewAll={() => console.log('View all activity')}
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Occupancy Rate</h3>
            <p className="text-4xl font-bold mb-2">78.3%</p>
            <p className="text-sm opacity-80">+5.2% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Meals Today</h3>
            <p className="text-4xl font-bold mb-2">892</p>
            <p className="text-sm opacity-80">Served across all halls</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">ID Cards Issued</h3>
            <p className="text-4xl font-bold mb-2">1,180</p>
            <p className="text-sm opacity-80">94.5% of students</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

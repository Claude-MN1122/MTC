'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiHome, 
  FiCoffee, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';

// Mock data - Replace with real API calls
const statsData = {
  totalStudents: 1248,
  studentChange: 12.5,
  accommodationOccupancy: 78.3,
  accommodationChange: 5.2,
  dailyMeals: 892,
  mealsChange: -2.4,
  monthlyRevenue: 125000,
  revenueChange: 8.7,
};

const recentActivities = [
  { id: 1, type: 'student', action: 'New student registered', name: 'Tinashe Moyo', time: '5 minutes ago' },
  { id: 2, type: 'accommodation', action: 'Room allocated', name: 'Farai Chikomo - Room 204', time: '12 minutes ago' },
  { id: 3, type: 'dining', action: 'Meal scanned', name: 'Lunch service - Hall A', time: '25 minutes ago' },
  { id: 4, type: 'student', action: 'ID card generated', name: 'Ruvimbo Ncube', time: '1 hour ago' },
  { id: 5, type: 'accommodation', action: 'Application approved', name: 'Tariro Gumbo', time: '2 hours ago' },
];

const upcomingEvents = [
  { id: 1, title: 'Registration Deadline', date: 'March 15, 2026', type: 'deadline' },
  { id: 2, title: 'Hostel Inspection', date: 'March 18, 2026', type: 'maintenance' },
  { id: 3, title: 'Dining Menu Update', date: 'March 20, 2026', type: 'dining' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  const colorVariants = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="transition-all duration-200"
    >
      <Card variant="interactive" padding="lg" className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorVariants[color]}`}>
            <div className="text-2xl">{icon}</div>
          </div>
          <Badge variant={isPositive ? 'success' : 'error'} size="sm" icon={isPositive ? <FiTrendingUp /> : <FiTrendingDown />}>
            {Math.abs(change)}%
          </Badge>
        </div>
        
        <div>
          <p className="text-small text-text-muted mb-1">{title}</p>
          <h3 className="text-h2 font-bold text-text-primary">{value.toLocaleString()}</h3>
          <p className={`text-xs mt-1 ${isPositive ? 'text-success-700' : 'text-error-700'}`}>
            {isPositive ? '↑' : '↓'} from last month
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} showHeader paragraphLines={2} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton showHeader paragraphLines={5} />
          </div>
          <div>
            <CardSkeleton showHeader paragraphLines={4} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card variant="elevated" padding="lg" className="gradient-primary text-white border-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h2 font-bold mb-2">Welcome back! 👋</h2>
                <p className="text-body opacity-90">
                  Here's what's happening at MTC Campus today.
                </p>
                <p className="text-small opacity-75 mt-2">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-6xl font-bold opacity-50">M</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <div>
          <h3 className="text-h3 mb-4 text-text-primary">Overview Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={statsData.totalStudents}
              change={statsData.studentChange}
              icon={<FiUsers />}
              color="blue"
            />
            <StatCard
              title="Accommodation Occupancy"
              value={`${statsData.accommodationOccupancy}%`}
              change={statsData.accommodationChange}
              icon={<FiHome />}
              color="green"
            />
            <StatCard
              title="Meals Served Today"
              value={statsData.dailyMeals}
              change={statsData.mealsChange}
              icon={<FiCoffee />}
              color="orange"
            />
            <StatCard
              title="Monthly Revenue ($)"
              value={statsData.monthlyRevenue}
              change={statsData.revenueChange}
              icon={<FiDollarSign />}
              color="purple"
            />
          </div>
        </div>

        {/* Activity Feed & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card variant="elevated" padding="none">
              <CardHeader 
                title={
                  <div className="flex items-center gap-2">
                    <FiActivity className="text-primary-500" />
                    Recent Activity
                  </div>
                }
                subtitle="Latest actions across the campus system"
              />
              
              <div className="border-t border-border-light">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 hover:bg-surface transition-colors border-b border-border-light last:border-b-0"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'student' ? 'bg-blue-50 text-blue-600' :
                      activity.type === 'accommodation' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {activity.type === 'student' ? <FiUsers /> :
                       activity.type === 'accommodation' ? <FiHome /> :
                       <FiCoffee />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-body font-medium text-text-primary">
                        {activity.action}
                      </p>
                      <p className="text-small text-text-secondary">
                        {activity.name}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <FiClock className="text-xs" />
                        {activity.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border-light bg-surface/50">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  View all activity →
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="elevated" padding="none">
              <CardHeader 
                title={
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-primary-500" />
                    Upcoming Events
                  </div>
                }
                subtitle="Important dates and deadlines"
              />
              
              <div className="border-t border-border-light">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 hover:bg-surface transition-colors border-b border-border-light last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                        {event.date.split(' ')[1].replace(',', '')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-body font-semibold text-text-primary mb-1">
                          {event.title}
                        </h4>
                        <p className="text-small text-text-secondary">
                          {event.date.split(',').slice(1).join(',').trim()}
                        </p>
                        <Badge 
                          variant={
                            event.type === 'deadline' ? 'error' :
                            event.type === 'maintenance' ? 'info' :
                            'warning'
                          }
                          size="sm"
                          className="mt-2"
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border-light bg-surface/50">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  View calendar →
                </button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-h3 mb-4 text-text-primary">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Add Student', icon: <FiUsers /> },
              { label: 'Allocate Room', icon: <FiHome /> },
              { label: 'Generate ID', icon: <FiCalendar /> },
              { label: 'Scan QR', icon: <FiActivity /> },
              { label: 'View Reports', icon: <FiDollarSign /> },
              { label: 'Settings', icon: <FiClock /> },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white border border-border-light rounded-xl hover:shadow-lg hover:border-primary-200 transition-all duration-200 group"
              >
                <div className="text-primary-500 text-2xl mb-2 group-hover:text-primary-600 transition-colors">
                  {action.icon}
                </div>
                <p className="text-small font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  {action.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// CardSkeleton helper component
function CardSkeleton({ showHeader, paragraphLines }: { showHeader?: boolean; paragraphLines: number }) {
  return (
    <Card padding="lg">
      {showHeader && (
        <div className="mb-4">
          <Skeleton variant="text" width="60%" height="24px" />
          <Skeleton variant="text" width="40%" height="16px" className="mt-2" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: paragraphLines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === paragraphLines - 1 ? '60%' : '100%'}
            height="16px"
          />
        ))}
      </div>
    </Card>
  );
}

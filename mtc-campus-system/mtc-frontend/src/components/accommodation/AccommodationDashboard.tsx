'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FiUsers, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';

interface StatisticsProps {
  totalHostels?: number;
  totalRooms?: number;
  totalStudents?: number;
  availableSpaces?: number;
  occupancyRate?: number;
  pendingApplications?: number;
  approvedApplications?: number;
  waitingList?: number;
}

export const AccommodationDashboard: React.FC<StatisticsProps> = ({
  totalHostels = 0,
  totalRooms = 0,
  totalStudents = 0,
  availableSpaces = 0,
  occupancyRate = 0,
  pendingApplications = 0,
  approvedApplications = 0,
  waitingList = 0,
}) => {
  const stats = [
    {
      title: 'Total Hostels',
      value: totalHostels,
      icon: <FiUsers className="text-2xl" />,
      color: 'bg-blue-500',
      trend: '+2 this month',
    },
    {
      title: 'Total Rooms',
      value: totalRooms,
      icon: <FiCheckCircle className="text-2xl" />,
      color: 'bg-green-500',
      trend: `${totalStudents} occupied`,
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate.toFixed(1)}%`,
      icon: <FiTrendingUp className="text-2xl" />,
      color: 'bg-purple-500',
      trend: occupancyRate > 75 ? 'High demand' : 'Normal',
    },
    {
      title: 'Available Spaces',
      value: availableSpaces,
      icon: <FiCheckCircle className="text-2xl" />,
      color: 'bg-emerald-500',
      trend: availableSpaces < 10 ? 'Running low!' : 'Plenty available',
    },
  ];

  const applicationStats = [
    {
      title: 'Pending Applications',
      value: pendingApplications,
      icon: <FiClock className="text-3xl" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Approved',
      value: approvedApplications,
      icon: <FiCheckCircle className="text-3xl" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Waiting List',
      value: waitingList,
      icon: <FiUsers className="text-3xl" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} padding="md" variant="elevated" className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-small text-text-muted">{stat.title}</p>
                <p className="text-h2 font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.trend}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Status Cards */}
      <Card padding="md" variant="bordered">
        <h3 className="text-h3 font-semibold mb-4 text-text-primary">Application Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applicationStats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 flex items-center gap-4`}
            >
              <div className={`${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-small text-text-muted">{stat.title}</p>
                <p className="text-h2 font-bold text-text-primary">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AccommodationDashboard;

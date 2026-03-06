'use client';

import React, { useState } from 'react';
import { DiningDashboard } from '@/components/dining/DiningDashboard';
import { AttendanceList } from '@/components/dining/AttendanceList';
import { DiningQRScanner } from '@/components/dining/DiningQRScanner';
import { FiCoffee, FiList, FiBarChart2 } from 'react-icons/fi';

export default function DiningPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'attendance'>('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiBarChart2 className="text-lg" />,
    },
    {
      id: 'scan',
      label: 'QR Scanner',
      icon: <FiCoffee className="text-lg" />,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <FiList className="text-lg" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Dining Hall Management</h1>
          <p className="text-body text-text-secondary mt-1">
            Manage meal plans, track attendance, and monitor dining statistics
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <DiningDashboard />}
      
      {activeTab === 'scan' && (
        <div className="max-w-2xl mx-auto">
          <DiningQRScanner />
        </div>
      )}
      
      {activeTab === 'attendance' && <AttendanceList />}
    </div>
  );
}

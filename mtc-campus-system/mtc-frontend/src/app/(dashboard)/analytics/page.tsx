'use client';

import React, { useState } from 'react';
import { 
  AnalyticsDashboard,
  EnrollmentAnalyticsPanel,
  AcademicPerformancePanel,
  FinancialAnalyticsPanel,
  LibraryAnalyticsPanel
} from '@/components/analytics';

type AnalyticsTab = 'dashboard' | 'enrollment' | 'academic' | 'finance' | 'library';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'enrollment', label: 'Enrollment', icon: '👥' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'library', label: 'Library', icon: '📚' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'enrollment':
        return <EnrollmentAnalyticsPanel />;
      case 'academic':
        return <AcademicPerformancePanel />;
      case 'finance':
        return <FinancialAnalyticsPanel />;
      case 'library':
        return <LibraryAnalyticsPanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-900 mb-2">Advanced Analytics & Reporting</h1>
        <p className="text-text-500">
          Comprehensive cross-module analytics, KPIs tracking, and data-driven insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-bg-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AnalyticsTab)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-text-500 hover:text-text-700 hover:border-bg-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalyticsPage;

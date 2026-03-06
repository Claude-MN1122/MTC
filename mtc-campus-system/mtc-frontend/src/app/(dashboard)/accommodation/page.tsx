'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AccommodationDashboard } from '@/components/accommodation/AccommodationDashboard';
import { HostelsList } from '@/components/accommodation/HostelsList';
import { RoomsList } from '@/components/accommodation/RoomsList';
import { ApplicationsList } from '@/components/accommodation/ApplicationsList';
import { FiHome, FiCheckCircle, FiFileText, FiUsers } from 'react-icons/fi';

type TabType = 'dashboard' | 'hostels' | 'rooms' | 'applications' | 'waiting-list';

export default function AccommodationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - Replace with API calls
  const mockStats = {
    totalHostels: 4,
    totalRooms: 85,
    totalStudents: 320,
    availableSpaces: 45,
    occupancyRate: 78.5,
    pendingApplications: 23,
    approvedApplications: 297,
    waitingList: 15,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AccommodationDashboard {...mockStats} />;
      
      case 'hostels':
        return (
          <HostelsList
            hostels={[]}
            isLoading={isLoading}
            onAddHostel={() => console.log('Add hostel')}
            onViewHostel={(id) => console.log('View hostel', id)}
            onEditHostel={(id) => console.log('Edit hostel', id)}
            onDeleteHostel={(id) => console.log('Delete hostel', id)}
          />
        );
      
      case 'rooms':
        return (
          <RoomsList
            rooms={[]}
            isLoading={isLoading}
            onAddRoom={() => console.log('Add room')}
            onViewRoom={(id) => console.log('View room', id)}
            onEditRoom={(id) => console.log('Edit room', id)}
            onDeleteRoom={(id) => console.log('Delete room', id)}
          />
        );
      
      case 'applications':
        return (
          <ApplicationsList
            applications={[]}
            isLoading={isLoading}
            onViewApplication={(id) => console.log('View application', id)}
            onApprove={(id) => console.log('Approve application', id)}
            onReject={(id) => console.log('Reject application', id)}
          />
        );
      
      case 'waiting-list':
        return (
          <Card padding="lg">
            <div className="text-center py-12 text-text-muted">
              <FiUsers className="text-5xl mx-auto mb-3 opacity-50" />
              <p className="text-body font-medium">Waiting List Management</p>
              <p className="text-small mt-1">Coming soon - Auto-assign available rooms</p>
            </div>
          </Card>
        );
      
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: <FiHome className="text-lg" /> },
    { id: 'hostels' as TabType, label: 'Hostels', icon: <FiCheckCircle className="text-lg" /> },
    { id: 'rooms' as TabType, label: 'Rooms', icon: <FiCheckCircle className="text-lg" /> },
    { id: 'applications' as TabType, label: 'Applications', icon: <FiFileText className="text-lg" /> },
    { id: 'waiting-list' as TabType, label: 'Waiting List', icon: <FiUsers className="text-lg" /> },
  ];

  return (
    <DashboardLayout pageTitle="Accommodation Management">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-h1 font-bold text-text-primary mb-2">Accommodation</h1>
            <p className="text-body text-text-secondary">
              Manage hostels, rooms, and student accommodation applications
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Card padding="sm" variant="bordered">
          <div className="flex overflow-x-auto gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-text-secondary hover:bg-surface'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Content */}
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}

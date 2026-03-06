'use client';

import React, { useState } from 'react';
import { LibraryDashboard } from '@/components/library/LibraryDashboard';
import { BooksList } from '@/components/library/BooksList';
import { BorrowingsList } from '@/components/library/BorrowingsList';
import { FiBook, FiList, FiClock } from 'react-icons/fi';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'borrowings'>('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiBook className="text-lg" />,
    },
    {
      id: 'books',
      label: 'Books Catalog',
      icon: <FiList className="text-lg" />,
    },
    {
      id: 'borrowings',
      label: 'Borrowings',
      icon: <FiClock className="text-lg" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Library Management</h1>
          <p className="text-body text-text-secondary mt-1">
            Manage book catalog, borrowings, returns, and fines
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
      {activeTab === 'dashboard' && <LibraryDashboard />}
      
      {activeTab === 'books' && <BooksList />}
      
      {activeTab === 'borrowings' && <BorrowingsList />}
    </div>
  );
}

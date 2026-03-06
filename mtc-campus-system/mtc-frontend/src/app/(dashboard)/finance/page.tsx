'use client';

import React, { useState } from 'react';
import { FinanceDashboard } from '@/components/finance/FinanceDashboard';
import { InvoicesList } from '@/components/finance/InvoicesList';
import { PaymentsList } from '@/components/finance/PaymentsList';
import { StudentBalances } from '@/components/finance/StudentBalances';
import { FiDollarSign, FiFileText, FiCreditCard, FiUsers } from 'react-icons/fi';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'payments' | 'balances'>('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiDollarSign className="text-lg" />,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <FiFileText className="text-lg" />,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <FiCreditCard className="text-lg" />,
    },
    {
      id: 'balances',
      label: 'Balances',
      icon: <FiUsers className="text-lg" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Finance & Fee Management</h1>
          <p className="text-body text-text-secondary mt-1">
            Manage invoices, payments, fee structures, and student balances
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
      {activeTab === 'dashboard' && <FinanceDashboard />}
      
      {activeTab === 'invoices' && <InvoicesList />}
      
      {activeTab === 'payments' && <PaymentsList />}
      
      {activeTab === 'balances' && <StudentBalances />}
    </div>
  );
}

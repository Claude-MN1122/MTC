import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import { getFinanceAnalytics } from '../../services/analyticsApi';
import type { FinanceAnalytics } from '../../services/analyticsApi';

export const FinancialAnalyticsPanel: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFinanceAnalytics = async () => {
      try {
        const data = await getFinanceAnalytics({ financial_year: new Date().getFullYear().toString() });
        setFinanceData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load finance analytics');
      } finally {
        setLoading(false);
      }
    };

    loadFinanceAnalytics();
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

  if (!financeData) {
    return (
      <div className="text-text-500 text-center py-12">
        No finance data available
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSourceColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
            <FiDollarSign className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(financeData.total_revenue)}</div>
          <div className="text-sm opacity-90 mt-2">All sources combined</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
            <FiTrendingDown className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(financeData.total_expenses)}</div>
          <div className="text-sm opacity-90 mt-2">All categories</div>
        </div>

        <div className={`rounded-xl p-6 text-white shadow-lg ${financeData.net_balance >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Net Balance</h3>
            {financeData.net_balance >= 0 ? <FiTrendingUp className="text-white/80" /> : <FiTrendingDown className="text-white/80" />}
          </div>
          <div className="text-3xl font-bold">{formatCurrency(financeData.net_balance)}</div>
          <div className="text-sm opacity-90 mt-2">Revenue - Expenses</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Budget Utilization</h3>
            <FiTrendingUp className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{financeData.budget_utilization.toFixed(1)}%</div>
          <div className="text-sm opacity-90 mt-2">Of annual budget</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Revenue by Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financeData.revenue_by_source.map((source, index) => (
            <div key={source.source} className={`p-4 rounded-lg bg-gradient-to-br ${getSourceColor(index)} text-white`}>
              <div className="text-sm opacity-90 mb-2">{source.source}</div>
              <div className="text-2xl font-bold">{formatCurrency(source.amount)}</div>
              <div className="text-sm opacity-90 mt-1">{source.percentage.toFixed(1)}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Expenses by Category</h3>
        <div className="space-y-4">
          {financeData.expenses_by_category.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-700">{category.category}</span>
                <span className="text-sm text-text-500">
                  {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-bg-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Cash Flow */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Monthly Cash Flow</h3>
        <div className="h-80 flex items-end space-x-4">
          {financeData.monthly_cash_flow.map((month, index) => {
            const maxValue = Math.max(
              ...financeData.monthly_cash_flow.map(m => Math.max(m.income, m.expenses))
            );
            const incomeHeight = (month.income / maxValue) * 100;
            const expensesHeight = (month.expenses / maxValue) * 100;
            
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex space-x-1 items-end justify-center h-full">
                  <div 
                    className="w-1/2 bg-gradient-to-t from-green-500 to-green-600 rounded-t transition-all duration-300"
                    style={{ height: `${incomeHeight}%` }}
                    title={`Income: ${formatCurrency(month.income)}`}
                  />
                  <div 
                    className="w-1/2 bg-gradient-to-t from-red-500 to-red-600 rounded-t transition-all duration-300"
                    style={{ height: `${expensesHeight}%` }}
                    title={`Expenses: ${formatCurrency(month.expenses)}`}
                  />
                </div>
                <div className="text-xs text-text-500 mt-2">{month.month.substring(0, 3)}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-text-500">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-text-500">Expenses</span>
          </div>
        </div>
      </div>

      {/* Outstanding Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-text-900 mb-4">Outstanding Receivables</h3>
          <div className="text-3xl font-bold text-error-600">{formatCurrency(financeData.outstanding_receivables)}</div>
          <p className="text-sm text-text-500 mt-2">Money owed to the institution</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-text-900 mb-4">Outstanding Payables</h3>
          <div className="text-3xl font-bold text-warning-600">{formatCurrency(financeData.outstanding_payables)}</div>
          <p className="text-sm text-text-500 mt-2">Money owed by the institution</p>
        </div>
      </div>
    </div>
  );
};

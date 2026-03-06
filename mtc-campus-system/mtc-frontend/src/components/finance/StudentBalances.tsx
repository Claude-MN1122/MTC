'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiRefreshCw, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import type { StudentBalance } from '@/services/financeApi';
import { getStudentBalances } from '@/services/financeApi';

interface StudentBalancesProps {
  className?: string;
}

export const StudentBalances: React.FC<StudentBalancesProps> = ({ className = '' }) => {
  const [balances, setBalances] = useState<StudentBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasBalanceFilter, setHasBalanceFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBalances = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page,
        page_size: 20,
      };
      
      if (hasBalanceFilter !== null) {
        params.has_balance = hasBalanceFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await getStudentBalances(params);
      setBalances(data.results || data);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load student balances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, [page, hasBalanceFilter]);

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Student Balances</h3>
        <Button variant="secondary" size="sm" onClick={loadBalances} disabled={loading}>
          <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search by name or student number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          leftIcon={<FiSearch />}
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Balance Status
          </label>
          <select
            value={hasBalanceFilter === null ? 'all' : hasBalanceFilter ? 'has_balance' : 'no_balance'}
            onChange={(e) => setHasBalanceFilter(
              e.target.value === 'all' ? null : 
              e.target.value === 'has_balance' ? true : false
            )}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Students</option>
            <option value="has_balance">With Balance</option>
            <option value="no_balance">No Balance</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-text-secondary">
            Total Students: <span className="font-semibold text-text-primary">{balances.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-error">{error}</div>
      ) : balances.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No student balance records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Total Invoiced</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Total Paid</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Outstanding</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Overdue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Invoices</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance) => (
                <tr
                  key={balance.student_number}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">
                        {balance.full_name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {balance.student_number}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-primary">
                    ${balance.total_invoiced.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-success-500 font-medium">
                    ${balance.total_paid.toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 font-bold ${balance.outstanding_balance > 0 ? 'text-warning-500' : 'text-text-primary'}`}>
                    ${balance.outstanding_balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {balance.overdue_amount > 0 ? (
                      <Badge variant="error" size="sm">
                        <FiAlertTriangle className="inline mr-1" />
                        ${balance.overdue_amount.toLocaleString()}
                      </Badge>
                    ) : (
                      <span className="text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {balance.invoices_count} total / {balance.pending_invoices_count} pending
                  </td>
                  <td className="text-right py-3 px-4">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && balances.length > 0 && (
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

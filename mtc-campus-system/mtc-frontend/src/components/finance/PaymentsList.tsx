'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiDownload, FiRefreshCw, FiEye, FiPlus, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import type { Payment } from '@/services/financeApi';
import { getPayments } from '@/services/financeApi';

interface PaymentsListProps {
  className?: string;
}

export const PaymentsList: React.FC<PaymentsListProps> = ({ className = '' }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page,
        page_size: 20,
      };
      
      if (methodFilter !== 'all') {
        params.payment_method = methodFilter;
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm) {
        params.student_number = searchTerm;
      }
      
      const data = await getPayments(params);
      setPayments(data.results || data);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, methodFilter, statusFilter]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'success';
      case 'BANK_TRANSFER':
        return 'info';
      case 'CARD':
        return 'gold';
      case 'MOBILE_MONEY':
        return 'warning';
      case 'CHEQUE':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      case 'REFUNDED':
        return 'default';
      default:
        return 'default';
    }
  };

  const exportToCSV = () => {
    const headers = ['Reference', 'Student', 'Amount', 'Method', 'Status', 'Date', 'Transaction Ref'];
    const rows = payments.map((pmt) => [
      pmt.payment_reference,
      pmt.student_details?.full_name || '',
      pmt.amount.toString(),
      pmt.payment_method_display || pmt.payment_method,
      pmt.status_display || pmt.status,
      pmt.payment_date,
      pmt.transaction_reference || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Payment Records</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <FiPlus className="mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search by student number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          leftIcon={<FiSearch />}
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Payment Method
          </label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Methods</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" onClick={loadPayments} disabled={loading} className="w-full">
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No payment records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Reference</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Transaction Ref</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-text-primary">
                      {payment.payment_reference}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">
                        {payment.student_details?.full_name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {payment.student_details?.student_number}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-success-500 text-lg">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getMethodColor(payment.payment_method)} size="sm">
                      {payment.payment_method_display || payment.payment_method}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusColor(payment.status)} size="sm">
                      {payment.status_display || payment.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-sm">
                    {payment.transaction_reference || '-'}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <FiEye className="text-lg" />
                      </Button>
                      {payment.status === 'PENDING' && (
                        <>
                          <Button variant="ghost" size="sm" title="Approve">
                            <FiCheckCircle className="text-lg text-success-500" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Reject">
                            <FiXCircle className="text-lg text-error-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && payments.length > 0 && (
        <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div>
            Total: <span className="font-semibold text-success-500">
              ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </span>
          </div>
          <div>Showing page {page} of {totalPages}</div>
        </div>
      )}
    </Card>
  );
};

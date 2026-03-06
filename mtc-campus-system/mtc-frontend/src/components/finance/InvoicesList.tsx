'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEye, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Invoice } from '@/services/financeApi';
import { getInvoices, deleteInvoice } from '@/services/financeApi';

interface InvoicesListProps {
  className?: string;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({ className = '' }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page,
        page_size: 20,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm) {
        params.student_number = searchTerm;
      }
      
      const data = await getInvoices(params);
      setInvoices(data.results || data);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [page, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err: any) {
      alert('Failed to delete invoice: ' + err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'PARTIAL':
        return 'info';
      case 'OVERDUE':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Student', 'Amount', 'Paid', 'Balance', 'Status', 'Due Date'];
    const rows = invoices.map((inv) => [
      inv.invoice_number,
      inv.student_details?.full_name || '',
      inv.amount.toString(),
      inv.amount_paid.toString(),
      inv.balance.toString(),
      inv.status,
      inv.due_date,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Invoices</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <FiPlus className="mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" onClick={loadInvoices} disabled={loading} className="w-full">
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
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No invoices found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Invoice #</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Paid</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Balance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Due Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-text-primary">
                      {invoice.invoice_number}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">
                        {invoice.student_details?.full_name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {invoice.student_details?.student_number}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-text-primary">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-success-500 font-medium">
                    ${invoice.amount_paid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-medium text-text-primary">
                    ${invoice.balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusColor(invoice.status)} size="sm">
                      {invoice.status_display || invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <FiEye className="text-lg" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FiEdit2 className="text-lg" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        <FiTrash2 className="text-lg text-error-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && invoices.length > 0 && (
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

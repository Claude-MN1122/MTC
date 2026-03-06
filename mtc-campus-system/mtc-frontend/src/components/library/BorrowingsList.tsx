'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiDownload, FiRefreshCw, FiEye, FiPlus, FiCheckCircle, FiXCircle, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import type { BookBorrowing } from '@/services/libraryApi';
import { getBorrowings, returnBook, renewBook } from '@/services/libraryApi';

interface BorrowingsListProps {
  className?: string;
}

export const BorrowingsList: React.FC<BorrowingsListProps> = ({ className = '' }) => {
  const [borrowings, setBorrowings] = useState<BookBorrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBorrowings = async () => {
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
      
      const data = await getBorrowings(params);
      setBorrowings(data.results || data);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowings();
  }, [page, statusFilter]);

  const handleReturn = async (id: number) => {
    if (!confirm('Mark this book as returned?')) return;
    
    try {
      await returnBook(id);
      setBorrowings(borrowings.map(b => 
        b.id === id ? { ...b, status: 'RETURNED' as const } : b
      ));
    } catch (err: any) {
      alert('Failed to process return: ' + err.message);
    }
  };

  const handleRenew = async (id: number) => {
    if (!confirm('Renew this borrowing for 7 more days?')) return;
    
    try {
      await renewBook(id);
      setBorrowings(borrowings.map(b => 
        b.id === id ? { ...b, due_date: new Date(new Date(b.due_date).getTime() + 7*24*60*60*1000).toISOString().split('T')[0] } : b
      ));
      alert('Book renewed successfully!');
    } catch (err: any) {
      alert('Failed to renew: ' + err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return 'warning';
      case 'RETURNED':
        return 'success';
      case 'OVERDUE':
        return 'error';
      case 'LOST':
        return 'default';
      default:
        return 'default';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'BORROWED' && new Date(dueDate) < new Date();
  };

  const exportToCSV = () => {
    const headers = ['Reference', 'Book', 'Student', 'Issue Date', 'Due Date', 'Status', 'Return Date'];
    const rows = borrowings.map((b) => [
      b.borrowing_reference,
      b.book_details?.title || '',
      b.student_details?.full_name || '',
      b.issue_date,
      b.due_date,
      b.status,
      b.return_date || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borrowings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Book Borrowings</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <FiPlus className="mr-2" />
            Issue Book
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
            <option value="BORROWED">Borrowed</option>
            <option value="RETURNED">Returned</option>
            <option value="OVERDUE">Overdue</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" onClick={loadBorrowings} disabled={loading} className="w-full">
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
      ) : borrowings.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No borrowing records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Reference</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Book</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Issue Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((borrowing) => {
                const overdue = isOverdue(borrowing.due_date, borrowing.status);
                return (
                  <tr
                    key={borrowing.id}
                    className={`border-b border-border hover:bg-surface/30 transition-colors ${
                      overdue ? 'bg-error-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-text-primary">
                        {borrowing.borrowing_reference}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-text-primary">
                          {borrowing.book_details?.title}
                        </div>
                        <div className="text-xs text-text-secondary">
                          by {borrowing.book_details?.author}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-text-primary">
                          {borrowing.student_details?.full_name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {borrowing.student_details?.student_number}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {new Date(borrowing.issue_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          overdue ? 'text-error-500' : 'text-text-primary'
                        }`}>
                          {new Date(borrowing.due_date).toLocaleDateString()}
                        </span>
                        {overdue && <FiAlertCircle className="text-error-500 text-sm" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(borrowing.status)} size="sm">
                        {borrowing.status_display || borrowing.status}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <FiEye className="text-lg" />
                        </Button>
                        {borrowing.status === 'BORROWED' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleReturn(borrowing.id)}
                              title="Mark as Returned"
                            >
                              <FiCheckCircle className="text-lg text-success-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRenew(borrowing.id)}
                              title="Renew"
                            >
                              <FiCalendar className="text-lg text-info-500" />
                            </Button>
                          </>
                        )}
                        {borrowing.status === 'BORROWED' && !overdue && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Mark as Lost"
                          >
                            <FiXCircle className="text-lg text-error-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && borrowings.length > 0 && (
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

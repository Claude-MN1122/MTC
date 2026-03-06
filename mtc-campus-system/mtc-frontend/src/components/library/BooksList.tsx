'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEye, FiPlus, FiEdit2, FiTrash2, FiBook } from 'react-icons/fi';
import type { Book } from '@/services/libraryApi';
import { getBooks, deleteBook } from '@/services/libraryApi';

interface BooksListProps {
  className?: string;
}

export const BooksList: React.FC<BooksListProps> = ({ className = '' }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page,
        page_size: 20,
      };
      
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      if (availabilityFilter !== 'all') {
        params.availability = availabilityFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await getBooks(params);
      setBooks(data.results || data);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [page, categoryFilter, availabilityFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err: any) {
      alert('Failed to delete book: ' + err.message);
    }
  };

  const getAvailabilityStatus = (book: Book) => {
    if (book.available_copies === 0) {
      return { label: 'Unavailable', variant: 'error' as const };
    } else if (book.available_copies < book.total_copies * 0.2) {
      return { label: 'Low Stock', variant: 'warning' as const };
    } else {
      return { label: 'Available', variant: 'success' as const };
    }
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Category', 'Total Copies', 'Available', 'Location'];
    const rows = books.map((book) => [
      book.title,
      book.author,
      book.isbn,
      book.category,
      book.total_copies.toString(),
      book.available_copies.toString(),
      book.location || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `library-books-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Book Catalog</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            <FiDownload className="mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <FiPlus className="mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          leftIcon={<FiSearch />}
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Engineering">Engineering</option>
            <option value="Literature">Literature</option>
            <option value="History">History</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Not Available</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" onClick={loadBooks} disabled={loading} className="w-full">
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
      ) : books.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No books found in the catalog
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Author</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">ISBN</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Copies</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Availability</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Location</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const status = getAvailabilityStatus(book);
                return (
                  <tr
                    key={book.id}
                    className="border-b border-border hover:bg-surface/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-text-primary">
                        {book.title}
                      </div>
                      {book.edition && (
                        <div className="text-xs text-text-secondary">
                          {book.edition} Edition
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {book.author}
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-surface px-2 py-1 rounded">
                        {book.isbn}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">
                        {book.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      <div className="flex items-center gap-2">
                        <FiBook className="text-sm" />
                        <span>{book.available_copies}/{book.total_copies}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-sm">
                      {book.shelf_number || book.location || '-'}
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
                          onClick={() => handleDelete(book.id)}
                        >
                          <FiTrash2 className="text-lg text-error-500" />
                        </Button>
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
      {!loading && !error && books.length > 0 && (
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

import React, { useState, useEffect } from 'react';
import { FiBook, FiTrendingUp, FiUsers, FiAward, FiAlertCircle } from 'react-icons/fi';
import { getLibraryAnalytics } from '../../services/analyticsApi';
import type { LibraryAnalytics } from '../../services/analyticsApi';

export const LibraryAnalyticsPanel: React.FC = () => {
  const [libraryData, setLibraryData] = useState<LibraryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLibraryAnalytics = async () => {
      try {
        const data = await getLibraryAnalytics({});
        setLibraryData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load library analytics');
      } finally {
        setLoading(false);
      }
    };

    loadLibraryAnalytics();
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

  if (!libraryData) {
    return (
      <div className="text-text-500 text-center py-12">
        No library data available
      </div>
    );
  }

  const getCategoryColor = (index: number) => {
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Total Books</h3>
            <FiBook className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{libraryData.total_books.toLocaleString()}</div>
          <div className="text-sm opacity-90 mt-2">In catalog</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Books Borrowed</h3>
            <FiTrendingUp className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{libraryData.books_borrowed.toLocaleString()}</div>
          <div className="text-sm opacity-90 mt-2">Currently on loan</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Active Readers</h3>
            <FiUsers className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">{libraryData.active_readers.toLocaleString()}</div>
          <div className="text-sm opacity-90 mt-2">This month</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Fines Collected</h3>
            <FiAward className="text-white/80" />
          </div>
          <div className="text-3xl font-bold">R{libraryData.fines_collected.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-2">Total revenue</div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Popular Book Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {libraryData.popular_categories.map((category, index) => (
            <div key={category.category} className={`p-4 rounded-lg bg-gradient-to-br ${getCategoryColor(index)} text-white`}>
              <div className="text-sm opacity-90 mb-2">{category.category}</div>
              <div className="text-2xl font-bold">{category.borrowings_count.toLocaleString()}</div>
              <div className="text-sm opacity-90 mt-1">{category.percentage.toFixed(1)}% of borrowings</div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Borrowed Books */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4 flex items-center">
          <FiAward className="mr-2 text-yellow-500" />
          Most Borrowed Books
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Borrowings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-200">
              {libraryData.most_borrowed_books.slice(0, 10).map((book, index) => (
                <tr key={book.title} className="hover:bg-bg-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-text-900 truncate max-w-xs">{book.title}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-text-500">{book.author}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {book.borrowings_count.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Borrowing Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Monthly Borrowing Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {libraryData.borrowing_trend.map((month, index) => {
            const maxCount = Math.max(...libraryData.borrowing_trend.map(d => d.count));
            const heightPercentage = (month.count / maxCount) * 100;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t transition-all duration-300"
                  style={{ height: `${heightPercentage}%` }}
                />
                <div className="text-xs text-text-500 mt-2 transform -rotate-45 origin-top-left">
                  {month.month.substring(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">Book Availability</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-bg-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-text-700">Available Books</span>
            </div>
            <span className="text-lg font-semibold text-text-900">{libraryData.books_available.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-bg-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-text-700">Borrowed Books</span>
            </div>
            <span className="text-lg font-semibold text-text-900">{libraryData.books_borrowed.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-bg-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-text-700">Overdue Books</span>
            </div>
            <span className="text-lg font-semibold text-text-900">{libraryData.overdue_books.toLocaleString()}</span>
          </div>
        </div>

        {/* Overall availability percentage */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-700">Overall Availability</span>
            <span className="text-sm font-medium text-text-900">
              {((libraryData.books_available / libraryData.total_books) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-bg-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
              style={{ width: `${(libraryData.books_available / libraryData.total_books) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

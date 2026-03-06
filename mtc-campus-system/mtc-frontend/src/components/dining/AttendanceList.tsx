'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEye } from 'react-icons/fi';
import type { DiningAttendance } from '@/services/diningApi';
import { getAttendanceRecords } from '@/services/diningApi';

interface AttendanceListProps {
  className?: string;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ className = '' }) => {
  const [attendances, setAttendances] = useState<DiningAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);

  const loadAttendances = async () => {
    try {
      setLoading(true);
      const params: any = { date: dateFilter };
      if (mealTypeFilter !== 'all') {
        params.meal_type = mealTypeFilter;
      }
      
      const data = await getAttendanceRecords(params);
      setAttendances(data.results || data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
  }, [dateFilter, mealTypeFilter]);

  const filteredAttendances = attendances.filter((attendance) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attendance.student_details?.full_name.toLowerCase().includes(searchLower) ||
      attendance.student_details?.student_number.toLowerCase().includes(searchLower)
    );
  });

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'gold';
      case 'LUNCH':
        return 'success';
      case 'DINNER':
        return 'info';
      default:
        return 'default';
    }
  };

  const exportToCSV = () => {
    const headers = ['Student Number', 'Full Name', 'Meal Type', 'Date', 'Timestamp', 'Scanner Device'];
    const rows = filteredAttendances.map((a) => [
      a.student_details?.student_number || '',
      a.student_details?.full_name || '',
      a.meal_type_display || a.meal_type,
      a.date,
      a.timestamp,
      a.scanner_device || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dining-attendance-${dateFilter}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card padding="md" className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-text-primary">Attendance Records</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            <FiDownload className="mr-2" />
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={loadAttendances} disabled={loading}>
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
            Meal Type
          </label>
          <select
            value={mealTypeFilter}
            onChange={(e) => setMealTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary"
          >
            <option value="all">All Meals</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
          </select>
        </div>

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          label="Date"
        />
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
      ) : filteredAttendances.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          No attendance records found for the selected criteria
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Meal Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Scanner</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.map((attendance) => (
                <tr
                  key={attendance.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">
                        {attendance.student_details?.full_name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {attendance.student_details?.student_number}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getMealTypeColor(attendance.meal_type)} size="sm">
                      {attendance.meal_type_display || attendance.meal_type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-primary">{attendance.date}</td>
                  <td className="py-3 px-4 text-text-secondary">
                    {new Date(attendance.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {attendance.scanner_device || '-'}
                  </td>
                  <td className="text-right py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <FiEye className="text-lg" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && filteredAttendances.length > 0 && (
        <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div>Showing {filteredAttendances.length} record(s)</div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      )}
    </Card>
  );
};

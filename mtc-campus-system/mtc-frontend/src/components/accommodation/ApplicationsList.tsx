'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiEye } from 'react-icons/fi';
import type { AccommodationApplication } from '@/services/accommodationApi';

interface ApplicationsListProps {
  applications?: AccommodationApplication[];
  isLoading?: boolean;
  onViewApplication?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications = [],
  isLoading = false,
  onViewApplication,
  onApprove,
  onReject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student_details?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.student_details?.student_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      case 'WAITING_LIST': return 'info';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <FiCheckCircle className="text-sm mr-1" />;
      case 'REJECTED': return <FiXCircle className="text-sm mr-1" />;
      case 'PENDING': return <FiClock className="text-sm mr-1" />;
      case 'WAITING_LIST': return <FiUsers className="text-sm mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by student name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<FiSearch className="text-lg" />}
            fullWidth
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITING_LIST">Waiting List</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Applications Table */}
      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border-medium">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Preferred Hostel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Application Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {isLoading ? (
                // Loading skeletons
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton variant="text" width="120px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="100px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="60px" height="20px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="90px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="32px" /></td>
                  </tr>
                ))
              ) : filteredApplications.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-text-muted">
                      <FiClock className="text-4xl mx-auto mb-3 opacity-50" />
                      <p className="text-body font-medium">No applications found</p>
                      <p className="text-small mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Application rows
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{app.student_details?.full_name}</p>
                        <p className="text-xs text-text-muted">{app.student_details?.student_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {app.hostel_name || 'Any'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {app.period_display || app.period}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                        {getStatusIcon(app.status)}
                        {app.status_display || app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {new Date(app.application_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewApplication?.(app.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors text-primary-600"
                          title="View Details"
                        >
                          <FiEye className="text-lg" />
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onApprove?.(app.id)}
                              className="p-2 hover:bg-success-50 rounded-lg transition-colors text-success-600"
                              title="Approve"
                            >
                              <FiCheckCircle className="text-lg" />
                            </button>
                            <button
                              onClick={() => onReject?.(app.id)}
                              className="p-2 hover:bg-error-50 rounded-lg transition-colors text-error-500"
                              title="Reject"
                            >
                              <FiXCircle className="text-lg" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationsList;

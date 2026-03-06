'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiCheckCircle } from 'react-icons/fi';
import type { Room } from '@/services/accommodationApi';

interface RoomsListProps {
  rooms?: Room[];
  isLoading?: boolean;
  onAddRoom?: () => void;
  onViewRoom?: (id: number) => void;
  onEditRoom?: (id: number) => void;
  onDeleteRoom?: (id: number) => void;
}

export const RoomsList: React.FC<RoomsListProps> = ({
  rooms = [],
  isLoading = false,
  onAddRoom,
  onViewRoom,
  onEditRoom,
  onDeleteRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hostelFilter, setHostelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.hostel_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHostel = hostelFilter === 'all' || room.hostel.toString() === hostelFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && room.is_active) ||
                         (statusFilter === 'inactive' && !room.is_active);
    return matchesSearch && matchesHostel && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<FiSearch className="text-lg" />}
            fullWidth
          />
        </div>
        <div className="flex gap-2">
          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="px-4 py-2.5 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Hostels</option>
            {/* Add hostel options dynamically */}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="px-4 py-2.5 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="primary" leftIcon={<FiPlus />} onClick={onAddRoom}>
            Add Room
          </Button>
        </div>
      </div>

      {/* Rooms Table */}
      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border-medium">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Hostel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
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
                    <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="100px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="40px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="60px" height="16px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="50px" height="20px" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="32px" /></td>
                  </tr>
                ))
              ) : filteredRooms.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-text-muted">
                      <FiCheckCircle className="text-4xl mx-auto mb-3 opacity-50" />
                      <p className="text-body font-medium">No rooms found</p>
                      <p className="text-small mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Room rows
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{room.room_number}</p>
                        {room.floor && <p className="text-xs text-text-muted">Floor {room.floor}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">{room.hostel_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">{room.capacity} students</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">
                          {room.occupied_spaces}/{room.capacity}
                        </span>
                        <div className="w-20 bg-surface rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              room.is_full ? 'bg-error-500' : 'bg-success-500'
                            }`}
                            style={{ width: `${room.occupancy_rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={room.is_active ? 'success' : 'default'}
                        size="sm"
                      >
                        {room.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewRoom?.(room.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors text-primary-600"
                          title="View Details"
                        >
                          <FiEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => onEditRoom?.(room.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors text-primary-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-lg" />
                        </button>
                        <button
                          onClick={() => onDeleteRoom?.(room.id)}
                          className="p-2 hover:bg-error-50 rounded-lg transition-colors text-error-500"
                          title="Delete"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
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

export default RoomsList;

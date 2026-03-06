'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiUsers, FiPercent } from 'react-icons/fi';
import type { Hostel } from '@/services/accommodationApi';

interface HostelsListProps {
  hostels?: Hostel[];
  isLoading?: boolean;
  onAddHostel?: () => void;
  onViewHostel?: (id: number) => void;
  onEditHostel?: (id: number) => void;
  onDeleteHostel?: (id: number) => void;
}

export const HostelsList: React.FC<HostelsListProps> = ({
  hostels = [],
  isLoading = false,
  onAddHostel,
  onViewHostel,
  onEditHostel,
  onDeleteHostel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hostel.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'all' || hostel.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const getGenderBadgeVariant = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'info';
      case 'FEMALE': return 'gold';
      case 'MIXED': return 'default';
      default: return 'default';
    }
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-error-600 bg-error-50';
    if (rate >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-success-600 bg-success-50';
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search hostels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<FiSearch className="text-lg" />}
            fullWidth
          />
        </div>
        <div className="flex gap-2">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2.5 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="MIXED">Mixed</option>
          </select>
          <Button variant="primary" leftIcon={<FiPlus />} onClick={onAddHostel}>
            Add Hostel
          </Button>
        </div>
      </div>

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          // Loading skeletons
          [...Array(4)].map((_, i) => (
            <Card key={i} padding="md" variant="elevated">
              <div className="space-y-3">
                <Skeleton variant="text" width="60%" height="24px" />
                <Skeleton variant="text" width="80%" height="16px" />
                <div className="flex gap-4">
                  <Skeleton variant="text" width="40%" height="16px" />
                  <Skeleton variant="text" width="40%" height="16px" />
                </div>
                <Skeleton variant="rectangular" width="100%" height="8px" />
              </div>
            </Card>
          ))
        ) : filteredHostels.length === 0 ? (
          // Empty state
          <Card padding="lg" className="text-center">
            <div className="text-text-muted py-8">
              <FiUsers className="text-5xl mx-auto mb-3 opacity-50" />
              <p className="text-body font-medium">No hostels found</p>
              <p className="text-small mt-1">Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          // Hostel cards
          filteredHostels.map((hostel) => (
            <Card key={hostel.id} padding="md" variant="elevated" className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-h3 font-bold text-text-primary">{hostel.name}</h3>
                    <Badge variant={getGenderBadgeVariant(hostel.gender)} size="sm">
                      {hostel.gender}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewHostel?.(hostel.id)}
                      className="p-2 hover:bg-surface rounded-lg transition-colors text-primary-600"
                      title="View Details"
                    >
                      <FiEye className="text-lg" />
                    </button>
                    <button
                      onClick={() => onEditHostel?.(hostel.id)}
                      className="p-2 hover:bg-surface rounded-lg transition-colors text-primary-600"
                      title="Edit"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    <button
                      onClick={() => onDeleteHostel?.(hostel.id)}
                      className="p-2 hover:bg-error-50 rounded-lg transition-colors text-error-500"
                      title="Delete"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {hostel.description && (
                  <p className="text-body text-text-secondary">{hostel.description}</p>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Capacity</p>
                    <p className="text-body font-semibold text-text-primary">
                      {hostel.occupied_spaces} / {hostel.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Available</p>
                    <p className={`text-body font-semibold ${
                      hostel.available_spaces > 0 ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {hostel.available_spaces} spaces
                    </p>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">Occupancy Rate</span>
                    <span className={`font-medium ${
                      hostel.occupancy_rate >= 90 ? 'text-error-600' : 
                      hostel.occupancy_rate >= 70 ? 'text-amber-600' : 'text-success-600'
                    }`}>
                      {hostel.occupancy_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hostel.occupancy_rate >= 90 ? 'bg-error-500' : 
                        hostel.occupancy_rate >= 70 ? 'bg-amber-500' : 'bg-success-500'
                      }`}
                      style={{ width: `${Math.min(hostel.occupancy_rate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Room Count */}
                <div className="pt-3 border-t border-border-light">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <FiUsers className="text-sm" />
                    <span>{hostel.total_rooms} rooms total</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HostelsList;

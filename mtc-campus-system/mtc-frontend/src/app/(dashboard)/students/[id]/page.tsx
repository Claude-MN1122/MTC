'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiMapPin, 
  FiBook, 
  FiDollarSign,
  FiHome,
  FiCoffee,
  FiEdit2,
  FiDownload,
  FiCode
} from 'react-icons/fi';

// Mock data - Replace with API call
const mockStudent = {
  id: 1,
  name: 'Tinashe Moyo',
  email: 'tinashe.m@mtc.ac.zw',
  phone: '+263 77 123 4567',
  dateOfBirth: '2002-05-15',
  gender: 'Female',
  program: 'Education',
  yearOfStudy: 1,
  studentNumber: 'STU-2024-001',
  address: '123 Main Street, Mutare, Zimbabwe',
  status: 'active',
  enrollmentDate: '2024-01-15',
  accommodationStatus: 'On Campus',
  roomNumber: 'Block A - Room 204',
  diningPlan: 'Standard Plan',
  idCardStatus: 'Issued',
  fees: {
    total: 1200,
    paid: 800,
    outstanding: 400,
  },
};

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(mockStudent);

  React.useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Student Details">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton variant="text" width="200px" height="32px" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CardSkeleton showHeader paragraphLines={5} />
            </div>
            <div className="lg:col-span-2">
              <CardSkeleton showHeader paragraphLines={8} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Student Details">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-h1 font-bold text-text-primary">{student.name}</h1>
              <p className="text-body text-text-secondary">{student.studentNumber}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" leftIcon={<FiEdit2 />}>
              Edit
            </Button>
            <Button variant="primary" leftIcon={<FiDownload />}>
              Download ID
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile & Quick Info */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <Card variant="elevated" padding="lg">
              <div className="text-center mb-6">
                <Avatar name={student.name} size="xl" className="mb-4" />
                <h2 className="text-h2 font-bold text-text-primary mb-1">{student.name}</h2>
                <p className="text-body text-text-secondary mb-3">{student.studentNumber}</p>
                <Badge
                  variant={student.status === 'active' ? 'success' : 'error'}
                  size="md"
                >
                  {student.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3 pt-6 border-t border-border-light">
                <div className="flex items-center gap-3 text-sm">
                  <FiMail className="text-text-muted" />
                  <span className="text-text-secondary">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiPhone className="text-text-muted" />
                  <span className="text-text-secondary">{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar className="text-text-muted" />
                  <span className="text-text-secondary">DOB: {student.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiMapPin className="text-text-muted" />
                  <span className="text-text-secondary">{student.address}</span>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-h3 font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FiBook />
                    </div>
                    <span className="text-sm text-text-secondary">Program</span>
                  </div>
                  <span className="font-semibold text-text-primary">{student.program}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <FiHome />
                    </div>
                    <span className="text-sm text-text-secondary">Accommodation</span>
                  </div>
                  <span className="font-semibold text-text-primary">{student.accommodationStatus}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <FiCoffee />
                    </div>
                    <span className="text-sm text-text-secondary">Dining Plan</span>
                  </div>
                  <span className="font-semibold text-text-primary">{student.diningPlan}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <FiCode />
                    </div>
                    <span className="text-sm text-text-secondary">ID Card</span>
                  </div>
                  <span className="font-semibold text-text-primary">{student.idCardStatus}</span>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Academic Information */}
            <Card variant="elevated" padding="lg">
              <CardHeader
                title="Academic Information"
                subtitle="Program and enrollment details"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-small text-text-muted mb-1">Program</p>
                  <p className="text-body font-medium text-text-primary">{student.program}</p>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-1">Year of Study</p>
                  <p className="text-body font-medium text-text-primary">Year {student.yearOfStudy}</p>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-1">Enrollment Date</p>
                  <p className="text-body font-medium text-text-primary">{student.enrollmentDate}</p>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-1">Student Number</p>
                  <p className="text-body font-medium text-text-primary font-mono">{student.studentNumber}</p>
                </div>
              </div>
            </Card>

            {/* Accommodation Details */}
            <Card variant="elevated" padding="lg">
              <CardHeader
                title="Accommodation Details"
                subtitle="Hostel and room information"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-small text-text-muted mb-1">Status</p>
                  <p className="text-body font-medium text-text-primary">{student.accommodationStatus}</p>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-1">Room Number</p>
                  <p className="text-body font-medium text-text-primary">{student.roomNumber}</p>
                </div>
              </div>
            </Card>

            {/* Fees Information */}
            <Card variant="elevated" padding="lg">
              <CardHeader
                title="Fees Information"
                subtitle="Payment status and breakdown"
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-small text-blue-600 mb-1">Total Fees</p>
                    <p className="text-h3 font-bold text-blue-700">${student.fees.total}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-small text-green-600 mb-1">Amount Paid</p>
                    <p className="text-h3 font-bold text-green-700">${student.fees.paid}</p>
                  </div>
                  <div className="p-4 bg-error-50 rounded-xl">
                    <p className="text-small text-error-600 mb-1">Outstanding</p>
                    <p className="text-h3 font-bold text-error-700">${student.fees.outstanding}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-small text-text-secondary">Payment Progress</span>
                    <span className="text-small font-medium text-text-primary">
                      {Math.round((student.fees.paid / student.fees.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(student.fees.paid / student.fees.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card variant="elevated" padding="lg">
              <CardHeader
                title="Additional Information"
                subtitle="Personal and emergency contact details"
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-small text-text-muted mb-1">Gender</p>
                    <p className="text-body font-medium text-text-primary">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-small text-text-muted mb-1">Date of Birth</p>
                    <p className="text-body font-medium text-text-primary">{student.dateOfBirth}</p>
                  </div>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-1">Residential Address</p>
                  <p className="text-body text-text-primary">{student.address}</p>
                </div>
              </div>
            </Card>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Helper skeleton component
function CardSkeleton({ showHeader, paragraphLines }: { showHeader?: boolean; paragraphLines: number }) {
  return (
    <Card padding="lg">
      {showHeader && (
        <div className="mb-4">
          <Skeleton variant="text" width="60%" height="24px" />
          <Skeleton variant="text" width="40%" height="16px" className="mt-2" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: paragraphLines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === paragraphLines - 1 ? '60%' : '100%'}
            height="16px"
          />
        ))}
      </div>
    </Card>
  );
}

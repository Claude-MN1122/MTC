'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { FiSearch, FiPlus, FiFilter, FiDownload, FiEdit2, FiTrash2, FiEye, FiX, FiCamera } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeDisplay, IDCardPreview, QRScanner } from '@/components/qr-codes';
import type { QRCodeData, StudentData } from '@/components/qr-codes';
import { getStudents, type Student } from '@/services/studentApi';

// Type alias for Student interface (already defined in studentApi.ts)
// No need to redefine here - imported from studentApi

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState<Student | null>(null);
  const [showIDCard, setShowIDCard] = useState<Student | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Fetch students from API on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getStudents();
        setStudents(data);
      } catch (err: any) {
        console.error('Failed to fetch students:', err);
        setError(err.message || 'Failed to load students. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.student_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && student.is_active) ||
      (statusFilter === 'inactive' && !student.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(s => s.id !== studentToDelete));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Student Management">
      <div className="space-y-6">
        
        {/* Error Display */}
        {error && (
          <Card variant="bordered" padding="lg" className="bg-error-50 border-error-200">
            <div className="flex items-start gap-3">
              <div className="text-error-600 text-xl mt-1">
                ⚠️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-error-800 mb-1">
                  Failed to Load Students
                </h3>
                <p className="text-error-700 mb-3">{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-h1 font-bold text-text-primary mb-2">Students</h1>
            <p className="text-body text-text-secondary">
              Manage student records and information
            </p>
          </div>
          <Button variant="primary" leftIcon={<FiPlus />}>
            Add New Student
          </Button>
        </div>

        {/* Search and Filters */}
        <Card padding="md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<FiSearch className="text-lg" />}
                fullWidth
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-border-medium rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <Button variant="secondary" leftIcon={<FiFilter />}>
                More Filters
              </Button>
              <Button variant="secondary" leftIcon={<FiDownload />}>
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card variant="elevated" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Year
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton variant="circular" width="40px" height="40px" />
                          <div className="space-y-2">
                            <Skeleton variant="text" width="120px" height="16px" />
                            <Skeleton variant="text" width="160px" height="14px" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton variant="text" width="100px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" width="40px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" width="60px" height="20px" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" width="80px" height="32px" /></td>
                    </tr>
                  ))
                ) : filteredStudents.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-text-muted">
                        <FiSearch className="text-4xl mx-auto mb-3 opacity-50" />
                        <p className="text-body font-medium">No students found</p>
                        <p className="text-small mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Student rows
                  filteredStudents.map((student) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#F8FAFC' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.full_name} size="md" />
                          <div>
                            <p className="font-medium text-text-primary">{student.full_name}</p>
                            <p className="text-small text-text-muted">{student.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary font-mono">{student.student_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">{student.department_display}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">Year {student.year_of_study}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={student.is_active ? 'success' : 'default'}
                          size="sm"
                        >
                          {student.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                            title="View Details"
                          >
                            <FiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => setShowQRCode(student)}
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                            title="View QR Code"
                          >
                            <FiCamera className="text-lg" />
                          </button>
                          <button
                            onClick={() => setShowIDCard(student)}
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                            title="View ID Card"
                          >
                            <FiCamera className="text-lg" />
                          </button>
                          <button
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                            title="Edit"
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 hover:bg-error-50 rounded-lg transition-colors text-error-500"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-border-light bg-surface/50 flex items-center justify-between">
              <p className="text-small text-text-muted">
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled>Previous</Button>
                <Button variant="secondary" size="sm">Next</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Student Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <StudentDetailModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <QRCodeModal
              student={showQRCode}
              onClose={() => setShowQRCode(null)}
            />
          )}
        </AnimatePresence>

        {/* ID Card Preview Modal */}
        <AnimatePresence>
          {showIDCard && (
            <IDCardModal
              student={showIDCard}
              onClose={() => setShowIDCard(null)}
            />
          )}
        </AnimatePresence>

        {/* QR Scanner Modal */}
        <AnimatePresence>
          {showScanner && (
            <QRScannerModal
              onClose={() => setShowScanner(false)}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <DeleteConfirmationModal
              studentName={students.find(s => s.id === studentToDelete)?.name || ''}
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowDeleteModal(false);
                setStudentToDelete(null);
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}

// Student Detail Modal Component
interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-h2 font-bold text-text-primary">Student Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-6 border-b border-border-light">
            <Avatar name={student.name} size="xl" />
            <div>
              <h3 className="text-h3 font-bold text-text-primary">{student.name}</h3>
              <p className="text-body text-text-secondary">{student.studentId}</p>
              <Badge
                variant={student.status === 'active' ? 'success' : 'error'}
                size="sm"
                className="mt-2"
              >
                {student.status}
              </Badge>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-small text-text-muted mb-1">Email Address</p>
              <p className="text-body font-medium text-text-primary">{student.email}</p>
            </div>
            <div>
              <p className="text-small text-text-muted mb-1">Phone Number</p>
              <p className="text-body font-medium text-text-primary">{student.phone}</p>
            </div>
            <div>
              <p className="text-small text-text-muted mb-1">Program</p>
              <p className="text-body font-medium text-text-primary">{student.program}</p>
            </div>
            <div>
              <p className="text-small text-text-muted mb-1">Academic Year</p>
              <p className="text-body font-medium text-text-primary">Year {student.year}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border-light">
            <h4 className="text-h4 font-semibold mb-3">Additional Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Enrollment Date</span>
                <span className="text-text-primary font-medium">January 2024</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Accommodation Status</span>
                <span className="text-text-primary font-medium">On Campus</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="text-text-muted">Dining Plan</span>
                <span className="text-text-primary font-medium">Standard Plan</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">ID Card Status</span>
                <span className="text-text-primary font-medium">Issued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border-light px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" leftIcon={<FiEdit2 />}>Edit Student</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmationModalProps {
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  studentName,
  onConfirm,
  onCancel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="text-3xl text-error-500" />
          </div>
          <h3 className="text-h3 font-bold text-text-primary mb-2">Delete Student?</h3>
          <p className="text-body text-text-secondary">
            Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} fullWidth>
            Delete
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// QR Code Modal
interface QRCodeModalProps {
  student: Student;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ student, onClose }) => {
  // Mock QR code data - In production, fetch from API
  const qrCodeData: QRCodeData = {
    student_number: student.studentId,
    full_name: student.name,
    department: student.program,
    institution: 'Mutare Teachers College',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h3 font-bold text-text-primary">Student QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* QR Code Display */}
        <QRCodeDisplay
          data={qrCodeData}
          size={280}
          includeDownload
          showBorder
        />

        {/* Info */}
        <Card padding="sm" variant="bordered" className="mt-4 bg-surface">
          <div className="space-y-2 text-sm">
            <p className="text-text-muted">
              This QR code contains student information for quick verification.
              Scan it using the dining hall scanner or ID verification system.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// ID Card Modal
interface IDCardModalProps {
  student: Student;
  onClose: () => void;
}

const IDCardModal: React.FC<IDCardModalProps> = ({ student, onClose }) => {
  // Mock student data for ID card - In production, fetch from API
  const studentData: StudentData = {
    student_number: student.studentId,
    full_name: student.name,
    department: student.program,
    year_of_study: student.year,
    photo_url: null, // Would come from API
    qr_code_url: null, // Would come from API
    email: student.email,
    phone_number: student.phone,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full my-8 mx-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-h2 font-bold text-text-primary">ID Card Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vertical Preview */}
          <div>
            <h3 className="text-h3 font-semibold mb-4 text-text-primary">Vertical ID Card</h3>
            <IDCardPreview student={studentData} variant="vertical" />
          </div>

          {/* Horizontal Preview */}
          <div>
            <h3 className="text-h3 font-semibold mb-4 text-text-primary">Horizontal ID Card</h3>
            <IDCardPreview student={studentData} variant="horizontal" />
          </div>

          {/* Info Banner */}
          <Card padding="md" variant="bordered" className="bg-info-50 border-info-200">
            <div className="flex items-start gap-3">
              <div className="text-info-600 text-xl">
                <FiCamera />
              </div>
              <div className="space-y-1">
                <h4 className="text-h4 font-semibold text-info-800">Photo Required</h4>
                <p className="text-small text-info-700">
                  To generate the final ID card, please upload a passport-style photo for this student.
                  The ID card will automatically include the student's photo and QR code once uploaded.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

// QR Scanner Modal
interface QRScannerModalProps {
  onClose: () => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const handleScan = (data: any) => {
    console.log('Scanned:', data);
    // Handle scan result - verify student, process meal, etc.
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
      >
        <QRScanner onScan={handleScan} showPreview={true} />
        
        <div className="mt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Close Scanner
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

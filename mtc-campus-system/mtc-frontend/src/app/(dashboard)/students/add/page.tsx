'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiUser, FiMail, FiPhone, FiCalendar, FiBook } from 'react-icons/fi';

export default function AddStudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    program: '',
    yearOfStudy: '',
    studentNumber: '',
    address: '',
    emergencyContact: '',
    guardianName: '',
    guardianPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.program) newErrors.program = 'Program is required';
    if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!formData.studentNumber.trim()) newErrors.studentNumber = 'Student number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Student added successfully!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/students');
      }, 1500);
    }, 1500);
  };

  return (
    <DashboardLayout pageTitle="Add New Student">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">Add New Student</h1>
            <p className="text-body text-text-secondary">
              Fill in the student information below
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="success" onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information */}
          <Card variant="elevated" padding="lg">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <FiUser className="text-primary-500" />
                  Personal Information
                </div>
              }
              subtitle="Basic student details"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              
              <Input
                label="Last Name *"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
              
              <Input
                label="Email Address *"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                leftIcon={<FiMail />}
                required
              />
              
              <Input
                label="Phone Number *"
                name="phone"
                type="tel"
                placeholder="+263 77 123 4567"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                leftIcon={<FiPhone />}
                required
              />
              
              <Input
                label="Date of Birth *"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
                leftIcon={<FiCalendar />}
                required
              />
              
              <div>
                <label className="block text-small font-medium text-text-secondary mb-1.5">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.gender ? 'border-error-500' : 'border-border-medium'
                  }`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-small text-error-500">{errors.gender}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Academic Information */}
          <Card variant="elevated" padding="lg">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <FiBook className="text-primary-500" />
                  Academic Information
                </div>
              }
              subtitle="Program and enrollment details"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-small font-medium text-text-secondary mb-1.5">
                  Program *
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.program ? 'border-error-500' : 'border-border-medium'
                  }`}
                  required
                >
                  <option value="">Select program</option>
                  <option value="education">Education</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                  <option value="commerce">Commerce</option>
                </select>
                {errors.program && (
                  <p className="mt-1 text-small text-error-500">{errors.program}</p>
                )}
              </div>
              
              <div>
                <label className="block text-small font-medium text-text-secondary mb-1.5">
                  Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.yearOfStudy ? 'border-error-500' : 'border-border-medium'
                  }`}
                  required
                >
                  <option value="">Select year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                {errors.yearOfStudy && (
                  <p className="mt-1 text-small text-error-500">{errors.yearOfStudy}</p>
                )}
              </div>
              
              <Input
                label="Student Number *"
                name="studentNumber"
                placeholder="STU-2024-XXX"
                value={formData.studentNumber}
                onChange={handleInputChange}
                error={errors.studentNumber}
                required
              />
              
              <div className="flex items-end">
                <Button type="button" variant="secondary" className="w-full" leftIcon={<FiUpload />}>
                  Upload Student Photo
                </Button>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card variant="elevated" padding="lg">
            <CardHeader
              title="Additional Information"
              subtitle="Address and emergency contact"
            />
            
            <div className="space-y-4">
              <TextArea
                label="Residential Address"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Emergency Contact Name"
                  name="emergencyContact"
                  placeholder="Contact person name"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Guardian Name"
                  name="guardianName"
                  placeholder="Guardian full name"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Adding Student...' : 'Add Student'}
            </Button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}

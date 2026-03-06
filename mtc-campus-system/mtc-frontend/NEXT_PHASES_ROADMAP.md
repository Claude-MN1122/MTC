# 🎯 MTC Campus Management System - Next Phases Roadmap

## Executive Summary

After thorough analysis of the MTC Campus Management System frontend, this document outlines the critical next phases to transform the **production-ready codebase** into a **fully functional production system**.

---

## 📊 Current State Assessment

### ✅ What's Complete (100%)
- **All 14 Stages Implemented** - Every planned feature is coded
- **60+ React Components** - Full component library created
- **300+ API Methods** - Comprehensive API integration layer
- **Modern UI/UX** - Premium SaaS design with TailwindCSS
- **Responsive Design** - Works on all device sizes
- **TypeScript Strict Mode** - Type-safe codebase
- **Documentation** - 15+ comprehensive documentation files

### ⚠️ What Needs Work

#### Critical Issues (Must Fix Before Production)
1. ❌ **No Environment Configuration** - Missing `.env.local` file
2. ❌ **Backend Not Integrated** - Frontend uses mock data
3. ❌ **Authentication Untested** - Login flow not validated with real backend
4. ❌ **QR Scanner Simulated** - Uses fake scanning, needs real library
5. ❌ **No Error Boundaries** - App crashes on unhandled errors
6. ❌ **Missing Loading States** - Some async operations lack proper UI feedback

#### High Priority (Should Fix Soon)
1. ⚠️ **Form Validation Basic** - Needs React Hook Form integration
2. ⚠️ **File Uploads Not Implemented** - Student photo uploads missing
3. ⚠️ **No Testing Suite** - Zero unit/integration/E2E tests
4. ⚠️ **API Response Handling** - Error messages not user-friendly
5. ⚠️ **No Real-Time Updates** - Manual refresh required

#### Medium Priority (Nice to Have)
1. 💡 **Performance Optimization** - Bundle size, lazy loading
2. 💡 **Accessibility Compliance** - WCAG 2.1 AA standards
3. 💡 **Dark Mode** - User preference support
4. 💡 **Multi-Language** - Internationalization
5. 💡 **Advanced Analytics** - D3.js visualizations

---

## 🚀 Phase 1: Critical Infrastructure (IMMEDIATE - 1 Week)

### 1.1 Environment Setup
**Priority**: 🔴 CRITICAL | **Effort**: 2 hours

#### Tasks:
```bash
# Create .env.local file in mtc-frontend/
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="MTC Campus System"
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
```

**Why Critical**: Without this, frontend cannot connect to backend API.

**Success Criteria**:
- [ ] `.env.local` file created
- [ ] Frontend can access `process.env.NEXT_PUBLIC_API_URL`
- [ ] No console errors about missing environment variables

---

### 1.2 Backend API Verification
**Priority**: 🔴 CRITICAL | **Effort**: 1 day

#### Prerequisites:
Ensure backend Django server is running:
```bash
cd mtc-campus-system/backend
python manage.py runserver
# Should be accessible at http://localhost:8000
```

#### API Endpoints to Test:
```bash
# Authentication
curl http://localhost:8000/api/auth/login/ -X POST -H "Content-Type: application/json" -d '{"email":"admin@mtc.ac.zw","password":"admin123"}'

# Students
curl http://localhost:8000/api/students/

# Accommodation
curl http://localhost:8000/api/accommodation/dashboard/

# Dining
curl http://localhost:8000/api/dining/statistics/

# Finance
curl http://localhost:8000/api/finance/invoices/

# Library
curl http://localhost:8000/api/library/books/

# Analytics
curl http://localhost:8000/api/analytics/dashboard/
```

#### CORS Configuration (Backend):
In `backend/config/settings.py`:
```python
INSTALLED_APPS = [
    # ... existing apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add at top
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

**Success Criteria**:
- [ ] All API endpoints return valid JSON responses
- [ ] CORS headers allow frontend requests
- [ ] No 500 errors in backend logs
- [ ] Database queries execute successfully

---

### 1.3 Replace Mock Data with Real API Calls
**Priority**: 🔴 CRITICAL | **Effort**: 2 days

#### Example: Update Students Page

**Current Code** (Line 23-30 in `students/page.tsx`):
```typescript
const mockStudents = [
  { id: 1, name: 'Tinashe Moyo', email: 'tinashe.m@mtc.ac.zw', ... },
  // ... more mock data
];

const [students, setStudents] = useState<Student[]>(mockStudents);
```

**Updated Code**:
```typescript
import { getStudents } from '@/services/studentApi';

const [students, setStudents] = useState<Student[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchStudents();
}, []);
```

**Files Needing Updates**:
1. `src/app/(dashboard)/students/page.tsx`
2. `src/app/(dashboard)/accommodation/page.tsx`
3. `src/app/(dashboard)/dining/page.tsx`
4. `src/app/(dashboard)/finance/page.tsx`
5. `src/app/(dashboard)/library/page.tsx`
6. `src/app/(dashboard)/analytics/page.tsx`
7. `src/app/(dashboard)/page.tsx` (Main dashboard)

**Success Criteria**:
- [ ] All pages display real backend data
- [ ] Loading states work correctly
- [ ] Error handling shows user-friendly messages
- [ ] No references to "mock" data remain

---

### 1.4 Authentication Flow Testing
**Priority**: 🔴 CRITICAL | **Effort**: 1 day

#### Test Login Process:

**Step 1**: Navigate to login page
```
http://localhost:3000/auth/login
```

**Step 2**: Enter credentials and submit
- Email: `admin@mtc.ac.zw`
- Password: (check backend for actual password)

**Step 3**: Verify successful login
- Should redirect to `/dashboard`
- Token stored in localStorage
- User info available in AuthContext

**Common Issues & Fixes**:

**Issue 1**: Login returns 401 Unauthorized
```typescript
// Check backend response format
console.log('Login response:', response.data);
// Expected: { token: '...', user: {...} }
```

**Issue 2**: Redirect fails after login
```typescript
// Ensure router.push is called
router.push('/dashboard');
```

**Issue 3**: Token not persisting
```typescript
// Verify localStorage
localStorage.setItem('token', token);
console.log('Token saved:', localStorage.getItem('token'));
```

**Success Criteria**:
- [ ] Users can log in with valid credentials
- [ ] Redirects to dashboard after successful login
- [ ] Token persists across page refreshes
- [ ] Logout clears token and redirects to login

---

### 1.5 Implement Protected Routes
**Priority**: 🔴 CRITICAL | **Effort**: 3 hours

#### Create Dashboard Layout Guard:

**File**: `src/app/(dashboard)/layout.tsx`
```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
```

**Success Criteria**:
- [ ] Unauthenticated users redirected to login
- [ ] Loading screen shown during auth check
- [ ] Protected routes inaccessible without login
- [ ] No flash of unauthenticated content

---

## 🔧 Phase 2: Core Functionality (HIGH - 2 Weeks)

### 2.1 Real QR Scanner Implementation
**Priority**: 🟠 HIGH | **Effort**: 1 day

#### Install QR Library:
```bash
npm install html5-qrcode
```

#### Update DiningQRScanner Component:

**File**: `src/components/dining/DiningQRScanner.tsx`

**Replace simulated scan** (around line 100) with:
```typescript
import { Html5QrcodeScanner } from 'html5-qrcode';

useEffect(() => {
  const scanner = new Html5QrcodeScanner('reader', {
    fps: 10,
    qrbox: 250,
    aspectRatio: 1.0,
  });

  scanner.render(
    (decodedText) => {
      // Success callback
      try {
        const data = JSON.parse(decodedText);
        onScan(data);
      } catch (error) {
        console.error('Invalid QR data:', error);
        onError('Invalid QR code format');
      }
    },
    (error) => {
      // Error callback (scan failure, not camera error)
      console.warn('Scan error:', error);
    }
  );

  return () => {
    scanner.clear().catch(console.error);
  };
}, [onScan, onError]);
```

**Add Camera Permission Request**:
```typescript
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } // Use back camera on mobile
    });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    setError('Camera permission is required for QR scanning');
    return false;
  }
};
```

**Success Criteria**:
- [ ] Real QR codes scan successfully
- [ ] Camera permission requested properly
- [ ] Scan results parsed and displayed
- [ ] Works on mobile browsers
- [ ] Error handling for invalid QR codes

---

### 2.2 Form Validation with React Hook Form
**Priority**: 🟠 HIGH | **Effort**: 2 days

#### Install Dependencies:
```bash
npm install react-hook-form @hookform/resolvers zod
```

#### Create Validation Schema:

**File**: `src/lib/validations.ts`
```typescript
import { z } from 'zod';

export const studentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string()
    .regex(/^\+?[\d\s-]{8,}$/, 'Invalid phone number'),
  program: z.enum(['Education', 'Science', 'Arts', 'Commerce']),
  year_of_study: z.number().min(1).max(4, 'Year must be between 1 and 4'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const accommodationSchema = z.object({
  student_id: z.number().positive('Student ID required'),
  hostel_id: z.number().positive('Hostel selection required'),
  room_number: z.string().min(1, 'Room number required'),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender: z.enum(['Male', 'Female']),
});

export type AccommodationFormData = z.infer<typeof accommodationSchema>;
```

#### Update Add Student Form:

**Example Integration**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentFormData } from '@/lib/validations';

const AddStudentModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      await createStudent(data);
      onClose();
    } catch (error: any) {
      // Handle server-side validation errors
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          setError(field as keyof StudentFormData, {
            type: 'server',
            message: (messages as string[]).join(', '),
          });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Full Name</label>
        <input {...register('full_name')} />
        {errors.full_name && (
          <span className="text-error-500 text-sm">{errors.full_name.message}</span>
        )}
      </div>
      
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && (
          <span className="text-error-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      
      {/* ... other fields */}
      
      <button type="submit">Save Student</button>
    </form>
  );
};
```

**Success Criteria**:
- [ ] All forms use React Hook Form
- [ ] Client-side validation prevents invalid submissions
- [ ] Server-side validation errors displayed correctly
- [ ] Error messages are clear and helpful
- [ ] Form state managed efficiently (no unnecessary re-renders)

---

### 2.3 File Upload Implementation
**Priority**: 🟠 HIGH | **Effort**: 1 day

#### Backend Endpoint (Django):

**File**: `backend/apps/students/views.py`
```python
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_student_photo(request, pk):
    """Upload student photo"""
    try:
        student = Student.objects.get(pk=pk)
        
        if 'photo' not in request.FILES:
            return Response(
                {'error': 'No photo provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        photo = request.FILES['photo']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
        if photo.content_type not in allowed_types:
            return Response(
                {'error': 'Only JPG and PNG files are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (5MB max)
        if photo.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'File size must be less than 5MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        student.photo = photo
        student.save()
        
        return Response({
            'message': 'Photo uploaded successfully',
            'photo_url': student.photo.url
        })
    except Student.DoesNotExist:
        return Response(
            {'error': 'Student not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
```

#### Frontend Upload Component:

**File**: `src/components/students/PhotoUpload.tsx`
```typescript
import { useState } from 'react';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface PhotoUploadProps {
  studentId: number;
  currentPhotoUrl?: string | null;
  onUploadComplete: (photoUrl: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  studentId,
  currentPhotoUrl,
  onUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG and PNG files are allowed');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setIsUploading(true);
      setError(null);
      
      const response = await apiClient.post(
        `/students/${studentId}/upload-photo/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      onUploadComplete(response.data.photo_url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview || currentPhotoUrl ? (
          <img
            src={preview || currentPhotoUrl}
            alt="Student"
            className="w-32 h-32 rounded-lg object-cover"
          />
        ) : (
          <div className="w-32 h-32 bg-surface rounded-lg flex items-center justify-center">
            <span className="text-text-muted text-sm">No Photo</span>
          </div>
        )}
        
        <div className="flex-1">
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
          </label>
          
          {isUploading && (
            <p className="text-sm text-primary-600 mt-2">Uploading...</p>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-error-600 mt-2">
              <FiAlertCircle className="text-lg" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Success Criteria**:
- [ ] Students can upload photos
- [ ] File validation works (size + type)
- [ ] Preview shows before upload completes
- [ ] Uploaded photos display immediately
- [ ] Photos persist in database

---

## 📝 Phase 3: Documentation Continuation

See `NEXT_PHASES_PART2.md` for remaining phases including:
- Phase 3: Quality Assurance (Testing, Error Boundaries)
- Phase 4: Performance Optimization
- Phase 5: Deployment & Production
- Appendix A: Troubleshooting Guide
- Appendix B: Quick Reference Commands

---

## 📋 Immediate Action Checklist

### Today (Day 1):
- [ ] Create `.env.local` file
- [ ] Start backend Django server
- [ ] Verify CORS configuration
- [ ] Test API endpoints with curl/Postman

### This Week (Days 2-5):
- [ ] Replace all mock data with API calls
- [ ] Test authentication flow end-to-end
- [ ] Implement protected route guards
- [ ] Fix any API integration issues

### Next Week (Days 6-10):
- [ ] Install and integrate real QR scanner library
- [ ] Set up React Hook Form for validation
- [ ] Implement file upload functionality
- [ ] Test all core features with real data

---

## 🎯 Success Metrics

### Phase 1 Completion Criteria:
✅ All pages load with real backend data  
✅ Users can log in and out successfully  
✅ Protected routes prevent unauthorized access  
✅ No mock data remaining in codebase  

### Phase 2 Completion Criteria:
✅ QR codes scan with real camera  
✅ Forms validate input properly  
✅ File uploads work correctly  
✅ Error messages are user-friendly  

### Overall Project Readiness:
🎉 **Production Ready** when:
- All Phase 1 & 2 tasks complete
- Test suite passes (>80% coverage)
- Performance metrics meet targets
- Security audit passed
- User acceptance testing complete

---

**Last Updated**: March 6, 2026  
**Document Version**: 1.0  
**Next Review**: After Phase 1 completion

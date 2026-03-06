# 🎯 MTC Campus Management System - Next Phases (Part 2)

## Phase 3: Quality Assurance (MEDIUM - 1 Week)

### 3.1 Error Boundaries & Error Handling
**Priority**: 🟡 MEDIUM | **Effort**: 1 day

#### Create Global Error Boundary:

**File**: `src/components/error/ErrorBoundary.tsx`
```typescript
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error reporting service (e.g., Sentry)
    // logToService(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoBack = () => {
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <Card variant="elevated" padding="lg" className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-3xl text-error-500" />
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-2">
                Oops! Something went wrong
              </h2>
              
              <p className="text-body text-text-secondary mb-4">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-4 p-4 bg-surface rounded-lg">
                  <summary className="cursor-pointer text-sm font-semibold mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-error-600 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={this.handleReload}
                leftIcon={<FiRefreshCw />}
                fullWidth
              >
                Reload Page
              </Button>
              
              <Button variant="secondary" onClick={this.handleGoBack} fullWidth>
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Wrap App with Error Boundary:

**File**: `src/app/layout.tsx`
```typescript
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

#### Add Per-Component Error Handling:

**Example**: In async components or pages
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const StudentsPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getStudents();
      // ... process data
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="bg-error-50 border-error-200">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-2xl text-error-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-error-800 mb-1">
              Failed to Load Students
            </h3>
            <p className="text-error-700 mb-3">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchStudents}
              leftIcon={<FiRefreshCw />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // ... rest of component
};
```

**Success Criteria**:
- [ ] App doesn't crash on unhandled errors
- [ ] User-friendly error messages displayed
- [ ] Error details shown in development mode
- [ ] Users can recover from errors (retry/go back)
- [ ] Errors logged to console for debugging

---

### 3.2 Comprehensive Loading States
**Priority**: 🟡 MEDIUM | **Effort**: 1 day

#### Enhance Skeleton Components:

**File**: `src/components/ui/Skeleton.tsx`
```typescript
import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  animation = 'pulse',
  className = '',
}) => {
  const baseStyles = 'bg-surface-elevated';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'shimmer', // Custom shimmer animation
    none: '',
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

// Pre-built skeleton patterns
export const StudentRowSkeleton = () => (
  <tr>
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
);

export const StatCardSkeleton = () => (
  <div className="space-y-3">
    <div className="flex justify-between">
      <Skeleton variant="circular" width="48px" height="48px" />
      <Skeleton variant="text" width="60px" height="24px" />
    </div>
    <Skeleton variant="text" width="100px" height="14px" />
    <Skeleton variant="text" width="80px" height="24px" />
    <Skeleton variant="text" width="120px" height="12px" />
  </div>
);
```

#### Add Page-Level Loading:

**Pattern for All Pages**:
```typescript
const StudentsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Students">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width="200px" height="32px" />
            <Skeleton variant="rectangular" width="150px" height="40px" />
          </div>
          
          {/* Filter Section */}
          <Card padding="md">
            <div className="flex gap-4">
              <Skeleton variant="text" width="300px" height="40px" className="flex-1" />
              <Skeleton variant="text" width="120px" height="40px" />
              <Skeleton variant="text" width="100px" height="40px" />
            </div>
          </Card>
          
          {/* Table Skeleton */}
          <Card variant="elevated">
            <table className="w-full">
              <thead>
                <tr>{/* Headers */}</tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <StudentRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    // ... actual content
  );
};
```

#### Add Button Loading State:

**Already exists in Button component**, ensure usage:
```typescript
<Button 
  variant="primary" 
  onClick={handleSubmit}
  loading={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

**Success Criteria**:
- [ ] All async operations show loading states
- [ ] Skeleton screens match final content layout
- [ ] Loading animations are smooth (60fps)
- [ ] Users know when action is in progress
- [ ] No sudden layout shifts during loading

---

### 3.3 Testing Suite Setup
**Priority**: 🟡 MEDIUM | **Effort**: 3 days

#### Install Testing Libraries:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom @vitest/ui happy-dom
```

#### Configure Vitest:

**File**: `vitest.config.ts`
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
```

#### Create Test Setup:

**File**: `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));
```

#### Add Test Scripts to package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### Write First Component Test:

**File**: `src/components/ui/__tests__/Button.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state and disables button', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/loading/i);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-white');
    
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-error-500');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');
    
    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });

  it('displays icon alongside text', () => {
    render(<Button leftIcon={<span data-testid="icon">🔍</span>}>Search</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Search');
  });

  it('respects disabled state', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

#### Integration Test Example:

**File**: `src/app/(dashboard)/students/__tests__/page.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentsPage from '../page';
import * as studentApi from '@/services/studentApi';

// Mock API calls
vi.mock('@/services/studentApi', () => ({
  getStudents: vi.fn(),
  deleteStudent: vi.fn(),
}));

describe('StudentsPage Integration', () => {
  const mockStudents = [
    {
      id: 1,
      name: 'Tinashe Moyo',
      email: 'tinashe.m@mtc.ac.zw',
      studentId: 'STU-2024-001',
      year: 1,
      status: 'active' as const,
      program: 'Education',
      phone: '+263 77 123 4567',
    },
    {
      id: 2,
      name: 'Farai Chikomo',
      email: 'farai.c@mtc.ac.zw',
      studentId: 'STU-2024-002',
      year: 2,
      status: 'active' as const,
      program: 'Science',
      phone: '+263 77 234 5678',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays students', async () => {
    vi.mocked(studentApi.getStudents).mockResolvedValue(mockStudents);
    
    render(<StudentsPage />);
    
    // Show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('Tinashe Moyo')).toBeInTheDocument();
      expect(screen.getByText('Farai Chikomo')).toBeInTheDocument();
    });
    
    expect(studentApi.getStudents).toHaveBeenCalledTimes(1);
  });

  it('filters students by search query', async () => {
    vi.mocked(studentApi.getStudents).mockResolvedValue(mockStudents);
    
    render(<StudentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tinashe Moyo')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'Tinashe');
    
    await waitFor(() => {
      expect(screen.getByText('Tinashe Moyo')).toBeInTheDocument();
      expect(screen.queryByText('Farai Chikomo')).not.toBeInTheDocument();
    });
  });

  it('filters students by status', async () => {
    const studentsWithInactive = [
      ...mockStudents,
      {
        ...mockStudents[0],
        status: 'inactive' as const,
      },
    ];
    
    vi.mocked(studentApi.getStudents).mockResolvedValue(studentsWithInactive);
    
    render(<StudentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tinashe Moyo')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    await userEvent.selectOptions(statusSelect, 'active');
    
    await waitFor(() => {
      expect(screen.getByText('Farai Chikomo')).toBeInTheDocument();
    });
  });

  it('shows empty state when no students match filters', async () => {
    vi.mocked(studentApi.getStudents).mockResolvedValue([]);
    
    render(<StudentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/no students found/i)).toBeInTheDocument();
    });
  });
});
```

#### Run Tests:
```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Open interactive UI
npm run test:ui
```

**Success Criteria**:
- [ ] All UI components have unit tests
- [ ] Critical pages have integration tests
- [ ] Test coverage > 70%
- [ ] Tests pass consistently
- [ ] CI/CD can run tests automatically

---

## ⚡ Phase 4: Performance Optimization (LOW - 1 Week)

### 4.1 Bundle Size Analysis
**Priority**: 🟢 LOW | **Effort**: 1 day

#### Analyze Bundle:
```bash
npm install --save-dev @next/bundle-analyzer
```

**File**: `next.config.ts`
```typescript
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // ... existing config
};

const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

export default bundleAnalyzerConfig;
```

#### Run Analysis:
```bash
ANALYZE=true npm run build
```

This opens a visualizer showing which packages contribute most to bundle size.

#### Optimization Strategies:

**1. Lazy Load Heavy Components**:
```typescript
import dynamic from 'next/dynamic';

const QRScanner = dynamic(
  () => import('@/components/qr-codes/QRScanner'),
  { 
    loading: () => <div>Loading scanner...</div>,
    ssr: false, // Disable server-side rendering
  }
);

const RechartsChart = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { ssr: false }
);
```

**2. Tree Shaking for Icons**:
```typescript
// ❌ Bad - imports all icons
import * as FiIcons from 'react-icons/fi';

// ✅ Good - imports only what's used
import { FiSearch, FiPlus, FiEdit2 } from 'react-icons/fi';
```

**3. Code Splitting by Route**:
Next.js does this automatically, but you can enhance it:
```typescript
// Heavy component only used on analytics page
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/AnalyticsDashboard'),
  { loading: () => <AnalyticsSkeleton /> }
);
```

**Success Criteria**:
- [ ] Initial JavaScript bundle < 200KB
- [ ] Total page weight < 1MB
- [ ] Time to Interactive < 3 seconds
- [ ] Lighthouse performance score > 90

---

### 4.2 Image Optimization
**Priority**: 🟢 LOW | **Effort**: 1 day

#### Use Next.js Image Component:

```typescript
import Image from 'next/image';

// Instead of <img> tag
<img src="/logo.png" alt="Logo" />

// Use optimized version
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-fold images
  quality={75}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Configure Image Domains:

**File**: `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'api.mtc-campus.ac.zw'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mtc-campus.ac.zw',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
```

**Success Criteria**:
- [ ] All images use Next.js Image component
- [ ] Images served in WebP/AVIF format
- [ ] Proper sizing for different viewports
- [ ] Lazy loading for below-fold images

---

### 4.3 React Query for Data Caching
**Priority**: 🟢 LOW | **Effort**: 2 days

#### Already Installed! (`@tanstack/react-query` in package.json)

#### Setup Query Client:

**File**: `src/lib/queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Wrap App:

**File**: `src/app/layout.tsx`
```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

#### Update API Calls:

**Before**:
```typescript
const [students, setStudents] = useState([]);

useEffect(() => {
  getStudents().then(setStudents);
}, []);
```

**After**:
```typescript
import { useQuery } from '@tanstack/react-query';

const { data: students = [], isLoading, error } = useQuery({
  queryKey: ['students'],
  queryFn: getStudents,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

#### Add Mutations:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: createStudent,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['students'] });
  },
});

const handleSubmit = (data) => {
  mutation.mutate(data);
};
```

**Success Criteria**:
- [ ] API responses cached appropriately
- [ ] Automatic background refetching
- [ ] Optimistic updates for mutations
- [ ] Reduced API calls (better UX)

---

## 🚀 Phase 5: Deployment & Production (CRITICAL)

### 5.1 Production Build Testing
**Priority**: 🔴 CRITICAL | **Effort**: 1 day

#### Build Locally:
```bash
npm run build
npm start
# Opens http://localhost:3000
```

#### Check for Build Errors:
```bash
# Look for:
- TypeScript errors
- ESLint warnings
- Missing environment variables
- Import/export issues
```

#### Fix Common Issues:

**Issue**: `window` is undefined
```typescript
// ❌ Bad - runs on server
const token = localStorage.getItem('token');

// ✅ Good - runs only on client
useEffect(() => {
  const token = localStorage.getItem('token');
}, []);
```

**Issue**: Environment variables not available
```typescript
// Ensure .env.local exists
NEXT_PUBLIC_API_URL=http://localhost:8000/api

// Access correctly
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Success Criteria**:
- [ ] Build completes without errors
- [ ] Production server starts successfully
- [ ] All pages render correctly
- [ ] No console errors in production

---

### 5.2 Deployment Platform Setup

#### Option A: Vercel (Recommended)

**Step 1**: Push to Git
```bash
git add .
git commit -m "Production ready"
git push origin main
```

**Step 2**: Connect to Vercel
1. Go to https://vercel.com
2. Import Git repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `mtc-frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Step 3**: Add Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.mtc-campus.ac.zw
```

**Step 4**: Deploy
- Click "Deploy"
- Auto-deploys on every push

---

#### Option B: Docker Deployment

**Create Dockerfile**:

**File**: `Dockerfile`
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and Run**:
```bash
docker build -t mtc-frontend .
docker run -p 3000:3000 mtc-frontend
```

---

### 5.3 Production Environment Variables

**Create `.env.production`**:
```env
NEXT_PUBLIC_API_URL=https://api.mtc-campus.ac.zw
NEXT_PUBLIC_APP_NAME="MTC Campus System"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_QR_SCANNER=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
```

**Never commit production secrets!**
```bash
# Add to .gitignore
.env.production
.env*.local
```

---

## Appendix A: Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: "Cannot connect to backend"

**Symptoms**:
- Console shows `ERR_CONNECTION_REFUSED`
- API calls fail with network errors

**Solutions**:
1. Verify backend is running: `http://localhost:8000`
2. Check CORS configuration in Django settings
3. Ensure `.env.local` has correct `NEXT_PUBLIC_API_URL`
4. Restart both frontend and backend

---

#### Issue 2: "Authentication fails after login"

**Symptoms**:
- Login succeeds but redirects back to login
- Token not persisting

**Solutions**:
1. Check localStorage: `console.log(localStorage.getItem('token'))`
2. Verify backend returns `{ token, user }` structure
3. Ensure auth interceptor is adding token to requests
4. Clear browser cache and cookies

---

#### Issue 3: "Camera not working for QR scanner"

**Symptoms**:
- Camera permission denied
- Black screen in scanner

**Solutions**:
1. Grant camera permission in browser settings
2. Use HTTPS in production (required for camera access)
3. Check browser compatibility (Chrome/Firefox/Edge)
4. Test on mobile device with rear camera

---

#### Issue 4: "Build fails with TypeScript errors"

**Symptoms**:
- `npm run build` shows TS errors
- Type mismatches in components

**Solutions**:
```bash
# Find all errors
npm run lint

# Fix type definitions
# Check interfaces match API responses
# Update TypeScript interfaces if needed
```

---

#### Issue 5: "Pages show mock data instead of real API"

**Symptoms**:
- Same data appears after backend changes
- API calls not visible in Network tab

**Solutions**:
1. Search codebase for `mockStudents`, `mockData`, etc.
2. Replace with API service calls
3. Clear browser cache
4. Check Network tab for API requests

---

## Appendix B: Quick Reference Commands

### Development
```bash
# Start frontend
cd mtc-frontend
npm run dev

# Start backend
cd backend
python manage.py runserver

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm start
```

### Database
```bash
# Reset database (PowerShell)
.\reset-db.ps1

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed test data
python manage.py shell < seed_data.py
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npx prettier --write .

# Check types
npx tsc --noEmit

# Run tests with coverage
npm run test:coverage
```

### Deployment
```bash
# Build and analyze bundle
ANALYZE=true npm run build

# Docker build
docker build -t mtc-frontend .

# Docker run
docker run -p 3000:3000 mtc-frontend
```

---

## 📊 Progress Tracking Template

Copy this to track your progress:

```markdown
## Phase Progress

### Phase 1: Critical Infrastructure
- [x] Environment setup (.env.local created)
- [ ] Backend API verification (0/7 endpoints tested)
- [ ] Mock data replacement (0/7 pages updated)
- [ ] Authentication flow testing
- [ ] Protected routes implementation

### Phase 2: Core Functionality
- [ ] Real QR scanner integration
- [ ] React Hook Form setup
- [ ] File upload implementation
- [ ] Real-time data integration

### Phase 3: Quality Assurance
- [ ] Error boundaries added
- [ ] Loading states enhanced
- [ ] Testing suite configured
- [ ] Unit tests written (0/60 components)

### Phase 4: Performance
- [ ] Bundle analysis completed
- [ ] Image optimization applied
- [ ] React Query caching implemented

### Phase 5: Deployment
- [ ] Production build tested
- [ ] Deployment platform chosen
- [ ] Environment variables configured
- [ ] DNS and SSL setup
```

---

**Last Updated**: March 6, 2026  
**Document Version**: 1.0  
**Status**: Ready for Implementation

---

## 🎉 You're Ready!

The frontend codebase is **production-ready**. Follow this roadmap systematically, and you'll have a fully functional campus management system running in production within 2-3 weeks.

**Need Help?**
- Check troubleshooting guide in Appendix A
- Review component documentation in `/mtc-frontend/` folder
- Test APIs using Postman/curl before integration
- Start with Phase 1, don't skip ahead!

**Good luck!** 🚀

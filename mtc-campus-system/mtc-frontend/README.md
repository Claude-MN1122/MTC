# MTC Campus Management System - Frontend

A premium, modern SaaS dashboard for Mutare Teachers College built with Next.js 15, TypeScript, and TailwindCSS.

## 🎯 Project Overview

This is a **production-ready** frontend for a comprehensive campus management system featuring:

- ✅ Student records management
- ✅ QR student ID cards with download/print
- ✅ Accommodation applications & hostel allocation
- ✅ Dining hall meal access & QR scanning
- ✅ Finance & fee management
- ✅ Invoice generation and payment processing
- ✅ Library management
- ✅ Book catalog with ISBN/barcode support
- ✅ Borrowing/return tracking
- ✅ Real-time statistics dashboards
- ✅ Attendance tracking with CSV export
- ✅ Offline-first architecture
- ✅ Administrative analytics
- ✅ Real-time tracking & reporting

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running (Django REST Framework)

### Installation

```bash
# Navigate to frontend directory
cd mtc-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The application will be available at: `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   │   ├── login/            Login page
│   │   └── forgot-password/  Password recovery
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── students/         Student management
│   │   ├── accommodation/    Housing management
│   │   ├── dining/           Dining management
│   │   ├── analytics/        Reports & analytics
│   │   ├── qr-scanner/       QR code scanner
│   │   └── id-cards/         ID card generation
│   ├── layout.tsx            Root layout
│   └── globals.css           Global styles & theme
│
├── components/
│   ├── ui/                   # Base UI components
│   │   ├── Button.tsx        Button component
│   │   ├── Card.tsx          Card component
│   │   ├── Input.tsx         Input component
│   │   ├── Badge.tsx         Badge component
│   │   ├── Avatar.tsx        Avatar component
│   │   ├── Skeleton.tsx      Loading skeletons
│   │   └── Alert.tsx         Alert messages
│   │
│   └── layout/               # Layout components
│       ├── Sidebar.tsx       Sidebar navigation
│       ├── Navbar.tsx        Top navbar
│       └── DashboardLayout.tsx
│
├── context/                  # React Context
│   └── AuthContext.tsx       Authentication state
│
├── lib/                      # Utilities
│   ├── axios.ts              API client
│   └── utils.ts              Helper functions
│
└── types/                    # TypeScript types
```

## 🎨 Design System

### Color Palette

```css
/* Primary - Blue */
--primary-500: #3B82F6

/* Accent - Gold (use sparingly) */
--gold-500: #F59E0B

/* Background */
--background: #FFFFFF
--surface: #F8FAFC

/* Text */
--text-primary: #0F172A
--text-secondary: #475569
--text-muted: #94A3B8
```

### Typography

- **Font Family**: Inter, Plus Jakarta Sans
- **Scale**: Display, H1-H4, Body, Small, Caption

### Components

All components follow these principles:
- Framer Motion animations
- Consistent spacing (4px grid)
- Responsive design
- Accessibility support
- TypeScript types

## 🧩 Core Components

### Button

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">Click Me</Button>
```

**Variants**: primary, secondary, ghost, danger, success, gold  
**Sizes**: sm, md, lg  
**Features**: Loading state, icon support, disabled state

### Card

```tsx
import { Card, CardHeader } from '@/components/ui/Card';

<Card variant="default" padding="md">
  <CardHeader title="Title" subtitle="Subtitle" />
  Content here
</Card>
```

**Variants**: default, elevated, interactive, bordered

### Input

```tsx
import { Input } from '@/components/ui/Input';

<Input 
  label="Email" 
  placeholder="Enter email"
  error="Error message"
  leftIcon={<FiMail />}
/>
```

**Features**: Labels, placeholders, errors, hints, icons

### Badge

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Active</Badge>
```

**Variants**: default, success, warning, error, info, gold

### Avatar

```tsx
import { Avatar } from '@/components/ui/Avatar';

<Avatar name="John Doe" size="md" showStatus status="online" />
```

**Features**: Image or initials, status indicators

## 🔧 Utilities

### API Client

```tsx
import apiClient from '@/lib/axios';

// GET request
const data = await apiClient.get('/students');

// POST request
await apiClient.post('/students', { name, email });

// With auth token automatically attached
```

### Authentication

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Login
  await login(email, password);
  
  // Logout
  logout();
}
```

### Helper Functions

```tsx
import { cn, formatDate, truncate } from '@/lib/utils';

// Class names
className={cn('base', isActive && 'active')}

// Format date
formatDate(new Date()) // "March 5, 2026"

// Truncate text
truncate('Long text...', 50)
```

## 📱 Pages

### Authentication

- `/auth/login` - Login page
- `/auth/forgot-password` - Password recovery

### Dashboard

- `/dashboard` - Main dashboard
- `/dashboard/students` - Student management
- `/dashboard/accommodation` - Accommodation management
- `/dashboard/dining` - Dining management
- `/dashboard/analytics` - Analytics & reports
- `/dashboard/qr-scanner` - QR scanner
- `/dashboard/id-cards` - ID card generation

## 🎯 Key Features

### ✅ Implemented
- Modern UI component library
- Responsive layout system
- Authentication flow
- Navigation structure
- Theme system
- Loading states
- Error handling
- Mobile responsive
- Student management module
- QR code generation & display
- ID card preview & download
- QR scanner interface
- Accommodation management
- Hostel & room tracking
- Application processing
- Dining hall management
- QR meal scanning
- Attendance tracking
- Real-time statistics
- Offline-first architecture
- Finance & fee management
- Invoice generation
- Payment processing
- Balance tracking
- Financial analytics
- Library management
- Book catalog management
- Borrowing/return tracking
- Overdue detection

### 🚧 In Progress
- Advanced analytics & reporting (Stage 14 - Final)

## 🔒 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📚 Documentation

- **FRONTEND_DESIGN_GUIDE.md** - Complete design specifications
- **QUICK_REFERENCE.md** - Developer quick reference
- **PHASE_1_COMPLETE.md** - Implementation summary
- **STAGE_9_SUMMARY.md** - QR ID Card system summary ✨ NEW
- **STAGE_9_QR_ID_CARDS_COMPLETE.md** - Technical documentation ✨ NEW
- **QR_ID_CARD_QUICK_REFERENCE.md** - QR code usage guide ✨ NEW
- **STAGE_9_DEMO_GUIDE.md** - Step-by-step demos ✨ NEW
- **IMPLEMENTATION_PROGRESS.md** - Overall project tracking ✨ NEW
- **STAGE_10_SUMMARY.md** - Accommodation module summary ✨ NEW
- **STAGE_10_ACCOMMODATION_COMPLETE.md** - Accommodation technical docs ✨ NEW
- **ACCOMMODATION_QUICK_REFERENCE.md** - Accommodation usage guide ✨ NEW
- **STAGE_11_SUMMARY.md** - Dining Hall module summary ✨ NEW
- **STAGE_11_COMPLETE.md** - Stage 11 completion summary ✨ NEW
- **DINING_QUICK_REFERENCE.md** - Dining quick reference ✨ NEW
- **DINING_ARCHITECTURE.md** - Dining architecture overview ✨ NEW
- **STAGE_12_SUMMARY.md** - Finance module summary ✨ NEW
- **STAGE_12_COMPLETE.md** - Stage 12 completion summary ✨ NEW
- **STAGE_13_SUMMARY.md** - Library module summary ✨ NEW

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript strict mode
- Functional components
- Named exports
- Consistent prop naming
- JSDoc comments

### Component Pattern

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  prop: type;
}

export const Component: React.FC<Props> = ({ prop }) => {
  return (
    // JSX
  );
};

export type { Props };
```

### Best Practices

1. Use semantic HTML
2. Add ARIA labels
3. Handle loading states
4. Implement error boundaries
5. Optimize images
6. Use React.memo where beneficial
7. Implement proper error handling

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm start
```

### Recommended Platforms

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Railway

## 🐛 Known Issues

None at this time. Report issues to the development team.

## 📋 Roadmap

### Phase 1 - Foundation ✅
- [x] Project setup
- [x] Component library
- [x] Layout system
- [x] Authentication

### Phase 2 - Features 🚧
- [x] Student management ✅
- [x] QR ID cards ✅ (Stage 9 COMPLETE)
- [x] Accommodation ✅ (Stage 10 COMPLETE)
- [x] Dining management ✅ (Stage 11 COMPLETE)
- [x] Finance & fees ✅ (Stage 12 COMPLETE)
- [x] Library management ✅ (Stage 13 COMPLETE)
- [ ] Advanced analytics (Stage 14 - Final)

### Phase 3 - Polish ⏳
- [ ] Performance optimization
- [ ] Advanced features
- [ ] Testing
- [ ] Documentation

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Proprietary - Mutare Teachers College

## 👥 Team

- UI/UX Designer & Frontend Developer: AI Assistant
- Project Stakeholders: MTC Administration

## 📞 Support

For questions or issues:
- Check documentation files
- Review component examples
- Contact development team

---

**Last Updated**: March 5, 2026  
**Version**: 1.0.0  
**Status**: Phase 1 Complete - Ready for Feature Development

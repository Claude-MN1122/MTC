# MTC Frontend Quick Reference Guide

## 🎨 Design System

### Colors (STRICT)

```css
/* Use ONLY these colors */

/* Primary - Blue */
--primary-50: #EFF6FF
--primary-500: #3B82F6  ← Main brand color
--primary-600: #2563EB  ← Hover
--primary-700: #1D4ED8  ← Active

/* Accent - Gold (Use sparingly - 10-15% of blue) */
--gold-500: #F59E0B

/* Background */
White (#FFFFFF) - Main background
Surface (#F8FAFC) - Card surfaces

/* Text */
Text Primary: #0F172A
Text Secondary: #475569
Text Muted: #94A3B8
```

### Typography

```css
font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;

/* Sizes */
text-display: 2.5rem (40px) - Hero sections
text-h1: 2rem (32px) - Page titles
text-h2: 1.5rem (24px) - Section headers
text-h3: 1.25rem (20px) - Card titles
text-body: 1rem (16px) - Main content
text-small: 0.875rem (14px) - Secondary info
text-caption: 0.75rem (12px) - Labels
```

### Spacing

```css
padding/margin scale:
0.5 (2px), 1 (4px), 1.5 (6px), 2 (8px), 
2.5 (10px), 3 (12px), 4 (16px), 6 (24px), 
8 (32px), 10 (40px), 12 (48px)
```

### Shadows

```css
shadow-sm: Subtle elevation
shadow-md: Default card shadow
shadow-lg: Hover state
shadow-xl: Modal/overlay
```

## 🧩 Component Usage

### Button

```tsx
import { Button } from '@/components/ui/Button';

// Variants: primary | secondary | ghost | danger | success | gold
<Button variant="primary" size="md">Click Me</Button>
<Button variant="secondary" isLoading>Loading</Button>
<Button variant="ghost" leftIcon={<FiHome />}>With Icon</Button>
```

### Card

```tsx
import { Card, CardHeader } from '@/components/ui/Card';

<Card variant="default" padding="md">
  <CardHeader 
    title="Card Title" 
    subtitle="Optional subtitle"
    action={<Button>Action</Button>}
  />
  Card content here
</Card>
```

### Input

```tsx
import { Input, TextArea } from '@/components/ui/Input';

<Input 
  label="Email" 
  placeholder="Enter email"
  error="Error message"
  hint="Helpful text"
  leftIcon={<FiMail />}
/>

<TextArea label="Message" rows={4} />
```

### Badge

```tsx
import { Badge } from '@/components/ui/Badge';

// Variants: default | success | warning | error | info | gold
<Badge variant="success">Active</Badge>
<Badge variant="gold" icon={<FiStar />}>Premium</Badge>
```

### Alert

```tsx
import { Alert } from '@/components/ui/Alert';

// Variants: info | success | warning | error
<Alert variant="success" title="Success!">
  Operation completed successfully
</Alert>
```

### Avatar

```tsx
import { Avatar } from '@/components/ui/Avatar';

<Avatar 
  name="John Doe" 
  src="/avatar.jpg"
  size="md"
  showStatus
  status="online"
/>
```

## 📐 Layout Components

### DashboardLayout

```tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';

<DashboardLayout pageTitle="Dashboard">
  {/* Page content */}
</DashboardLayout>
```

### Sidebar Navigation

The sidebar includes:
- Logo section
- Navigation items (Dashboard, Students, ID Cards, etc.)
- Active indicator animation
- Bottom actions (Settings, Help, Logout)

### Navbar

The navbar includes:
- Search bar
- Notifications
- Dark mode toggle
- User profile dropdown

## 🔧 Utilities

### API Client

```tsx
import apiClient from '@/lib/axios';

// GET request
const response = await apiClient.get('/students');

// POST request
await apiClient.post('/students', data);

// PUT request
await apiClient.put(`/students/${id}`, data);

// DELETE request
await apiClient.delete(`/students/${id}`);
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
  
  // Check auth
  if (isAuthenticated) {
    // User is logged in
  }
}
```

### Helper Functions

```tsx
import { cn, formatDate, formatDateTime, truncate } from '@/lib/utils';

// Class names
className={cn('base-class', isActive && 'active-class')}

// Format date
formatDate(new Date()) // "March 5, 2026"
formatDateTime(new Date()) // "March 5, 2026, 10:30 AM"

// Truncate text
truncate('Long text here...', 50)
```

## 📁 File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── students/
│   │   ├── accommodation/
│   │   ├── dining/
│   │   └── analytics/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/              # Base components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Alert.tsx
│   │   └── index.ts
│   └── layout/          # Layout components
│       ├── Sidebar.tsx
│       ├── Navbar.tsx
│       ├── DashboardLayout.tsx
│       └── index.ts
│
├── context/
│   └── AuthContext.tsx
│
├── lib/
│   ├── axios.ts         # API client
│   └── utils.ts         # Helpers
│
└── types/               # TypeScript types
```

## 🎯 Best Practices

### Component Structure

```tsx
'use client';  // For interactive components

import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  prop: type;
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  return (
    // JSX
  );
};

export type { ComponentProps };
```

### Animation Guidelines

```tsx
// Use framer-motion for interactions
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  Click Me
</motion.button>
```

### Loading States

```tsx
// Use Skeleton for loading
{isLoading ? (
  <CardSkeleton showHeader paragraphLines={3} />
) : (
  <Card>{content}</Card>
)}
```

### Error Handling

```tsx
// Use Alert for errors
{error && (
  <Alert variant="error" onClose={() => setError('')}>
    {error}
  </Alert>
)}
```

## 🚀 Development Workflow

### 1. Create New Page

```bash
# Create page folder
mkdir src/app/(dashboard)/my-page
touch src/app/(dashboard)/my-page/page.tsx
```

```tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function MyPage() {
  return (
    <DashboardLayout pageTitle="My Page">
      {/* Content */}
    </DashboardLayout>
  );
}
```

### 2. Add Route to Sidebar

Edit `src/components/layout/Sidebar.tsx`:

```tsx
const navItems: NavItem[] = [
  // ... existing items
  { name: 'My Page', href: '/dashboard/my-page', icon: <FiIcon /> },
];
```

### 3. Create Component

```bash
touch src/components/my-module/MyComponent.tsx
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
2xl: 1536px /* Extra large */
```

### Example

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## ♿ Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast ratios
- Use focus indicators

## 🔒 Security

- Never expose API keys in frontend code
- Use environment variables
- Validate all user inputs
- Handle errors gracefully
- Implement proper auth flow

---

**Quick Start**: Run `npm run dev` to start development server  
**Build**: Run `npm run build` for production build  
**Lint**: Run `npm run lint` to check code quality

**Last Updated**: March 5, 2026

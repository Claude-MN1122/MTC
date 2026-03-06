# MTC Campus Management System - Frontend Development Guide

## 🎨 Design Philosophy

The Mutare Teachers College Campus Management System follows **premium SaaS dashboard** design principles inspired by:

- **Stripe Dashboard** - Clean financial-grade UI
- **Linear** - Smooth interactions & modern aesthetics
- **Notion** - Minimal, content-first design
- **Supabase** - Developer-friendly enterprise UI
- **Vercel Admin** - Elegant simplicity

### Core Design Principles

1. **Modern Minimalism** - Clean, uncluttered interfaces with purposeful whitespace
2. **Professional Elegance** - Premium feel through refined typography and spacing
3. **Visual Hierarchy** - Clear information architecture through size, weight, and color
4. **Smooth Interactions** - Subtle animations that enhance UX without distraction
5. **Responsive Excellence** - Flawless experience across all devices

---

## 🎨 Color Palette (STRICT ENFORCEMENT)

### Primary Colors

```css
/* Backgrounds */
--background: #FFFFFF        /* Pure white - main background */
--surface: #F8FAFC          /* Light gray - card surfaces */
--surface-elevated: #FFFFFF /* White - elevated cards */

/* Brand - Blue */
--primary-50: #EFF6FF
--primary-100: #DBEAFE
--primary-200: #BFDBFE
--primary-300: #93C5FD
--primary-400: #60A5FA
--primary-500: #3B82F6      /* Primary brand color */
--primary-600: #2563EB      /* Hover states */
--primary-700: #1D4ED8      /* Active states */
--primary-800: #1E40AF
--primary-900: #1E3A8A

/* Text */
--text-primary: #0F172A     /* Slate 900 - Main text */
--text-secondary: #475569   /* Slate 600 - Secondary text */
--text-muted: #94A3B8       /* Slate 400 - Muted text */
```

### Accent Colors

```css
/* Gold - Used sparingly for premium accents */
--gold-50: #FFFBEB
--gold-100: #FEF3C7
--gold-200: #FDE68A
--gold-300: #FCD34D
--gold-400: #FBBF24
--gold-500: #F59E0B        /* Primary gold */
--gold-600: #D97706
--gold-700: #B45309

/* Status Colors */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6
```

### Usage Guidelines

**Blue (Primary)**
- Navigation sidebar
- Primary buttons
- Active states
- Links
- Headers and titles

**Gold (Accent)**
- Icons (sparingly)
- Achievement badges
- Premium feature indicators
- Special borders/highlights
- **Use only 10-15% as much as blue**

**White (Background)**
- Main backgrounds
- Card backgrounds
- Modal backgrounds

---

## 📐 Typography

### Font Family

```css
font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

```css
/* Display - Hero sections */
text-display: {
  font-size: 2.5rem;        /* 40px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* H1 - Page titles */
text-h1: {
  font-size: 2rem;          /* 32px */
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

/* H2 - Section headers */
text-h2: {
  font-size: 1.5rem;        /* 24px */
  font-weight: 600;
  line-height: 1.4;
}

/* H3 - Card titles */
text-h3: {
  font-size: 1.25rem;       /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

/* H4 - Subsection titles */
text-h4: {
  font-size: 1.125rem;      /* 18px */
  font-weight: 600;
  line-height: 1.5;
}

/* Body - Main content */
text-body: {
  font-size: 1rem;          /* 16px */
  font-weight: 400;
  line-height: 1.6;
}

/* Small - Secondary info */
text-small: {
  font-size: 0.875rem;      /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* Caption - Labels, hints */
text-caption: {
  font-size: 0.75rem;       /* 12px */
  font-weight: 500;
  line-height: 1.4;
}
```

---

## 🧩 Component Design System

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
              0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid #F1F5F9;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05),
              0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

**Card Variants:**
- **Default** - White background, subtle shadow
- **Elevated** - Stronger shadow, for modals/overlays
- **Interactive** - Hover animation, cursor pointer
- **Bordered** - Visible border for emphasis

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: #FFFFFF;
  color: #3B82F6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #E2E8F0;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #F8FAFC;
  border-color: #3B82F6;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #3B82F6;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: #EFF6FF;
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: #94A3B8;
}
```

### Badges

```css
/* Success Badge */
.badge-success {
  background: #D1FAE5;
  color: #065F46;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Warning Badge */
.badge-warning {
  background: #FEF3C7;
  color: #92400E;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Info Badge */
.badge-info {
  background: #DBEAFE;
  color: #1E40AF;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Gold Badge (Premium) */
.badge-gold {
  background: linear-gradient(135deg, #FDE68A 0%, #FBBF24 100%);
  color: #78350F;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #FCD34D;
}
```

---

## 🎭 Animations & Micro-interactions

### Transition Defaults

```css
.transition-default {
  transition: all 0.2s ease;
}

.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-bounce {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Hover Effects

```css
/* Card Hover Lift */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Button Hover Scale */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Icon Hover Rotate */
.icon-hover-rotate {
  transition: transform 0.2s ease;
}

.icon-hover-rotate:hover {
  transform: rotate(5deg);
}
```

### Loading States

```css
/* Skeleton Loader */
.skeleton {
  background: linear-gradient(
    90deg,
    #F1F5F9 0%,
    #E2E8F0 50%,
    #F1F5F9 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #E2E8F0;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles - Mobile */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }

/* Extra Large */
@media (min-width: 1536px) { }
```

### Layout Adjustments

**Mobile (< 768px)**
- Single column layout
- Full-width cards
- Stacked navigation (hamburger menu)
- Larger touch targets (min 44px)

**Tablet (768px - 1024px)**
- Two column layouts where appropriate
- Sidebar navigation collapsible
- Grid cards (2 columns)

**Desktop (> 1024px)**
- Full multi-column layouts
- Fixed sidebar navigation
- Grid cards (3-4 columns)
- Hover interactions enabled

---

## 🏗️ Layout Components

### Dashboard Layout Structure

```
┌─────────────────────────────────────────┐
│           Top Navbar                     │
│  (Logo, Search, User Profile, Notifs)   │
├─────────┬───────────────────────────────┤
│         │                               │
│  Left   │      Main Content Area        │
│ Sidebar │                               │
│         │   (Page-specific content)     │
│ (Nav)   │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

### Left Sidebar Navigation

- **Width:** 260px (desktop), collapsed 80px (tablet)
- **Background:** White (#FFFFFF)
- **Border:** Right border 1px solid #E2E8F0
- **Active State:** Blue background (#EFF6FF) with blue left border
- **Hover State:** Light gray background (#F8FAFC)

### Top Navbar

- **Height:** 64px
- **Background:** White with blur effect
- **Border:** Bottom border 1px solid #E2E8F0
- **Search Bar:** Centered, 400px max width
- **User Avatar:** Right aligned with dropdown

---

## 📊 Key Pages & Features

### Authentication
- `/login` - Login page with email/password
- `/forgot-password` - Password recovery

### Dashboard
- `/dashboard` - Overview with analytics widgets
- Quick stats cards
- Recent activity feed
- Charts and graphs

### Student Management
- `/dashboard/students` - Student list with filters
- `/dashboard/students/[id]` - Student detail view
- `/dashboard/students/create` - Add new student
- Bulk import functionality
- QR ID card generation

### Accommodation
- `/dashboard/accommodation` - Hostel management
- Room allocation interface
- Application review system
- Occupancy analytics

### Dining
- `/dashboard/dining` - Meal plan management
- `/dashboard/qr-scanner` - QR scanning interface (mobile-optimized)
- Attendance tracking
- Meal statistics

### Analytics
- `/dashboard/analytics` - Comprehensive reports
- Data visualizations
- Export functionality

---

## 🔧 Technical Stack

### Frontend Framework
- **Next.js 15** - App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling
- **TailwindCSS** - Utility-first CSS
- **Custom theme** - MTC brand colors

### State Management
- **React Query** - Server state
- **Context API** - Global UI state

### HTTP Client
- **Axios** - API requests

### Charts
- **Recharts** - Data visualization

### Animations
- **Framer Motion** - Complex animations
- **CSS transitions** - Simple interactions

### Icons
- **React Icons** - Icon library

---

## 📁 Project Structure

```
mtc-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth pages
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/          # Dashboard pages
│   │   │   ├── students/
│   │   │   ├── accommodation/
│   │   │   ├── dining/
│   │   │   ├── analytics/
│   │   │   ├── qr-scanner/
│   │   │   └── id-cards/
│   │   ├── api/                  # API routes
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── dashboard/            # Dashboard widgets
│   │   ├── students/             # Student module
│   │   ├── accommodation/        # Accommodation module
│   │   ├── dining/               # Dining module
│   │   ├── analytics/            # Analytics module
│   │   ├── qr-codes/             # QR components
│   │   ├── forms/                # Form components
│   │   ├── tables/               # Table components
│   │   ├── modals/               # Modal components
│   │   └── charts/               # Chart components
│   │
│   ├── lib/                      # Utilities & configs
│   │   ├── axios.ts              # Axios config
│   │   └── utils.ts              # Helper functions
│   │
│   ├── hooks/                    # Custom React hooks
│   │
│   ├── types/                    # TypeScript types
│   │
│   ├── utils/                    # Utility functions
│   │
│   └── context/                  # React Context
│
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Development Workflow

### Phase 1: Setup & Foundation
1. ✅ Initialize Next.js project
2. ✅ Install dependencies
3. ✅ Create folder structure
4. ⏳ Configure Tailwind theme
5. ⏳ Create base UI components

### Phase 2: Layout & Navigation
1. ⏳ Build Sidebar component
2. ⏳ Build Navbar component
3. ⏳ Build DashboardLayout
4. ⏳ Create auth pages

### Phase 3: Core Features
1. ⏳ Student management module
2. ⏳ QR code generation
3. ⏳ Accommodation management
4. ⏳ Dining management

### Phase 4: Advanced Features
1. ⏳ QR scanner interface
2. ⏳ Analytics dashboard
3. ⏳ Reports & exports

### Phase 5: Polish & Optimization
1. ⏳ Responsive refinements
2. ⏳ Performance optimization
3. ⏳ Accessibility improvements
4. ⏳ Final QA testing

---

## 🎯 Success Criteria

### Visual Design
- [ ] Consistent spacing and alignment
- [ ] Professional color usage
- [ ] Elegant typography hierarchy
- [ ] Smooth, purposeful animations
- [ ] Premium feel throughout

### User Experience
- [ ] Intuitive navigation
- [ ] Fast page loads (< 2s)
- [ ] Responsive on all devices
- [ ] Accessible (WCAG AA)
- [ ] Clear error states

### Code Quality
- [ ] TypeScript strict mode
- [ ] Component reusability
- [ ] Proper error handling
- [ ] Optimized renders
- [ ] Clean, documented code

---

## 📝 Notes

- Always use semantic HTML
- Implement proper loading states
- Handle errors gracefully
- Optimize images and assets
- Use React.memo where beneficial
- Implement proper SEO meta tags
- Ensure mobile-first responsive design
- Test on multiple browsers

---

**Last Updated:** March 5, 2026  
**Version:** 1.0.0  
**Status:** In Development

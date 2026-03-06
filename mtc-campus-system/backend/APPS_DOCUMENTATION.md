# Django Apps Documentation - MTC Campus Management System

## 📱 Overview

This document describes all six Django applications created for the Mutare Teachers College Campus Management System.

---

## 🏗️ App Structure

All apps are located in the `apps/` directory and follow Django best practices:

```
apps/
├── users/              # User management & authentication
├── students/           # Student identity cards
├── accommodation/      # Residence allocation
├── dining/             # Dining hall meal tracking
├── analytics/          # Reports & dashboards
└── audit/              # Audit logging & compliance
```

---

## 1. 👥 **Users App** (`apps.users`)

### Purpose
Manages user accounts, authentication, roles, and permissions across the campus management system.

### Key Features
- Custom user model with role-based access control
- User profiles for students, staff, and administrators
- Authentication and authorization
- Password management and reset
- User activity tracking

### Models (Planned)
- `CustomUser` - Extended Django user model
- `UserProfile` - Additional user information
- `Role` - User roles (Student, Staff, Admin, etc.)
- `Department` - Academic/administrative departments

### API Endpoints (To be implemented)
```
POST   /api/auth/register/          - User registration
POST   /api/auth/login/             - User login
POST   /api/auth/logout/            - User logout
POST   /api/auth/refresh/           - Refresh JWT token
GET    /api/users/profile/          - Get user profile
PUT    /api/users/profile/          - Update profile
POST   /api/users/change-password/  - Change password
```

### Use Cases
- Student account creation
- Staff login/authentication
- Role-based dashboard access
- Profile management

---

## 2. 🎓 **Students App** (`apps.students`)

### Purpose
Manages student identity cards, personal information, and academic records.

### Key Features
- Student registration and profiles
- ID card application processing
- QR code generation for ID cards
- Photo upload and verification
- ID card status tracking
- Replacement requests

### Models (Planned)
- `Student` - Student profile (extends User)
- `IDCardApplication` - ID card request
- `IDCard` - Physical/digital ID card
- `PhotoUpload` - Student photos
- `ReplacementRequest` - Lost/damaged card requests

### API Endpoints (To be implemented)
```
POST   /api/students/                 - Register student
GET    /api/students/<id>/            - Get student details
POST   /api/students/<id>/id-card/    - Apply for ID card
GET    /api/students/id-cards/        - List ID cards
POST   /api/students/photos/upload/   - Upload photo
GET    /api/students/id-card/qr/      - Generate QR code
```

### Use Cases
- New student registration
- ID card application submission
- Photo upload for ID cards
- QR code generation
- Card printing tracking
- Lost card replacement

---

## 3. 🏠 **Accommodation App** (`apps.accommodation`)

### Purpose
Manages student residence applications, room allocations, and housing management.

### Key Features
- Residence/hall application processing
- Room preferences and assignments
- Allocation algorithm
- Waiting list management
- Roommate matching
- Check-in/check-out processing

### Models (Planned)
- `Residence` - Student residence halls
- `Room` - Individual rooms
- `AccommodationApplication` - Housing application
- `Allocation` - Room assignment
- `Preference` - Room preferences
- `Inspection` - Room inspection records

### API Endpoints (To be implemented)
```
POST   /api/accommodation/apply/         - Submit application
GET    /api/accommodation/applications/  - List applications
GET    /api/accommodation/residences/    - List residences
POST   /api/accommodation/allocate/      - Allocate room
GET    /api/accommodation/status/        - Check application status
PUT    /api/accommodation/preferences/   - Update preferences
```

### Use Cases
- Student submits residence application
- System allocates rooms based on preferences
- Waiting list management
- Room change requests
- Check-in/check-out processing

---

## 4. 🍽️ **Dining App** (`apps.dining`)

### Purpose
Manages dining hall meal plans, daily meal tracking, and dietary requirements.

### Key Features
- Meal plan enrollment
- Daily meal check-in/out
- QR code scanning for meals
- Dietary restrictions management
- Meal statistics and reporting
- Special meal requests

### Models (Planned)
- `MealPlan` - Student meal plan
- `MealSession` - Daily meal sessions
- `MealCheckIn` - Student meal attendance
- `DietaryRequirement` - Dietary restrictions
- `SpecialMealRequest` - Special dietary needs

### API Endpoints (To be implemented)
```
POST   /api/dining/plans/enroll/        - Enroll in meal plan
GET    /api/dining/plans/               - Available meal plans
POST   /api/dining/check-in/            - Check in for meal
GET    /api/dining/history/             - Meal history
POST   /api/dining/dietary-requirements/- Add dietary restriction
GET    /api/dining/today/               - Today's meals
```

### Use Cases
- Student enrolls in meal plan
- Daily meal check-in using QR code
- Tracking meal consumption
- Managing dietary restrictions
- Generating meal statistics

---

## 5. 📊 **Analytics App** (`apps.analytics`)

### Purpose
Provides data analytics, reports, and dashboards for all campus management modules.

### Key Features
- Dashboard visualizations
- Statistical reports
- Data exports (CSV, PDF, Excel)
- Trend analysis
- Performance metrics
- Custom report generation

### Models (Planned)
- `Dashboard` - Dashboard configurations
- `Report` - Saved reports
- `Metric` - KPI definitions
- `DataExport` - Export job tracking
- `Chart` - Chart configurations

### API Endpoints (To be implemented)
```
GET    /api/analytics/dashboard/        - Dashboard data
GET    /api/analytics/reports/          - Available reports
GET    /api/analytics/students/stats/   - Student statistics
GET    /api/analytics/accommodation/    - Accommodation stats
GET    /api/analytics/dining/stats/     - Dining statistics
POST   /api/analytics/export/           - Export data
```

### Use Cases
- Administrator views campus-wide dashboard
- Generate monthly reports
- Export student data for analysis
- Track accommodation occupancy rates
- Monitor dining hall usage

---

## 6. 🔍 **Audit App** (`apps.audit`)

### Purpose
Maintains comprehensive audit logs of all system activities for compliance and security.

### Key Features
- Activity logging
- Change tracking
- User action monitoring
- Security event logging
- Compliance reporting
- Audit trail queries

### Models (Planned)
- `AuditLog` - Main audit log entries
- `ChangeLog` - Model change tracking
- `SecurityEvent` - Security-related events
- `AccessLog` - Login/access attempts
- `ComplianceReport` - Compliance documentation

### API Endpoints (To be implemented)
```
GET    /api/audit/logs/                 - Query audit logs
GET    /api/audit/user/<id>/            - User activity log
GET    /api/audit/model/<name>/         - Model changes
POST   /api/audit/export/               - Export audit data
GET    /api/audit/security-events/      - Security events
GET    /api/audit/compliance/           - Compliance reports
```

### Use Cases
- Track who changed student records
- Monitor failed login attempts
- Generate compliance reports
- Investigate security incidents
- Maintain regulatory compliance

---

## 🔗 App Relationships

```
users (base)
  ├── students (extends users)
  ├── accommodation (uses users)
  ├── dining (uses users)
  ├── analytics (aggregates from all)
  └── audit (logs all activities)
```

### Dependencies
- **users**: Base app for authentication
- **students**: Depends on users
- **accommodation**: Depends on users
- **dining**: Depends on users
- **analytics**: Aggregates data from all apps
- **audit**: Logs activities from all apps

---

## 📋 Common Commands

### Create migrations for all apps
```bash
python manage.py makemigrations apps.users apps.students apps.accommodation apps.dining apps.analytics apps.audit
```

### Apply migrations
```bash
python manage.py migrate
```

### Run tests for specific app
```bash
python manage.py test apps.users
python manage.py test apps.students
# ... etc
```

### Create superuser
```bash
python manage.py createsuperuser
```

---

## 🎯 Development Priority

### Phase 1: Core Foundation
1. ✅ **users** - Authentication and user management
2. ✅ **students** - Student profiles and ID cards

### Phase 2: Essential Services
3. ✅ **accommodation** - Residence management
4. ✅ **dining** - Meal tracking

### Phase 3: Monitoring & Reporting
5. ✅ **analytics** - Dashboards and reports
6. ✅ **audit** - Audit logging

---

## 📝 Next Steps for Each App

### Users App
- [ ] Create custom user model
- [ ] Implement JWT authentication
- [ ] Add user profile endpoints
- [ ] Set up role-based permissions

### Students App
- [ ] Create Student model
- [ ] Build ID card application workflow
- [ ] Implement QR code generation
- [ ] Add photo upload functionality

### Accommodation App
- [ ] Define residence and room models
- [ ] Create application form
- [ ] Implement allocation algorithm
- [ ] Build waiting list management

### Dining App
- [ ] Create meal plan models
- [ ] Implement check-in system
- [ ] Add QR code scanning
- [ ] Build dietary requirements tracker

### Analytics App
- [ ] Design dashboard schema
- [ ] Create report generators
- [ ] Implement data aggregation
- [ ] Build export functionality

### Audit App
- [ ] Create audit log models
- [ ] Implement signal handlers for auto-logging
- [ ] Build query interface
- [ ] Create compliance reports

---

## 🏛️ MTC Business Rules

### Student ID Cards
- All registered students must apply for ID cards
- ID cards include QR codes for verification
- Photos must meet specific requirements
- Replacement requires fee payment

### Accommodation
- First-year students get priority
- Allocation based on preferences and availability
- Waiting list maintained for overflow
- Room inspections before/after occupancy

### Dining
- Meal plans tied to academic year
- Daily meal tracking via QR codes
- Dietary restrictions require medical documentation
- Meal statistics reported monthly

---

## 📞 Support

For questions about app development, refer to:
- Django Documentation: https://docs.djangoproject.com/
- DRF Documentation: https://www.django-rest-framework.org/
- Project README files

---

**Version:** 1.0.0  
**Last Updated:** March 2026  
**Institution:** Mutare Teachers College, Zimbabwe

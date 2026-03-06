# 🏫 MTC Campus Management System

## Mutare Teachers College - Comprehensive Digital Management Platform

A full-stack web application for managing campus operations at Mutare Teachers College, Zimbabwe.

---

## 📋 Project Overview

The MTC Campus Management System is a role-based platform designed to digitize and streamline:

- ✅ **Student Identity Management** with QR codes
- ✅ **Accommodation Applications** and room allocation
- ✅ **Dining Hall Services** and meal tracking
- ✅ **Analytics Dashboard** for data-driven decisions
- ✅ **Audit Trail** for compliance and transparency

---

## 🎯 Current Status: STAGE 2 COMPLETE ✓

### Completed Features:

#### Stage 1: Project Setup & Authentication ✓
- [x] Django backend with PostgreSQL database
- [x] JWT-based authentication system
- [x] 7-role permission system (Super Admin to Student)
- [x] Email-based registration/login
- [x] API documentation (Swagger/OpenAPI)

#### Stage 2: Student Identity & QR Code System ✓
- [x] Student model with comprehensive fields
- [x] Automatic QR code generation
- [x] Photo upload for ID cards
- [x] CRUD operations via REST API
- [x] QR code download and regeneration
- [x] Admin panel for student management
- [x] Automated testing suite

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- PostgreSQL 18+
- PowerShell (Windows)

### Installation

1. **Clone or navigate to project:**
   ```powershell
   cd mtc-campus-system/backend
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```powershell
   # Copy example env file
   copy .env.example .env
   
   # Edit .env with your PostgreSQL credentials
   # Default: POSTGRES_PASSWORD=feedora
   ```

5. **Setup database:**
   ```powershell
   .\setup-database.ps1
   ```

6. **Apply migrations:**
   ```powershell
   python manage.py migrate
   ```

7. **Run development server:**
   ```powershell
   python manage.py runserver
   ```

8. **Access the application:**
   - API: http://localhost:8000/api/
   - Swagger Docs: http://localhost:8000/swagger/
   - Admin Panel: http://localhost:8000/admin/

---

## 📁 Project Structure

```
mtc-campus-system/
├── backend/                    # Django backend application
│   ├── apps/                   # Django apps organized by function
│   │   ├── users/              # User management & authentication
│   │   ├── students/           # Student identity & QR codes
│   │   ├── accommodation/      # Hostel & room management (TODO)
│   │   ├── dining/             # Dining hall services (TODO)
│   │   ├── analytics/          # Reports & dashboards (TODO)
│   │   └── audit/              # Audit logging (TODO)
│   ├── config/                 # Django project configuration
│   │   ├── settings.py         # Main settings
│   │   ├── urls.py             # URL routing
│   │   ├── celery.py           # Celery configuration
│   │   └── wsgi.py             # WSGI entry point
│   ├── media/                  # User-uploaded files
│   │   ├── qr_codes/           # Generated QR codes
│   │   └── student_photos/     # ID card photos
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── frontend/                   # React/Next.js frontend (TODO)
├── docker/                     # Docker configurations (TODO)
├── nginx/                      # Nginx configuration (TODO)
├── docs/                       # Documentation
└── scripts/                    # Utility scripts
```

---

## 🔐 Authentication System

### User Roles

1. **Super Admin** - Full system access
2. **System Administrator** - Technical administration
3. **Accommodation Officer** - Manage hostel allocations
4. **Dining Manager** - Oversee dining services
5. **Hostel Supervisor** - Supervise accommodation
6. **Security Officer** - Security & access control
7. **Student** - Limited self-service access

### Auth Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `GET /api/auth/me/` - Get current user profile
- `POST /api/auth/logout/` - Logout (blacklist token)

---

## 🧑‍🎓 Student Identity System

### Features

- **Automatic QR Generation** - QR codes created on student registration
- **Photo Upload** - Passport-style photos for ID cards
- **Smart Filtering** - Filter by department, year, gender, etc.
- **Search** - Search by student number, name, or national ID
- **Bulk Operations** - Register/unregister, activate/deactivate multiple students

### QR Code Specifications

**Data Encoded:**
```
MTC|{student_number}|{full_name}|{department}
```

**Example:**
```
MTC|STU2024001|John Doe|EDUCATION
```

**Storage:**
- Location: `media/qr_codes/`
- Format: PNG
- Filename: `qr_{student_number}.png`
- Error Correction: High (ERROR_CORRECT_H)

### API Endpoints

Base URL: `http://localhost:8000/api/students/`

#### Create Student
```bash
POST /api/students/
Content-Type: application/json

{
    "student_number": "STU2024001",
    "full_name": "John Doe",
    "national_id": "67-123456X78",
    "department": "EDUCATION",
    "year_of_study": 1,
    "gender": "MALE"
}
```

#### Upload Photo
```bash
POST /api/students/{id}/upload_photo/
Content-Type: multipart/form-data

photo: <image_file>
```

#### Get QR Code
```bash
GET /api/students/{id}/qr_code/
```

#### Download QR Image
```bash
GET /api/students/{id}/download_qr_code/
```

---

## 🧪 Testing

### Run Unit Tests (QR Code Generation)
```powershell
python test-qr-code.py
```

### Run API Tests (PowerShell)
```powershell
.\test-student-api.ps1
```

### Expected Test Output
```
============================================================
Testing Student QR Code Generation
============================================================
✓ Cleaned up existing test data
✓ Created student: TEST2024001 - John Doe Test
✓ QR code generated successfully!
  File size: 1015 bytes
✓ QR code file exists on disk
============================================================
QR Code Generation Test Complete!
============================================================
```

---

## 📚 Documentation

### Available Documentation Files

1. **QUICKSTART.md** - Quick setup guide
2. **SETUP_COMPLETE.md** - Detailed setup instructions
3. **AUTHENTICATION_COMPLETE.md** - Auth system documentation
4. **STUDENT_QR_SYSTEM_COMPLETE.md** - Student system detailed guide
5. **STAGE_2_SUMMARY.md** - Stage 2 implementation summary

### API Documentation

Interactive API documentation available at:
- **Swagger UI:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

---

## 🛠 Technology Stack

### Backend
- **Framework:** Django 5.0.6
- **API:** Django REST Framework
- **Database:** PostgreSQL 18
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Task Queue:** Celery + Redis
- **QR Codes:** qrcode + Pillow

### Frontend (Planned)
- **Framework:** React with Next.js
- **UI Library:** Tailwind CSS / Material UI
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios

### DevOps (Planned)
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx
- **CI/CD:** GitHub Actions

---

## 📊 Database Schema

### Users App
- CustomUser (email-based auth)
- Role-based permissions

### Students App
- Student (with QR code generation)
- Automatic photo and QR storage

### Future Apps
- Accommodation (hostels, rooms, allocations)
- Dining (meal plans, attendance tracking)
- Analytics (reports, dashboards)
- Audit (activity logs)

---

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- CORS configuration
- Password hashing (Django built-in)
- SQL injection protection (Django ORM)
- XSS protection (Django templates)

---

## 📝 Environment Variables

Required environment variables in `.env`:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database
POSTGRES_NAME=mtc_campus_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=feedora
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Celery & Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=./media
```

---

## 👥 Contributing

This is a private project for Mutare Teachers College. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - Mutare Teachers College © 2026

---

## 🎓 About Mutare Teachers College

Mutare Teachers College (MTC) is a premier teacher training institution in Zimbabwe, committed to producing highly qualified educators for the nation's schools.

---

## 📞 Support

For technical support:
- Email: admin@mtc.ac.zw
- Documentation: http://localhost:8000/swagger/

---

**Last Updated:** March 5, 2026  
**Version:** 2.0.0 (Stage 2 Complete)  
**Status:** Active Development

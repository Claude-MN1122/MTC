# 🧑‍🎓 Student Identity & QR Code System - Complete Guide

## Overview

The Student Identity & QR Code System is now fully implemented and tested. This system provides:

- ✅ **Student Model** with all required fields
- ✅ **Automatic QR Code Generation** when students are registered
- ✅ **QR Code Storage** in the media folder
- ✅ **API Endpoints** for CRUD operations and QR code management
- ✅ **Admin Panel** for managing students
- ✅ **Photo Upload** capability for ID cards

---

## Implementation Summary

### Step 1: Student Model (✅ Complete)

**Location:** `apps/students/models.py`

**Fields Implemented:**
- `student_number` - Unique student identification number
- `full_name` - Student's full name
- `national_id` - National ID number
- `department` - Academic department (6 choices)
- `year_of_study` - Current year of study (5 choices)
- `gender` - Gender (3 choices)
- `photo` - Passport-style photograph
- `qr_code` - Auto-generated QR code
- `created_at` - Timestamp (auto-generated)

**Additional Fields:**
- `date_of_birth`, `email`, `phone_number`, `address`
- `next_of_kin_name`, `next_of_kin_phone`, `next_of_kin_relationship`
- `is_active`, `is_registered`
- `updated_at`

### Step 2: QR Code Generation (✅ Complete)

**Libraries Used:**
- `qrcode` - For generating QR codes
- `Pillow` - For image processing

**QR Code Features:**
- Automatically generated when student is created
- Regenerates when student number changes
- Old QR codes are automatically deleted
- High error correction (ERROR_CORRECT_H) for durability
- Stored as PNG in `media/qr_codes/` directory
- Filename format: `qr_{slugified_student_number}.png`

**QR Code Data Encoded:**
```
MTC|{student_number}|{full_name}|{department}
```

Example: `MTC|STU2024001|John Doe|EDUCATION`

---

## File Structure

```
backend/
├── apps/
│   └── students/
│       ├── models.py          # Student model with QR generation
│       ├── serializers.py     # 5 serializers for different operations
│       ├── views.py           # StudentViewSet with CRUD + custom actions
│       ├── urls.py            # URL routing
│       ├── admin.py           # Admin panel configuration
│       └── migrations/
│           └── 0001_initial.py
├── config/
│   ├── settings.py            # Django settings
│   └── urls.py                # Main URL configuration
├── media/                     # Media files (auto-created)
│   ├── qr_codes/              # Generated QR codes
│   └── student_photos/        # Uploaded photos
├── test-qr-code.py            # QR code generation test script
└── manage.py
```

---

## API Endpoints

### Base URL: `http://localhost:8000/api/students/`

#### 1. **Create Student** (POST)
```http
POST /api/students/
Content-Type: application/json

{
    "student_number": "STU2024001",
    "full_name": "John Doe",
    "national_id": "67-123456X78",
    "department": "EDUCATION",
    "year_of_study": 1,
    "gender": "MALE",
    "email": "john.doe@example.com",
    "phone_number": "+263771234567"
}
```

**Response:**
```json
{
    "message": "Student registered successfully. QR code generated.",
    "student": {
        "id": 1,
        "student_number": "STU2024001",
        "full_name": "John Doe",
        "department": "EDUCATION",
        "qr_code_url": "http://localhost:8000/media/qr_codes/qr_stu2024001.png",
        "has_qr_code": true,
        "id_card_ready": false
    }
}
```

#### 2. **List Students** (GET)
```http
GET /api/students/
```

**Query Parameters:**
- `page` - Page number for pagination
- `department` - Filter by department
- `year_of_study` - Filter by year
- `gender` - Filter by gender
- `is_active` - Filter by active status
- `is_registered` - Filter by registration status
- `search` - Search by student_number, full_name, or national_id
- `ordering` - Order by field (e.g., `student_number`, `-created_at`)

#### 3. **Get Student Details** (GET)
```http
GET /api/students/{id}/
```

#### 4. **Update Student** (PUT/PATCH)
```http
PUT /api/students/{id}/
Content-Type: application/json

{
    "full_name": "Jane Doe",
    "department": "SCIENCES"
}
```

#### 5. **Upload Photo** (POST)
```http
POST /api/students/{id}/upload_photo/
Content-Type: multipart/form-data

photo: <image_file>
```

**Response:**
```json
{
    "message": "Photo uploaded successfully",
    "photo_url": "http://localhost:8000/media/student_photos/photo.jpg",
    "id_card_ready": true
}
```

#### 6. **Get QR Code Info** (GET)
```http
GET /api/students/{id}/qr_code/
```

**Response:**
```json
{
    "student_number": "STU2024001",
    "full_name": "John Doe",
    "department": "EDUCATION",
    "qr_code_url": "http://localhost:8000/media/qr_codes/qr_stu2024001.png",
    "qr_data": {
        "student_number": "STU2024001",
        "full_name": "John Doe",
        "department": "Education",
        "institution": "Mutare Teachers College"
    }
}
```

#### 7. **Download QR Code** (GET)
```http
GET /api/students/{id}/download_qr_code/
```

Returns the QR code image file as a download.

#### 8. **Regenerate QR Code** (POST)
```http
POST /api/students/{id}/regenerate_qr_code/
```

Manually regenerate the QR code (useful if corrupted).

---

## Testing

### Automated Test Script

Run the test script to verify QR code generation:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python test-qr-code.py
```

**Expected Output:**
```
============================================================
Testing Student QR Code Generation
============================================================
✓ Cleaned up existing test data

Creating test student...
✓ Created student: TEST2024001 - John Doe Test

Checking QR code generation...
✓ QR code generated successfully!
  File path: C:\...\media\qr_codes\qr_test2024001.png
  File size: 1015 bytes
✓ QR code file exists on disk

============================================================
QR Code Generation Test Complete!
============================================================
```

### Manual Testing via API

1. **Start the server:**
   ```powershell
   python manage.py runserver
   ```

2. **Access Swagger UI:**
   Navigate to: http://localhost:8000/swagger/

3. **Test endpoints interactively**

---

## Admin Panel

Access the admin panel at: http://localhost:8000/admin/

**Features:**
- List view with filters (department, year, gender, etc.)
- Search by student number, name, or national ID
- Bulk actions (register/unregister, activate/deactivate)
- QR code preview
- Photo upload interface

---

## QR Code Technical Details

### Generation Process

1. Student record is saved
2. Model's `save()` method detects new record or student number change
3. Calls `generate_qr_code()` method
4. Creates QR code with high error correction
5. Saves QR code to `media/qr_codes/` directory
6. Updates student record with QR code file path

### QR Code Content Format

```python
qr_string = f"MTC|{self.student_number}|{self.full_name}|{self.department}"
```

This format allows:
- Easy parsing (pipe-delimited)
- Institution identification (MTC prefix)
- Complete student information in one scan
- Offline verification capability

### File Naming Convention

```
qr_{slugified_student_number}_{random_suffix}.png
```

Example: `qr_stu2024001_G5ljFEi.png`

The random suffix prevents filename conflicts when regenerating QR codes.

---

## Next Steps

To complete the full Campus Management System, continue with:

### Stage 3: Accommodation Management
- Create Accommodation model (hostels, rooms)
- Implement room allocation system
- Track accommodation applications

### Stage 4: Dining Hall Management
- Create Meal Plan model
- Implement meal tracking system
- QR code scanning for meal verification

### Stage 5: Analytics Dashboard
- Student statistics
- Accommodation occupancy rates
- Dining hall usage metrics

### Stage 6: Frontend Development
- React/Next.js application
- User dashboards per role
- Mobile-responsive design

---

## Support

For issues or questions:
- Check Swagger docs: http://localhost:8000/swagger/
- Review test script: `test-qr-code.py`
- Check Django logs for errors

---

**Status:** ✅ STAGE 2 COMPLETE - Student Identity & QR Code System fully functional!

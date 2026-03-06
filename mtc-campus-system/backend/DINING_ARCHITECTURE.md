# 🏗️ Dining System Architecture & Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    MTC DINING MANAGEMENT SYSTEM                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Student    │      │   Scanner    │      │   Backend    │
│   ID Card    │      │   Device     │      │   Server     │
│              │      │              │      │              │
│  ┌────────┐  │      │  ┌────────┐  │      │  ┌────────┐  │
│  │   QR   │──┼─────▶│  │   QR   │──┼─────▶│  │   API  │  │
│  │  Code  │  │      │  │ Reader │  │      │  │Endpoint│  │
│  └────────┘  │      │  └────────┘  │      │  └────────┘  │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
                              │                     │
                              │                     ▼
                              │           ┌──────────────────┐
                              │           │  Authentication  │
                              │           │  & Validation    │
                              │           └──────────────────┘
                              │                     │
                              │                     ▼
                              │           ┌──────────────────┐
                              │           │  Extract Student │
                              │           │  from QR Data    │
                              │           └──────────────────┘
                              │                     │
                              │                     ▼
                              │           ┌──────────────────┐
                              │           │  Check Accommo-  │
                              │           │  dation Status   │
                              │           └──────────────────┘
                              │                     │
                              │          ┌─────────┴─────────┐
                              │          │                   │
                              │          ▼                   ▼
                              │   ┌──────────┐       ┌──────────┐
                              │   │ APPROVED │       │ PENDING/ │
                              │   │   ✅     │       │ REJECTED │
                              │   └──────────┘       └──────────┘
                              │          │                   │
                              │          │                   ▼
                              │          │          ┌──────────────┐
                              │          │          │ Return Error │
                              │          │          │ Not Eligible │
                              │          │          └──────────────┘
                              │          ▼
                              │   ┌──────────────────┐
                              │   │ Check Today's    │
                              │   │ Meal Scans       │
                              │   └──────────────────┘
                              │          │
                              │   ┌──────┴──────┐
                              │   │             │
                              │   ▼             ▼
                              │ ┌─────┐     ┌──────────┐
                              │ │ YES │     │   NO     │
                              │ │ ❌  │     │   ✅     │
                              │ └─────┘     └──────────┘
                              │   │             │
                              │   │             ▼
                              │   │    ┌──────────────────┐
                              │   │    │ Record Attendance│
                              │   │    │ in Database      │
                              │   │    └──────────────────┘
                              │   │             │
                              │   ▼             ▼
                              │   └──────┬──────┘
                              │          │
                              │          ▼
                              │   ┌──────────────────┐
                              │   │  Return Response │
                              │   │  Success/Error   │
                              │   └──────────────────┘
                              │          │
                              └──────────┼──────────┘
                                         ▼
                              ┌─────────────────────┐
                              │   Dashboard Update  │
                              │   Statistics Refresh│
                              └─────────────────────┘
```

---

## Data Flow Sequence

### 1. QR Code Scan Flow

```
Student presents ID card
         │
         ▼
Scanner reads QR code
         │
         ▼
Device sends POST to /api/dining/scan/
         │
         ▼
Request: {qr_data, meal_type, scanner_device}
         │
         ▼
Server validates request
         │
         ├─▶ Invalid format? ──▶ Return 400 Error
         │
         ├─▶ Student not found? ──▶ Return 404 Error
         │
         ├─▶ No accommodation? ──▶ Return 403 Error
         │
         ├─▶ Already scanned? ──▶ Return 400 Error
         │
         └─▶ All valid? ──▶ Record attendance
                                     │
                                     ▼
                              Return 201 Success
                                     │
                                     ▼
                              Display confirmation
```

---

## Database Relationships

```
┌─────────────────┐
│    Student      │
│                 │
│ - student_number│◄────┐
│ - full_name     │     │
│ - department    │     │
└─────────────────┘     │
        │               │
        │               │ ForeignKey
        │               │
        ▼               │
┌─────────────────┐     │
│DiningAttendance │     │
│                 │     │
│ - student_id ───┼─────┘
│ - meal_type     │
│ - date          │
│ - timestamp     │
│ - scanner_device│
└─────────────────┘
         │
         │ Unique Constraint
         │ (student_id, meal_type, date)
         ▼
    Prevents Duplicates
```

---

## State Machine: Meal Eligibility

```
         ┌─────────────┐
         │   START     │
         └─────────────┘
                │
                ▼
         ┌─────────────┐
         │ Has Student │
         │ Accommodation?
         └─────────────┘
                │
        ┌───────┴───────┐
        │               │
       NO              YES
        │               │
        ▼               ▼
   ┌─────────┐    ┌─────────────┐
   │ NOT     │    │ Scan for    │
   │ ELIGIBLE│    │ Meal Type   │
   └─────────┘    └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Already     │
                  │ Scanned?    │
                  └─────────────┘
                         │
                ┌────────┴────────┐
                │                 │
               YES               NO
                │                 │
                ▼                 ▼
         ┌──────────┐      ┌──────────┐
         │ REJECT   │      │ RECORD   │
         │ DUPLICATE│      │ ATTENDANCE
         └──────────┘      └──────────┘
                                 │
                                 ▼
                          ┌──────────┐
                          │ SUCCESS  │
                          └──────────┘
```

---

## API Request/Response Flow

### Success Scenario

```
Client                          Server                          Database
  │                               │                                │
  │  POST /api/dining/scan/       │                                │
  │  {QR data, meal type}         │                                │
  │──────────────────────────────▶│                                │
  │                               │  Validate Request              │
  │                               │───────────────────────────────▶│
  │                               │  Extract Student               │
  │                               │───────────────────────────────▶│
  │                               │  Check Accommodation           │
  │                               │───────────────────────────────▶│
  │                               │  Check Duplicate               │
  │                               │───────────────────────────────▶│
  │                               │  Record Attendance             │
  │                               │───────────────────────────────▶│
  │  201 Created                  │                                │
  │  {success, student,           │                                │
  │   attendance_id}              │                                │
  │◀──────────────────────────────│                                │
  │                               │                                │
```

### Error Scenario (Duplicate)

```
Client                          Server                          Database
  │                               │                                │
  │  POST /api/dining/scan/       │                                │
  │  {QR data, meal type}         │                                │
  │──────────────────────────────▶│                                │
  │                               │  Validate Request              │
  │                               │───────────────────────────────▶│
  │                               │  Check Duplicate               │
  │                               │───────────────────────────────▶│
  │                               │  EXISTS = TRUE                 │
  │                               │◀───────────────────────────────│
  │  400 Bad Request              │                                │
  │  {success: false,             │                                │
  │   message: "Already scanned"} │                                │
  │◀──────────────────────────────│                                │
  │                               │                                │
```

---

## Dashboard Data Aggregation

```
┌──────────────────────────────────────────────────────────────┐
│                      Dashboard Query Flow                     │
└──────────────────────────────────────────────────────────────┘

Query 1: Total Eligible Students
    │
    ├─▶ SELECT COUNT(DISTINCT student)
    │   FROM accommodation_applications
    │   WHERE status = 'APPROVED'
    │
    └─▶ Result: total_eligible_students

Query 2: Students Ate Today
    │
    ├─▶ SELECT COUNT(DISTINCT student)
    │   FROM dining_attendances
    │   WHERE date = TODAY
    │
    └─▶ Result: students_ate_today

Query 3: Meal Breakdown
    │
    ├─▶ SELECT meal_type, COUNT(*)
    │   FROM dining_attendances
    │   WHERE date = TODAY
    │   GROUP BY meal_type
    │
    └─▶ Result: {breakfast: N, lunch: N, dinner: N}

Query 4: Recent Activity
    │
    ├─▶ SELECT * FROM dining_attendances
    │   WHERE date = TODAY
    │   ORDER BY timestamp DESC
    │   LIMIT 10
    │
    └─▶ Result: recent_attendances[]

All Results Combined → Dashboard Response JSON
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│          Security Architecture          │
└─────────────────────────────────────────┘

Layer 1: Authentication
    │
    ├─▶ JWT Token Required
    ├─▶ Token Validation
    └─▶ User Identity Verified

Layer 2: Authorization
    │
    ├─▶ IsAuthenticated Permission
    ├─▶ Staff/Admin Access Only
    └─▶ Role-based Access Control

Layer 3: Input Validation
    │
    ├─▶ QR Data Format Check
    ├─▶ Meal Type Validation
    ├─▶ Student Existence Check
    └─▶ Data Sanitization

Layer 4: Business Logic
    │
    ├─✅ Accommodation Verification
    ├─✅ Duplicate Prevention
    ├─✅ Eligibility Checking
    └─✅ Data Integrity Constraints

Layer 5: Audit Trail
    │
    ├─▶ Scanner Device Logged
    ├─▶ Timestamp Recorded
    ├─✅ User Action Tracked
    └─▶ Immutable Records
```

---

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│              MTC Campus Ecosystem                        │
└─────────────────────────────────────────────────────────┘

┌─────────────┐
│   Student   │
│   System    │
│             │
│ ┌─────────┐ │
│ │Student  │ │
│ │ Model   │ │
│ └─────────┘ │
└──────┬──────┘
       │ Provides student data
       │ and QR codes
       │
       ▼
┌─────────────────────────────┐
│    DINING MANAGEMENT        │
│         SYSTEM              │
│                             │
│ ┌─────────┐  ┌───────────┐ │
│ │Dining   │  │Eligibility│ │
│ │Attendance│ │Checking   │ │
│ └─────────┘  └───────────┘ │
└──────────────┬──────────────┘
               │ Checks accommodation
               │ status
               │
               ▼
       ┌───────────────┐
       │ Accommodation │
       │    System     │
       │               │
       │ ┌───────────┐ │
       │ │Application│ │
       │ │  Model    │ │
       │ └───────────┘ │
       └───────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 Production Deployment                     │
└──────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐
│ Scanner │    │ Scanner │    │ Scanner │
│ Device 1│    │ Device 2│    │ Device N│
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
                    │ HTTPS
                    │
                    ▼
          ┌─────────────────┐
          │   Load Balancer │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │  App Server 1   │
          │  (Django)       │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │  PostgreSQL DB  │
          │  (Primary)      │
          └─────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │  Admin Dashboard│
          │  (Web Interface)│
          └─────────────────┘
```

---

*Architecture Documentation*  
*MTC Dining Management System*  
*Version 1.0.0*

# 🚀 Quick Reference - Dining System Testing

## Run Tests (Anytime)

```powershell
# Navigate to backend directory
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run test script
python test-dining.py
```

When prompted "Do you want to clean up test data? (y/n):"
- Type **n** to keep test data for further testing
- Type **y** to clean up (this is what happened by accident)

---

## Quick API Testing Guide

### 1. Login to Get Token
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $token.access_token
Write-Host "Token: $token"
```

### 2. Test QR Scan
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    qr_data = "MTC|STU0001|Test Student 1|EDUCATION"
    meal_type = "BREAKFAST"
    scanner_device = "DEVICE_01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/dining/scan/" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### 3. Try Duplicate Scan (Should Fail)
```powershell
# Run the same command again - will get error
Invoke-RestMethod -Uri "http://localhost:8000/api/dining/scan/" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### 4. View Dashboard
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/dining/dashboard/" `
    -Method GET `
    -Headers $headers
```

### 5. Check Eligibility
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/dining/eligibility/?student_number=STU0001" `
    -Method GET `
    -Headers $headers
```

---

## Start Development Server

```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

Server runs at: http://localhost:8000

---

## Access Points

- **API Root**: http://localhost:8000/api/
- **Dining Endpoints**: http://localhost:8000/api/dining/
- **Swagger Docs**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **Admin**: http://localhost:8000/admin/

---

## Available Dining Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dining/scan/` | POST | Scan QR code for meal |
| `/api/dining/dashboard/` | GET | View dining statistics |
| `/api/dining/eligibility/` | GET | Check student eligibility |
| `/api/dining/attendance/` | GET | List attendance records |
| `/api/dining/stats/` | GET | Quick statistics |

---

## Common Test Scenarios

### Scenario 1: Successful Scan
1. Student has approved accommodation ✅
2. Student hasn't eaten this meal today ✅
3. Valid QR code provided ✅
4. **Result**: Attendance recorded

### Scenario 2: Duplicate Prevention
1. Student already scanned for breakfast today ❌
2. Try to scan again for breakfast ❌
3. **Result**: Error - "Already scanned for Breakfast today"

### Scenario 3: Not Eligible
1. Student has no accommodation or pending status ❌
2. Try to scan for any meal ❌
3. **Result**: Error - "Student does not have approved accommodation"

### Scenario 4: Different Meal Same Day
1. Student scanned for breakfast ✅
2. Student scans for lunch ✅
3. **Result**: Success - different meal type allowed

---

## Troubleshooting

### Server Not Starting?
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed (replace PID with actual number)
taskkill /PID <PID> /F

# Restart server
python manage.py runserver
```

### Database Issues?
```powershell
# Run migrations
python manage.py migrate

# Create superuser if needed
python manage.py createsuperuser
```

### Module Import Errors?
```powershell
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Install requirements if needed
pip install -r requirements.txt
```

---

## Sample Data Created by Test Script

The test script (`test-dining.py`) creates:
- 5 students (STU0001 - STU0005)
- 1 hostel (Main Hostel)
- 1 room (Room 101)
- 3 approved accommodations (STU0001-003)
- 1 pending application (STU0004)
- 1 no application (STU0005)

This allows testing of:
- ✅ Eligible students scanning meals
- ✅ Duplicate prevention
- ✅ Ineligible student scenarios
- ✅ Dashboard statistics

---

## Reset Everything (If Needed)

```powershell
# Delete all dining records only
python manage.py shell

>>> from dining.models import DiningAttendance
>>> DiningAttendance.objects.all().delete()
>>> exit()

# Or delete ALL test data
python test-dining.py
# Choose 'y' when prompted to cleanup
```

---

## Next Steps After Testing

1. ✅ Test passes with sample data
2. ⏭️ Deploy scanner devices to dining halls
3. ⏭️ Train staff on system usage
4. ⏭️ Monitor initial rollout
5. ⏭️ Gather user feedback
6. ⏭️ Iterate and improve

---

*Quick Reference Guide - MTC Dining System*  
*For detailed documentation, see: DINING_SYSTEM_COMPLETE.md*

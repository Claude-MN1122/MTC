# Test Student API Endpoints
# This script tests the Student Identity & QR Code System API

$baseUrl = "http://localhost:8000/api/students/"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Testing Student Identity & QR Code System API" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Create a student
Write-Host "[Test 1] Creating a new student..." -ForegroundColor Yellow

$studentData = @{
    student_number = "STU2024$(Get-Random -Minimum 1000 -Maximum 9999)"
    full_name = "John Doe"
    national_id = "67-123456X78"
    department = "EDUCATION"
    year_of_study = 1
    gender = "MALE"
    email = "john.doe@example.com"
    phone_number = "+263771234567"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $studentData -ContentType "application/json"
    Write-Host "✓ Student created successfully!" -ForegroundColor Green
    Write-Host "  Student Number: $($response.student.student_number)" -ForegroundColor White
    Write-Host "  Full Name: $($response.student.full_name)" -ForegroundColor White
    Write-Host "  QR Code Generated: $($response.student.has_qr_code)" -ForegroundColor White
    
    if ($response.student.has_qr_code) {
        Write-Host "  QR Code URL: $($response.student.qr_code_url)" -ForegroundColor White
    }
    
    $studentId = $response.student.id
    Write-Host "  Student ID: $studentId" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to create student" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: List all students
Write-Host "[Test 2] Listing all students..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    Write-Host "✓ Retrieved list of students" -ForegroundColor Green
    Write-Host "  Total students: $($response.count)" -ForegroundColor White
    Write-Host "  Page size: $($response.results.Count)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to list students" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get student details
Write-Host "[Test 3] Getting student details..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "${baseUrl}${studentId}/" -Method GET
    Write-Host "✓ Retrieved student details" -ForegroundColor Green
    Write-Host "  Name: $($response.full_name)" -ForegroundColor White
    Write-Host "  Department: $($response.department_display)" -ForegroundColor White
    Write-Host "  Has Photo: $($response.has_photo)" -ForegroundColor White
    Write-Host "  Has QR Code: $($response.has_qr_code)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to get student details" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get QR code information
Write-Host "[Test 4] Getting QR code information..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "${baseUrl}${studentId}/qr_code/" -Method GET
    Write-Host "✓ Retrieved QR code data" -ForegroundColor Green
    Write-Host "  Student Number: $($response.student_number)" -ForegroundColor White
    Write-Host "  Department: $($response.department)" -ForegroundColor White
    Write-Host "  QR Code URL: $($response.qr_code_url)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to get QR code info" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Update student information
Write-Host "[Test 5] Updating student information..." -ForegroundColor Yellow

$updateData = @{
    full_name = "John Doe Updated"
    phone_number = "+263771234568"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "${baseUrl}${studentId}/" -Method PUT -Body $updateData -ContentType "application/json"
    Write-Host "✓ Student updated successfully" -ForegroundColor Green
    Write-Host "  New Name: $($response.full_name)" -ForegroundColor White
    Write-Host "  New Phone: $($response.phone_number)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to update student" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Filter by department
Write-Host "[Test 6] Filtering students by department..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "${baseUrl}?department=EDUCATION" -Method GET
    Write-Host "✓ Filtered by EDUCATION department" -ForegroundColor Green
    Write-Host "  Found: $($response.count) students" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to filter students" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 7: Search students
Write-Host "[Test 7] Searching for student..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "${baseUrl}?search=John" -Method GET
    Write-Host "✓ Search completed" -ForegroundColor Green
    Write-Host "  Found: $($response.count) matching students" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to search" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Cleanup: Delete the test student
Write-Host "[Cleanup] Deleting test student..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "${baseUrl}${studentId}/" -Method DELETE
    Write-Host "✓ Test student deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to delete student" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

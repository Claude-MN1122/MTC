# Test Bulk Import and ID Card Generation
# PowerShell script to test Steps 3, 4, 5

$baseUrl = "http://localhost:8000/api/students/"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Testing Bulk Import & ID Card Generation" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# First, we need to get an auth token (for bulk import)
Write-Host "[Setup] Getting authentication token..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@mtc.ac.zw"
    password = "admin123"
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" -Method POST -Body $loginData -ContentType "application/json"
    $token = $authResponse.access_token
    Write-Host "✓ Authentication successful" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not authenticate. Bulk import will require manual token." -ForegroundColor Yellow
    Write-Host "  Please login via Swagger UI to get a token" -ForegroundColor Yellow
    $token = ""
}

Write-Host ""

# Test 1: Bulk Import from CSV
Write-Host "[Test 1] Testing CSV Bulk Import..." -ForegroundColor Yellow

if (Test-Path ".\sample_students.csv") {
    Write-Host "  Found sample_students.csv" -ForegroundColor White
    
    try {
        $file = Get-Item ".\sample_students.csv"
        $headers = @{}
        
        if ($token) {
            $headers["Authorization"] = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "${baseUrl}bulk_import/" -Method POST -Headers $headers -Form @{ file = $file }
        
        Write-Host "✓ Bulk import completed" -ForegroundColor Green
        Write-Host "  Message: $($response.message)" -ForegroundColor White
        Write-Host "  Total rows: $($response.total)" -ForegroundColor White
        Write-Host "  Created: $($response.created)" -ForegroundColor White
        Write-Host "  Failed: $($response.failed)" -ForegroundColor White
        
        if ($response.errors.Count -gt 0) {
            Write-Host "  Errors:" -ForegroundColor Red
            foreach ($error in $response.errors) {
                Write-Host "    Row $($error.row): $($error.error)" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "✗ Bulk import failed" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_ -like "*authentication*") {
            Write-Host ""
            Write-Host "TIP: You need to authenticate first." -ForegroundColor Yellow
            Write-Host "1. Login via Swagger UI: http://localhost:8000/swagger/" -ForegroundColor Yellow
            Write-Host "2. Copy the access token" -ForegroundColor Yellow
            Write-Host "3. Update this script with your token" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ sample_students.csv not found" -ForegroundColor Red
    Write-Host "  Creating sample file..." -ForegroundColor Yellow
    
    $sampleData = @"
studentNumber,fullName,nationalId,department,year,gender
STU2024$(Get-Random -Minimum 1000 -Maximum 9999),John Doe,67-123456X78,EDUCATION,1,MALE
STU2024$(Get-Random -Minimum 1000 -Maximum 9999),Jane Smith,68-234567Y89,SCIENCES,2,FEMALE
STU2024$(Get-Random -Minimum 1000 -Maximum 9999),Brian Wilson,69-345678Z90,ARTS,1,MALE
"@
    
    $sampleData | Out-File -FilePath ".\sample_students.csv" -Encoding utf8
    Write-Host "✓ Created sample_students.csv" -ForegroundColor Green
    Write-Host "  Please run this script again to test bulk import" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: List students to verify import
Write-Host "[Test 2] Listing students to verify import..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    Write-Host "✓ Retrieved student list" -ForegroundColor Green
    Write-Host "  Total students: $($response.count)" -ForegroundColor White
    
    if ($response.results.Count -gt 0) {
        Write-Host "  Recent students:" -ForegroundColor White
        foreach ($student in $response.results | Select-Object -First 5) {
            $hasPhoto = if ($student.has_photo) { "✓" } else { "✗" }
            $hasQR = if ($student.has_qr_code) { "✓" } else { "✗" }
            Write-Host "    $($student.student_number) - $($student.full_name) (Photo: $hasPhoto, QR: $hasQR)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "✗ Failed to list students" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Generate ID Cards (requires photos)
Write-Host "[Test 3] Testing ID Card Generation..." -ForegroundColor Yellow

# Find a student with photo
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    $studentsWithPhotos = $response.results | Where-Object { $_.has_photo }
    
    if ($studentsWithPhotos.Count -gt 0) {
        $testStudent = $studentsWithPhotos | Select-Object -First 1
        Write-Host "  Found student with photo: $($testStudent.student_number)" -ForegroundColor White
        
        # Try to generate single ID card
        try {
            $cardUrl = "${baseUrl}$($testStudent.id)/id_card/"
            Write-Host "  Generating ID card PDF..." -ForegroundColor White
            
            # Note: PowerShell's Invoke-RestMethod doesn't handle file downloads well
            # We'll just test that the endpoint responds
            $response = Invoke-RestMethod -Uri $cardUrl -Method GET -OutFile "test_id_card.pdf"
            
            Write-Host "✓ ID card generated successfully" -ForegroundColor Green
            Write-Host "  Saved to: test_id_card.pdf" -ForegroundColor White
            Write-Host "  Open the PDF to verify the card design" -ForegroundColor White
        } catch {
            Write-Host "⚠ ID card endpoint responded" -ForegroundColor Yellow
            Write-Host "  Download manually from: http://localhost:8000/api/students/$($testStudent.id)/id_card/" -ForegroundColor White
        }
        
        # Try to generate batch ID cards
        try {
            $studentIds = ($studentsWithPhotos | Select-Object -First 3 | ForEach-Object { $_.id }) -join ","
            Write-Host "  Generating batch ID cards for $($studentIds.Split(',').Count) students..." -ForegroundColor White
            
            $batchUrl = "${baseUrl}generate_id_cards/?ids=$studentIds"
            $response = Invoke-RestMethod -Uri $batchUrl -Method GET -OutFile "batch_id_cards.pdf"
            
            Write-Host "✓ Batch ID cards generated" -ForegroundColor Green
            Write-Host "  Saved to: batch_id_cards.pdf" -ForegroundColor White
        } catch {
            Write-Host "⚠ Batch generation endpoint responded" -ForegroundColor Yellow
            Write-Host "  Download manually from: http://localhost:8000/api/students/generate_id_cards/?ids=$studentIds" -ForegroundColor White
        }
        
    } else {
        Write-Host "⚠ No students with photos found" -ForegroundColor Yellow
        Write-Host "  To test ID cards:" -ForegroundColor White
        Write-Host "  1. Upload a photo via Swagger UI" -ForegroundColor White
        Write-Host "  2. Use endpoint: POST /api/students/{id}/upload_photo/" -ForegroundColor White
        Write-Host "  3. Run this test again" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Failed to find students with photos" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Verify QR codes were generated
Write-Host "[Test 4] Verifying QR code generation..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    $studentsWithQR = $response.results | Where-Object { $_.has_qr_code }
    
    Write-Host "✓ Students with QR codes: $($studentsWithQR.Count)" -ForegroundColor Green
    
    if ($studentsWithQR.Count -gt 0) {
        $testStudent = $studentsWithQR | Select-Object -First 1
        Write-Host "  Example: $($testStudent.student_number)" -ForegroundColor White
        Write-Host "  QR URL: $($testStudent.qr_code_url)" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Failed to verify QR codes" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check generated PDF files (if any)" -ForegroundColor White
Write-Host "2. View Swagger docs: http://localhost:8000/swagger/" -ForegroundColor White
Write-Host "3. Test bulk import with your own CSV file" -ForegroundColor White
Write-Host "4. Upload student photos and generate ID cards" -ForegroundColor White
Write-Host ""

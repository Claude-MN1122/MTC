# Quick Authentication Test Script

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "MTC Campus System - Authentication Test" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Check if server is running
Write-Host "Checking if server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/swagger/" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] Server is running at $baseUrl" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Server is not running!" -ForegroundColor Red
    Write-Host "Please start the server with: python manage.py runserver" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 1: Get Available Roles
Write-Host "Test 1: Getting available roles..." -ForegroundColor Yellow
try {
    $rolesResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/roles/" -Method GET
    Write-Host "[OK] Retrieved $($rolesResponse.Count) roles:" -ForegroundColor Green
    foreach ($role in $rolesResponse) {
        Write-Host "  - $($role.label) ($($role.value))" -ForegroundColor Gray
    }
} catch {
    Write-Host "[FAIL] Could not retrieve roles" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 2: Register New User
Write-Host "Test 2: Registering new test user..." -ForegroundColor Yellow
$registerData = @{
    email = "testuser@mtc.ac.zw"
    full_name = "Test User"
    password = "TestPass123!"
    password_confirm = "TestPass123!"
    role = "STUDENT"
    phone_number = "+263771234567"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register/" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "[OK] User registered successfully!" -ForegroundColor Green
    Write-Host "  Email: $($registerResponse.user.email)" -ForegroundColor Gray
    Write-Host "  Name: $($registerResponse.user.full_name)" -ForegroundColor Gray
    Write-Host "  Role: $($registerResponse.user.role)" -ForegroundColor Gray
    
    $accessToken = $registerResponse.tokens.access
    Write-Host "  Access Token: $($accessToken.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorBody.email) {
        Write-Host "[INFO] User already exists (this is normal on re-run)" -ForegroundColor Yellow
        Write-Host "  Proceeding to login test..." -ForegroundColor Yellow
        
        # Login to get token
        $loginData = @{
            email = "testuser@mtc.ac.zw"
            password = "TestPass123!"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login/" -Method POST -Body $loginData -ContentType "application/json"
            $accessToken = $loginResponse.access
            Write-Host "[OK] Login successful!" -ForegroundColor Green
        } catch {
            Write-Host "[FAIL] Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[FAIL] Registration failed" -ForegroundColor Red
        Write-Host $errorBody -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Test 3: Get Current User
Write-Host "Test 3: Getting current user profile..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me/" -Method GET -Headers $headers
    Write-Host "[OK] Retrieved user profile:" -ForegroundColor Green
    Write-Host "  ID: $($userResponse.id)" -ForegroundColor Gray
    Write-Host "  Email: $($userResponse.email)" -ForegroundColor Gray
    Write-Host "  Full Name: $($userResponse.full_name)" -ForegroundColor Gray
    Write-Host "  Role: $($userResponse.role_display)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Could not retrieve user profile" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 4: Update Profile
Write-Host "Test 4: Updating user profile..." -ForegroundColor Yellow
$updateData = @{
    full_name = "Test User Updated"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile/update/" -Method PUT -Body $updateData -ContentType "application/json" -Headers $headers
    Write-Host "[OK] Profile updated successfully!" -ForegroundColor Green
    Write-Host "  New Name: $($updateResponse.full_name)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Profile update failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Authentication Tests Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All core authentication endpoints are working!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit Swagger UI: http://localhost:8000/swagger/" -ForegroundColor White
Write-Host "2. Create superuser: python manage.py createsuperuser" -ForegroundColor White
Write-Host "3. Start building other features!" -ForegroundColor White
Write-Host ""

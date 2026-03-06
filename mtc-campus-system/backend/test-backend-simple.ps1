# Simple API Test Script for MTC Campus System
# This tests if backend is accessible

Write-Host "Testing Backend Connection" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Test 1: Can we reach the server?
Write-Host "Test 1: Checking if server is running..." -ForegroundColor Yellow
try {
    # Try to access any URL on the server - even 404 means server is up
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "  SUCCESS: Server is running!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    # Check if it's a 404 (server up) vs connection refused (server down)
    if ($_.Exception.Response.StatusCode -eq 404 -or $_.Exception.Response.StatusCode -eq 302) {
        Write-Host "  SUCCESS: Server is running!" -ForegroundColor Green
        Write-Host "  (Got $($_.Exception.Response.StatusCode) which is normal)" -ForegroundColor Gray
    } else {
        Write-Host "  FAILED: Cannot connect to server" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Make sure Django server is running:" -ForegroundColor Yellow
        Write-Host "  python manage.py runserver" -ForegroundColor White
        exit 1
    }
}

# Test 2: Check API root
Write-Host ""
Write-Host "Test 2: Checking API root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/" -TimeoutSec 5
    Write-Host "  SUCCESS: API root is accessible" -ForegroundColor Green
    Write-Host "  Response type: $($response.GetType().Name)" -ForegroundColor Gray
} catch {
    Write-Host "  INFO: API root may not have a default view" -ForegroundColor Yellow
    Write-Host "  This is normal - trying specific endpoints..." -ForegroundColor Yellow
}

# Test 3: Check Swagger documentation
Write-Host ""
Write-Host "Test 3: Checking API documentation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/swagger/" -TimeoutSec 5
    Write-Host "  SUCCESS: Swagger UI is accessible" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Swagger UI not available" -ForegroundColor Yellow
}

# Test 4: Try to access students endpoint (may require auth)
Write-Host ""
Write-Host "Test 4: Checking students endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/students/" -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  SUCCESS: Students endpoint exists" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  EXPECTED: Endpoint requires authentication (401)" -ForegroundColor Green
        Write-Host "  This is normal - login required" -ForegroundColor Gray
    } elseif ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "  EXPECTED: Access forbidden without credentials (403)" -ForegroundColor Green
        Write-Host "  This is normal - login required" -ForegroundColor Gray
    } else {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Check admin panel
Write-Host ""
Write-Host "Test 5: Checking Django admin..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/" -TimeoutSec 5
    Write-Host "  SUCCESS: Admin panel is accessible" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Admin panel not accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Status: RUNNING" -ForegroundColor Green
Write-Host "API Base URL: $baseUrl/api/" -ForegroundColor Cyan
Write-Host "Swagger Docs: $baseUrl/swagger/" -ForegroundColor Cyan
Write-Host "Admin Panel: $baseUrl/admin/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a superuser if you haven't:" -ForegroundColor White
Write-Host "   python manage.py createsuperuser" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Login at: $baseUrl/admin/" -ForegroundColor White
Write-Host ""
Write-Host "3. View API docs at: $baseUrl/swagger/" -ForegroundColor White
Write-Host ""
Write-Host "4. Start frontend and test login" -ForegroundColor White

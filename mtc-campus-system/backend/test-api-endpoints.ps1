# API Endpoint Testing Script for MTC Campus System
# Run this after starting the backend server

Write-Host "Testing MTC Campus Backend API Endpoints" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000/api"
$allPassed = $true

# Test function
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    
    try {
        $params = @{
            Method = $Method
            Uri = $Url
            Headers = $Headers
            ContentType = 'application/json'
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        
        Write-Host "  ✅ SUCCESS - Status: $($response.GetType().Name)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Check if server is running
Write-Host "`nServer Health Check" -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan
$serverRunning = Test-Endpoint -Method Get -Url "$baseUrl/" -Description "Base API URL"
if (-not $serverRunning) {
    Write-Host "`n❌ Backend server is not running!" -ForegroundColor Red
    Write-Host "Please run: python manage.py runserver" -ForegroundColor Yellow
    exit 1
}

# Test 2: Authentication Endpoints
Write-Host "`nAuthentication Endpoints" -ForegroundColor Cyan
Write-Host "--------------------------" -ForegroundColor Cyan
Test-Endpoint -Method Post -Url "$baseUrl/auth/login/" -Description "Login endpoint" -Body '{"email":"test@test.com","password":"test"}'
Test-Endpoint -Method Get -Url "$baseUrl/auth/register/" -Description "Registration endpoint"

# Test 3: Student Endpoints
Write-Host "`nStudent Endpoints" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/students/" -Description "List students"
Test-Endpoint -Method Get -Url "$baseUrl/students/1/" -Description "Get single student"

# Test 4: Accommodation Endpoints
Write-Host "`nAccommodation Endpoints" -ForegroundColor Cyan
Write-Host "-------------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/accommodation/dashboard/" -Description "Accommodation dashboard"
Test-Endpoint -Method Get -Url "$baseUrl/accommodation/hostels/" -Description "List hostels"
Test-Endpoint -Method Get -Url "$baseUrl/accommodation/rooms/" -Description "List rooms"
Test-Endpoint -Method Get -Url "$baseUrl/accommodation/applications/" -Description "List applications"

# Test 5: Dining Endpoints
Write-Host "`nDining Endpoints" -ForegroundColor Cyan
Write-Host "------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/dining/statistics/" -Description "Dining statistics"
Test-Endpoint -Method Get -Url "$baseUrl/dining/attendance/" -Description "List attendance"
Test-Endpoint -Method Get -Url "$baseUrl/dining/eligibility/" -Description "Check eligibility"

# Test 6: Finance Endpoints
Write-Host "`nFinance Endpoints" -ForegroundColor Cyan
Write-Host "------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/finance/invoices/" -Description "List invoices"
Test-Endpoint -Method Get -Url "$baseUrl/finance/payments/" -Description "List payments"
Test-Endpoint -Method Get -Url "$baseUrl/finance/balances/" -Description "Student balances"

# Test 7: Library Endpoints
Write-Host "`nLibrary Endpoints" -ForegroundColor Cyan
Write-Host "------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/library/books/" -Description "List books"
Test-Endpoint -Method Get -Url "$baseUrl/library/borrowings/" -Description "List borrowings"

# Test 8: Analytics Endpoints
Write-Host "`nAnalytics Endpoints" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan
Test-Endpoint -Method Get -Url "$baseUrl/analytics/dashboard/" -Description "Analytics dashboard"
Test-Endpoint -Method Get -Url "$baseUrl/analytics/enrollment/" -Description "Enrollment analytics"
Test-Endpoint -Method Get -Url "$baseUrl/analytics/finance/" -Description "Finance analytics"

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "All endpoints are accessible!" -ForegroundColor Green
} else {
    Write-Host "Some endpoints failed - check backend logs" -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. If all tests passed, backend is ready!" -ForegroundColor White
Write-Host "2. If any tests failed, check Django server logs" -ForegroundColor White
Write-Host "3. Ensure database migrations are applied" -ForegroundColor White

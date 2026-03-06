# Add PostgreSQL to PATH and Run Database Setup
# This script adds PostgreSQL to the current session PATH and runs database setup

$PSQL_BIN = "C:\Program Files\PostgreSQL\18\bin"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "PostgreSQL PATH Configuration" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Add to current session PATH
if ($env:Path -notlike "*$PSQL_BIN*") {
    Write-Host "Adding PostgreSQL to current session PATH..." -ForegroundColor Yellow
    $env:Path += ";$PSQL_BIN"
    Write-Host "✓ PostgreSQL added to current session PATH" -ForegroundColor Green
} else {
    Write-Host "✓ PostgreSQL already in current session PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verifying psql availability..." -ForegroundColor Yellow
try {
    $psqlVersion = & psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ psql is available: $psqlVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠ psql found but version check failed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: psql not accessible even after adding to PATH" -ForegroundColor Red
    Write-Host "Please manually add PostgreSQL to your system PATH:" -ForegroundColor Yellow
    Write-Host "  1. Open System Properties > Environment Variables" -ForegroundColor White
    Write-Host "  2. Edit Path variable" -ForegroundColor White
    Write-Host "  3. Add: C:\Program Files\PostgreSQL\18\bin" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Running Database Setup..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Run database setup script
& ".\setup-database.ps1"

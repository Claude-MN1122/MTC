# MTC Campus System - Database Setup Script

$env:PGPASSWORD = "feedora"
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "==============================================="
Write-Host "MTC Campus Management System - Database Setup"
Write-Host "==============================================="
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL service..."
$postgresService = Get-Service -Name "postgresql*" | Where-Object { $_.Status -eq 'Running' }

if (-not $postgresService) {
    Write-Host "ERROR: PostgreSQL service is not running!"
    Write-Host "Please start the PostgreSQL service and try again."
    exit 1
}
Write-Host "[OK] PostgreSQL service is running"
Write-Host ""

# Create database
Write-Host "Creating database 'mtc_campus_db'..."
$createDbResult = & $PSQL_PATH -U postgres -h localhost -c "CREATE DATABASE mtc_campus_db;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database 'mtc_campus_db' created successfully"
} elseif ($createDbResult -match "already exists") {
    Write-Host "[INFO] Database 'mtc_campus_db' already exists"
} else {
    Write-Host "ERROR: Failed to create database!"
    Write-Host $createDbResult
    exit 1
}
Write-Host ""

# Verify database creation
Write-Host "Verifying database setup..."
$databases = & $PSQL_PATH -U postgres -h localhost -t -c "SELECT datname FROM pg_database WHERE datname = 'mtc_campus_db';"
if ($databases -match "mtc_campus_db") {
    Write-Host "[OK] Database verified successfully"
} else {
    Write-Host "ERROR: Database verification failed!"
    exit 1
}
Write-Host ""

Write-Host "==============================================="
Write-Host "Database Setup Complete!"
Write-Host "==============================================="
Write-Host ""
Write-Host "Database: mtc_campus_db"
Write-Host "Host: localhost"
Write-Host "Port: 5432"
Write-Host "User: postgres"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Run migrations: python manage.py migrate"
Write-Host "2. Create superuser: python manage.py createsuperuser"
Write-Host "3. Start server: python manage.py runserver"
Write-Host ""

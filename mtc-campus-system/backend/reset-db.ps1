# Reset Database and Re-migrate

$env:PGPASSWORD = "feedora"
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Resetting Database..." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Drop database
Write-Host "Dropping database 'mtc_campus_db'..." -ForegroundColor Yellow
& $PSQL_PATH -U postgres -h localhost -c "DROP DATABASE IF EXISTS mtc_campus_db;" 2>&1 | Out-Null
Write-Host "[OK] Database dropped" -ForegroundColor Green
Write-Host ""

# Create database
Write-Host "Creating database 'mtc_campus_db'..." -ForegroundColor Yellow
& $PSQL_PATH -U postgres -h localhost -c "CREATE DATABASE mtc_campus_db;" 2>&1 | Out-Null
Write-Host "[OK] Database created" -ForegroundColor Green
Write-Host ""

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Database Reset Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run migrations: python manage.py migrate" -ForegroundColor White
Write-Host "2. Create superuser: python manage.py createsuperuser" -ForegroundColor White
Write-Host ""

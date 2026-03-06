# PostgreSQL Database Setup Complete - MTC Campus Management System

## ✅ Status: **COMPLETE**

PostgreSQL has been successfully configured and is now being used for both development and production (no SQLite).

---

## 🎉 What Was Done

### 1. **Database Configuration Updated**
- ✅ Removed SQLite configuration completely
- ✅ Configured Django to use PostgreSQL exclusively
- ✅ Set up proper connection pooling and timeouts

### 2. **Environment Variables Configured**
Updated `.env` file with PostgreSQL credentials:
```env
POSTGRES_DB=mtc_campus_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=feedora
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### 3. **Database Created Successfully**
- Database name: `mtc_campus_db`
- Host: `localhost:5432`
- User: `postgres`
- Password: `feedora`

### 4. **Migrations Applied**
All Django migrations have been successfully applied to PostgreSQL:
- ✅ auth tables
- ✅ admin tables
- ✅ contenttypes tables
- ✅ sessions tables

---

## 📁 Files Modified

### 1. [`config/settings.py`](file://c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend\config\settings.py)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'mtc_campus_db'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'feedora'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Persistent connections
        'OPTIONS': {
            'connect_timeout': 10,
        },
    }
}
```

### 2. [`.env`](file://c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend\.env)
Updated with PostgreSQL credentials.

### 3. [`setup-database.ps1`](file://c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend\setup-database.ps1)
PowerShell script created to automate database setup.

---

## 🔧 PostgreSQL Installation Details

### Installation Path
```
C:\Program Files\PostgreSQL\18\
```

### Binary Location
```
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

### Service Name
```
postgresql-x64-18
```

### Connection Verified
- ✅ Port 5432 is listening
- ✅ Authentication working
- ✅ Database accessible

---

## 🚀 Quick Commands

### Run Migrations
```powershell
.\venv\Scripts\Activate.ps1
python manage.py migrate
```

### Create Superuser
```powershell
python manage.py createsuperuser
```

### Start Development Server
```powershell
python manage.py runserver
```

### Access Database via psql
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d mtc_campus_db
```

### View All Tables
```sql
\dt
```

---

## 📊 Database Structure

### Current Tables (from Django migrations)
- `django_admin_log` - Admin action logs
- `auth_user` - User accounts
- `auth_group` - User groups
- `auth_permission` - Permissions
- `django_content_type` - Content types
- `django_session` - Session data
- `django_migrations` - Migration history

### Future Tables (to be created)
When you create models in your apps, additional tables will be created:
- `apps_users_*` - Custom user tables
- `apps_students_*` - Student and ID card tables
- `apps_accommodation_*` - Residence allocation tables
- `apps_dining_*` - Meal tracking tables
- `apps_analytics_*` - Analytics tables
- `apps_audit_*` - Audit log tables

---

## 🔐 Security Notes

### Current Setup (Development)
- Using default `postgres` superuser
- Password stored in `.env` file (not committed to Git)
- Local connections only

### Production Recommendations
1. Create dedicated database user:
   ```sql
   CREATE USER mtc_app WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE mtc_campus_db TO mtc_app;
   ```

2. Update `.env`:
   ```env
   POSTGRES_USER=mtc_app
   POSTGRES_PASSWORD=secure-password
   ```

3. Use environment variables or secrets manager
4. Enable SSL/TLS connections
5. Restrict network access

---

## 🛠️ Troubleshooting

### Connection Issues

**Problem**: "password authentication failed"
**Solution**: Verify password in `.env` matches PostgreSQL password
```powershell
# Test connection
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d postgres
```

**Problem**: "could not connect to server"
**Solution**: Check if PostgreSQL service is running
```powershell
Get-Service -Name postgresql*
Start-Service -Name postgresql-x64-18
```

**Problem**: "database does not exist"
**Solution**: Run database setup script
```powershell
.\setup-database.ps1
```

### Reset PostgreSQL Password

If you forget the password:
1. Edit `pg_hba.conf`:
   ```
   # Change to trust temporarily
   host all all 127.0.0.1/32 trust
   ```

2. Restart PostgreSQL service

3. Connect without password:
   ```powershell
   psql -U postgres
   ```

4. Change password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new-password';
   ```

5. Restore `pg_hba.conf` to use md5/scram-sha-256

---

## 📝 Adding PostgreSQL to System PATH (Optional)

To use `psql` from anywhere without full path:

### Temporary (Current Session Only)
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\18\bin"
```

### Permanent (System-wide)
1. Open System Properties > Environment Variables
2. Edit "Path" variable under System variables
3. Add: `C:\Program Files\PostgreSQL\18\bin`
4. Click OK and restart terminal

### Verify
```powershell
psql --version
```

---

## 🎯 Next Steps

### Immediate
1. ✅ Database created
2. ✅ Migrations applied
3. ⏳ Create superuser account
   ```bash
   python manage.py createsuperuser
   ```

### Development
1. Start creating models in your apps
2. Create migrations for new models
3. Apply migrations to PostgreSQL
4. Build API endpoints

### Testing
1. Test database connection in Django shell:
   ```bash
   python manage.py shell
   ```
   ```python
   from django.db import connection
   cursor = connection.cursor()
   cursor.execute("SELECT version();")
   print(cursor.fetchone())
   ```

---

## 📊 Database Monitoring

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('mtc_campus_db'));
```

### List All Tables
```sql
\dt
```

### View Active Connections
```sql
SELECT * FROM pg_stat_activity WHERE datname = 'mtc_campus_db';
```

### Backup Database
```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -h localhost mtc_campus_db > backup.sql
```

### Restore Database
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost mtc_campus_db < backup.sql
```

---

## ✨ Summary

**PostgreSQL Configuration:**
- ✅ Installed and running (PostgreSQL 18)
- ✅ Database created (`mtc_campus_db`)
- ✅ Django configured to use PostgreSQL
- ✅ Migrations applied successfully
- ✅ Connection verified

**Benefits of Using PostgreSQL:**
- ✅ Production-ready database
- ✅ No SQLite conflicts
- ✅ Better performance
- ✅ Advanced features (transactions, constraints, etc.)
- ✅ Scalability for deployment

---

**🏫 Mutare Teachers College Campus Management System**  
**Database:** PostgreSQL 18  
**Status:** Fully Configured and Ready  
**Last Updated:** March 2026

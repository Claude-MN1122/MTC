# Quick Start Guide - Backend

## 🚀 60-Second Setup

### 1. Activate Virtual Environment
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

### 2. Run Setup Script
```powershell
python setup.py
```

Follow the prompts to complete setup.

### 3. Start Development Server
```powershell
python manage.py runserver
```

### 4. (Optional) Start Celery Worker
Open a new terminal:
```powershell
.\venv\Scripts\Activate.ps1
celery -A config worker --loglevel=info
```

---

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Start server
python manage.py runserver
```

---

## 🔑 Default URLs

| Service | URL |
|---------|-----|
| API Root | http://localhost:8000/api/ |
| Admin Panel | http://localhost:8000/admin/ |
| Swagger Docs | http://localhost:8000/swagger/ |
| ReDoc Docs | http://localhost:8000/redoc/ |

---

## 🛠️ Common Commands

```bash
# Create new Django app in apps/ directory
python manage.py startapp myapp apps/myapp

# Make migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check for issues
python manage.py check

# Run tests
python manage.py test

# Start Celery beat for scheduled tasks
celery -A config beat --loglevel=info
```

---

## ⚙️ Environment Configuration

Edit `.env` file to configure:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for dev, PostgreSQL for prod)
POSTGRES_DB=mtc_campus_db
POSTGRES_USER=mtc_admin
POSTGRES_PASSWORD=your-password

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST_USER=your-email@mtc.ac.zw
EMAIL_HOST_PASSWORD=your-app-password
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Redis not running:**
```bash
# Start Redis (Windows - if installed as service)
redis-server
```

**Database locked:**
```bash
# Delete SQLite database and re-migrate
rm db.sqlite3
python manage.py migrate
```

---

## 📚 Next Steps

1. ✅ Backend is set up and running
2. 📱 Proceed to create Django apps (students, accommodation, meals)
3. 🎨 Set up the frontend Next.js application
4. 🐳 Configure Docker containers

For detailed documentation, see [`README.md`](./README.md)

---

**MTC Campus Management System**  
Mutare Teachers College, Zimbabwe

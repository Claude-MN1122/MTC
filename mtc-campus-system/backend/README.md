# MTC Campus Management System - Backend

Django REST Framework backend for Mutare Teachers College Campus Management System.

## 📁 Project Structure

```
backend/
├── apps/                    # Django applications (modules)
│   └── __init__.py
├── config/                  # Django project configuration
│   ├── __init__.py         # Celery auto-import
│   ├── celery.py           # Celery configuration
│   ├── settings.py         # Django settings
│   ├── urls.py             # Root URL configuration
│   ├── wsgi.py             # WSGI application
│   └── asgi.py             # ASGI application
├── static/                  # Static files (CSS, JS, images)
├── media/                   # User-uploaded media files
├── templates/               # Global HTML templates
├── venv/                    # Python virtual environment
├── .env                     # Environment variables (development)
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🛠️ Technology Stack

### Core
- **Python 3.12+**
- **Django 5.0.6**
- **Django REST Framework 3.15.1**

### Authentication
- **djangorestframework-simplejwt** - JWT token authentication
- Session-based authentication support

### Database
- **PostgreSQL** (production)
- **SQLite** (development)
- **psycopg2-binary** - PostgreSQL adapter

### Task Queue & Caching
- **Celery 5.4.0** - Asynchronous task queue
- **Redis** - Message broker and caching

### File Processing
- **Pillow** - Image processing
- **qrcode** - QR code generation for student IDs

### API Documentation
- **drf-yasg** - OpenAPI/Swagger documentation
- **django-filter** - Advanced filtering

### Utilities
- **django-cors-headers** - CORS support
- **python-dotenv** - Environment variable management

## 🚀 Setup Instructions

### Prerequisites
- Python 3.12 or higher
- PostgreSQL 15+ (for production)
- Redis 7+ (for Celery)

### 1. Create Virtual Environment

```bash
# Windows PowerShell
cd backend
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- `SECRET_KEY`: Generate a secure random key
- `DEBUG`: Set to `True` for development
- `POSTGRES_*`: Database credentials
- `REDIS_URL`: Redis connection string
- Email configuration for notifications

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Start Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### 7. Start Celery Worker (Background Tasks)

Open a new terminal:

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start Celery worker
celery -A config worker --loglevel=info

# For Windows, you might need:
celery -A config worker --loglevel=info --pool=solo
```

### 8. Start Celery Beat (Scheduled Tasks)

Optional - for periodic tasks:

```bash
celery -A config beat --loglevel=info
```

## 📋 API Endpoints

Once the server is running:

- **Admin Panel**: http://localhost:8000/admin
- **API Documentation (Swagger)**: http://localhost:8000/swagger/
- **API Documentation (ReDoc)**: http://localhost:8000/redoc/
- **API Root**: http://localhost:8000/api/

## 🔧 Development Commands

```bash
# Run migrations
python manage.py migrate

# Create migrations for new models
python manage.py makemigrations

# Check for issues
python manage.py check

# Collect static files
python manage.py collectstatic

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Start Celery worker
celery -A config worker --loglevel=info
```

## 🏗️ Creating New Apps

All Django apps should be created inside the `apps/` directory:

```bash
python manage.py startapp students apps/students
```

Then add to `INSTALLED_APPS` in `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'apps.students',
]
```

## 📊 Database Configuration

### Development (SQLite)
No configuration needed - uses `db.sqlite3` by default.

### Production (PostgreSQL)

Update `.env` file:

```env
DEBUG=False
POSTGRES_DB=mtc_campus_db
POSTGRES_USER=mtc_admin
POSTGRES_PASSWORD=secure-password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

## 🔐 Security

### Secret Key Generation

Generate a secure secret key for production:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### Allowed Hosts

Update `.env`:

```env
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 📝 Code Style

This project follows Django best practices:
- PEP 8 compliant
- Django style guide
- Type hints where applicable

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.students

# Run with coverage
coverage run manage.py test
coverage report
```

## 🔄 Celery Tasks

Celery is configured for background processing:

```python
# Example task in apps/meals/tasks.py
from celery import shared_task

@shared_task
def calculate_daily_stats():
    # Process meal statistics
    pass
```

Start worker to process tasks:

```bash
celery -A config worker --loglevel=info
```

## 📦 Deployment

See deployment documentation in `/docs/deployment.md` for:
- Docker deployment
- Nginx configuration
- Gunicorn setup
- SSL/TLS configuration

## 🐛 Troubleshooting

### Common Issues

**Redis Connection Error:**
```bash
# Ensure Redis is running
redis-server
```

**Database Migration Error:**
```bash
# Delete database and migrations
python manage.py migrate --run-syncdb
```

**CORS Issues:**
- Check `FRONTEND_URL` in `.env`
- Verify CORS middleware is in MIDDLEWARE list

## 📞 Support

For technical support, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** March 2026  
**Institution:** Mutare Teachers College, Zimbabwe

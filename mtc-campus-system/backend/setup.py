#!/usr/bin/env python
"""
MTC Campus Management System - Backend Setup Script
Run this script to initialize the backend database and create a superuser.
"""

import os
import sys
import subprocess


def run_command(command, description):
    """Run a shell command with status output."""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=False
        )
        print(f"✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed!")
        print(f"Error: {e}")
        return False


def main():
    """Main setup function."""
    print("\n" + "="*60)
    print("🏫 MTC Campus Management System - Backend Setup")
    print("="*60)
    
    # Check if virtual environment is active
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("\n⚠️  Virtual environment is not activated!")
        print("Please activate your virtual environment first:")
        print("  .\\venv\\Scripts\\Activate.ps1  (PowerShell)")
        print("  venv\\Scripts\\activate.bat     (CMD)")
        sys.exit(1)
    
    print("\n✅ Virtual environment detected")
    
    # Step 1: Install dependencies
    if not run_command(
        "pip install -r requirements.txt",
        "Installing Python dependencies"
    ):
        print("\n⚠️  Dependency installation failed. Please check requirements.txt")
        sys.exit(1)
    
    # Step 2: Run migrations
    if not run_command(
        "python manage.py migrate",
        "Running database migrations"
    ):
        print("\n⚠️  Database migrations failed")
        sys.exit(1)
    
    # Step 3: Create static files directory structure
    print("\n📁 Creating static file directories...")
    os.makedirs('staticfiles', exist_ok=True)
    os.makedirs('media', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    print("✅ Static file directories created")
    
    # Step 4: Collect static files
    run_command(
        "python manage.py collectstatic --noinput",
        "Collecting static files"
    )
    
    # Step 5: Create superuser prompt
    print("\n" + "="*60)
    print("👤 Create Admin Superuser")
    print("="*60)
    print("\nWould you like to create an admin superuser now? (y/n): ", end='')
    response = input().lower()
    
    if response in ['y', 'yes']:
        print("\nFollow the prompts to create your admin account...")
        print("(Password will not be visible as you type)")
        run_command(
            "python manage.py createsuperuser",
            "Creating superuser"
        )
    else:
        print("\n💡 You can create a superuser later with:")
        print("   python manage.py createsuperuser")
    
    # Final summary
    print("\n" + "="*60)
    print("🎉 Backend Setup Complete!")
    print("="*60)
    print("""
Next steps:
  1. Start the development server:
     python manage.py runserver
  
  2. Access the application:
     • API Root: http://localhost:8000/api/
     • Admin Panel: http://localhost:8000/admin/
     • Swagger Docs: http://localhost:8000/swagger/
     • ReDoc Docs: http://localhost:8000/redoc/
  
  3. Start Celery worker (in a new terminal):
     celery -A config worker --loglevel=info
  
  4. Read the documentation:
     See README.md for detailed instructions
    
    """)
    
    print("="*60)
    print("🏫 Mutare Teachers College Campus Management System")
    print("="*60 + "\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

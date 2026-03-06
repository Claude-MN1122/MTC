# 🐍 Python Virtual Environment Guide

## What is a Virtual Environment?

A **virtual environment** (venv) is an isolated Python environment that contains:
- Specific Python version
- Project-specific dependencies
- Separate from your system Python

**Why use it?**
- ✅ Prevents conflicts between projects
- ✅ Keeps dependencies organized
- ✅ Makes deployment easier
- ✅ No need for admin/sudo privileges

---

## Quick Commands

### Activate Virtual Environment

**Windows PowerShell:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

**You'll know it's active when you see:**
```
(venv) PS C:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend>
```

**Windows Command Prompt (cmd):**
```cmd
cd backend
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
```

---

### Deactivate Virtual Environment

When you're done working:
```powershell
deactivate
```

The `(venv)` prefix will disappear.

---

## Common Issues & Solutions

### Issue 1: "Cannot be loaded because running scripts is disabled"

**Error:**
```
.\venv\Scripts\Activate.ps1 : cannot be loaded because running scripts is disabled on this system.
```

**Solution A - Run once as Administrator:**
```powershell
# Open PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solution B - Use cmd instead:**
```cmd
cd backend
venv\Scripts\activate.bat
python manage.py runserver
```

**Solution C - Bypass policy for single command:**
```powershell
PowerShell -ExecutionPolicy Bypass -File .\venv\Scripts\Activate.ps1
```

---

### Issue 2: "The term 'python' is not recognized"

**Solution:**
```powershell
# Try python3 instead
python3 manage.py runserver

# Or check if Python is installed
where python
```

If Python is not installed:
1. Download from https://www.python.org/downloads/
2. During installation, CHECK "Add Python to PATH"
3. Reinstall if needed

---

### Issue 3: Virtual environment doesn't exist

**Check if venv exists:**
```powershell
Test-Path .\venv\Scripts\Activate.ps1
# Should return: True
```

**If False, create it:**
```powershell
python -m venv venv

# Then activate
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt
```

---

### Issue 4: Dependencies not installed

**After activating venv, always install:**
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Verify installations:**
```powershell
pip list
pip show django
pip show djangorestframework
```

---

## Workflow Examples

### Starting Your Development Session

```powershell
# 1. Navigate to backend
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Start Django server
python manage.py runserver
```

### Running Management Commands

```powershell
# Activate first
.\venv\Scripts\Activate.ps1

# Then run commands
python manage.py migrate
python manage.py createsuperuser
python manage.py test
python manage.py shell
```

### Installing New Packages

```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Install package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

---

## File Structure

Your `backend/venv/` folder contains:

```
venv/
├── Scripts/
│   ├── Activate.ps1      ← PowerShell activation script
│   ├── activate.bat       ← CMD activation script
│   ├── deactivate.bat     ← Deactivation script
│   ├── python.exe         ← Python interpreter
│   └── pip.exe            ← Package installer
├── Lib/
│   └── site-packages/     ← Installed packages
└── include/
    └── ...                ← Header files
```

**Important:** 
- ✅ Add `venv/` to `.gitignore` (already done)
- ❌ Never commit venv to Git
- 📦 Each developer creates their own venv

---

## Best Practices

### DO ✅
- Activate venv before running Python commands
- Keep venv folder in `.gitignore`
- Use `requirements.txt` to track dependencies
- Create fresh venv for each project
- Deactivate when switching projects

### DON'T ❌
- Don't commit venv to Git
- Don't share venv folder
- Don't run Python commands without activating venv
- Don't manually edit files in venv
- Don't move venv folder after creation

---

## Troubleshooting Checklist

If venv isn't working:

- [ ] Check venv folder exists: `Test-Path .\venv`
- [ ] Verify activation script exists: `Test-Path .\venv\Scripts\Activate.ps1`
- [ ] Try CMD instead: `venv\Scripts\activate.bat`
- [ ] Check execution policy: `Get-ExecutionPolicy`
- [ ] Recreate venv if needed:
  ```powershell
  Remove-Item -Recurse -Force .\venv
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```

---

## Verification Steps

After activating venv, verify it's working:

```powershell
# Check Python path (should point to venv)
where python
# Expected: C:\...\backend\venv\Scripts\python.exe

# Check installed packages
pip list

# Check Django installation
python -m django --version

# Test import
python -c "import django; print(django.VERSION)"
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| **Activate (PowerShell)** | `.\venv\Scripts\Activate.ps1` |
| **Activate (CMD)** | `venv\Scripts\activate.bat` |
| **Deactivate** | `deactivate` |
| **Install packages** | `pip install -r requirements.txt` |
| **List packages** | `pip list` |
| **Check Python** | `where python` |
| **Create new venv** | `python -m venv venv` |
| **Delete venv** | `Remove-Item -Recurse -Force .\venv` |

---

## Need More Help?

**Python venv documentation:**
https://docs.python.org/3/library/venv.html

**Django installation guide:**
https://docs.djangoproject.com/en/stable/intro/install/

**PowerShell execution policies:**
https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy

---

**Remember:** Always activate your virtual environment before working with Python! 🐍

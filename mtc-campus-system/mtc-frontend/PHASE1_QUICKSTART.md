# 🚀 Phase 1 Quick Start Guide

## ✅ Completed Steps

- [x] Created `.env.local` file in frontend
- [x] Created `.env` file in backend
- [x] Verified axios configuration
- [x] Verified CORS configuration
- [x] Created API testing script

---

## 📋 Step-by-Step Instructions

### Step 1: Activate Virtual Environment & Start Backend Server

Open PowerShell and run:

```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**You should see:**
```
(venv) PS C:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend>
Django version X.X, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **The `(venv)` prefix confirms virtual environment is active!**  
✅ **Keep this terminal open!**

---

### Step 2: Test Backend API Endpoints

Open a **NEW** PowerShell window and run:

```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\test-api-endpoints.ps1
```

**Expected Output:**
```
🧪 Testing MTC Campus Backend API Endpoints
=============================================

📡 Server Health Check
----------------------
Testing: Base API URL
  ✅ SUCCESS - Status: Dict

🔐 Authentication Endpoints
--------------------------
Testing: Login endpoint
  ✅ SUCCESS - Status: Dict

... (more tests)

=============================================
🎉 API Testing Complete!
=============================================
✅ All endpoints are accessible!
```

**If you see errors:**
- ❌ Connection refused → Backend not running
- ❌ 404 errors → URLs might be different
- ❌ 500 errors → Check Django logs

---

### Step 3: Apply Database Migrations

In the **backend** PowerShell window (where Django is running), stop the server with `CTRL+C`, then run:

```powershell
.\venv\Scripts\Activate.ps1  # If venv not already active
python manage.py migrate
```

**Expected Output:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, students, accommodation, dining, users
Running migrations:
  Applying students.0001_initial... OK
  Applying accommodation.0001_initial... OK
  ...
```

Then restart the server:
```powershell
python manage.py runserver
```

---

### Step 4: Create Test Data (Optional)

If you need test data, create a superuser:

```powershell
.\venv\Scripts\Activate.ps1  # If not already active
python manage.py createsuperuser
```

Follow the prompts:
- Username: `admin`
- Email: `admin@mtc.ac.zw`
- Password: (choose a secure password)

---

### Step 5: Start Frontend Development Server

Open a **NEW** PowerShell window and run:

```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\mtc-frontend
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Ready in XXXXms
```

✅ **Keep this terminal open too!**

---

### Step 6: Test Frontend-Backend Connection

1. Open browser to: `http://localhost:3000/auth/login`

2. Open Browser DevTools (F12)

3. Go to **Network** tab

4. Try to log in (you can use the superuser credentials you created)

5. Check the network request:
   - **URL**: Should be `http://localhost:8000/api/auth/login/`
   - **Status**: Should be `200 OK`
   - **Response**: Should contain `{ token: "...", user: {...} }`

**Common Issues:**

**Issue**: Request goes to wrong URL
```
Fix: Check .env.local has NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Issue**: CORS error in console
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy

Fix: 
1. Check backend .env has FRONTEND_URL=http://localhost:3000
2. Restart Django server
3. Clear browser cache
```

**Issue**: 401 Unauthorized after login
```
Fix: Check if response contains token and user object
```

---

## ✅ Phase 1 Checklist

Complete these tasks in order:

### Infrastructure Setup
- [ ] `.env.local` file exists in `mtc-frontend/`
- [ ] `.env` file exists in `backend/`
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:3000

### Backend Verification
- [ ] API test script passed (all green checkmarks)
- [ ] Database migrations applied
- [ ] CORS allows localhost:3000
- [ ] Can access Django admin at http://localhost:8000/admin

### Frontend Integration
- [ ] No console errors about missing environment variables
- [ ] Network requests go to correct backend URL
- [ ] Authentication flow works (login → redirect to dashboard)
- [ ] Token stored in localStorage after login

### Data Integration
- [ ] Students page shows real data from database
- [ ] Accommodation page shows real hostels/rooms
- [ ] Dining page shows real statistics
- [ ] Finance page shows real invoices/payments
- [ ] Library page shows real books
- [ ] Analytics page shows real metrics

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'corsheaders'`
```powershell
# Solution: Install requirements
pip install -r requirements.txt
```

**Error**: `database "mtc_campus_db" does not exist`
```powershell
# Solution: Create database or update settings
# Option 1: Create in PostgreSQL
psql -U postgres -c "CREATE DATABASE mtc_campus_db;"

# Option 2: Use SQLite temporarily (development only)
# Update settings.py to use SQLite
```

### Frontend Won't Start

**Error**: `npm: command not found`
```powershell
# Solution: Install Node.js from https://nodejs.org
```

**Error**: `Cannot find module 'next'`
```powershell
# Solution: Install dependencies
npm install
```

### API Calls Fail

**Test with curl first:**
```powershell
# Test backend is responding
curl http://localhost:8000/api/

# Should return JSON response
```

**Check CORS headers:**
```powershell
# In browser console or Postman
curl -I http://localhost:8000/api/students/
# Look for: Access-Control-Allow-Origin: http://localhost:3000
```

---

## 📊 Success Criteria

Phase 1 is complete when:

✅ **Backend:**
- Server runs without errors
- All API endpoints respond
- Database has data
- CORS configured correctly

✅ **Frontend:**
- Development server runs
- No environment variable errors
- Can make API calls to backend
- Login redirects to dashboard

✅ **Integration:**
- Login works end-to-end
- Dashboard shows real data
- All pages load with backend data
- No mock data remaining

---

## 🎯 Next Steps After Phase 1

Once Phase 1 is complete:

1. **Verify all pages load with real data**
2. **Test authentication thoroughly**
3. **Move to Phase 2: Core Functionality**
   - Real QR scanner
   - Form validation
   - File uploads

---

## 📞 Need Help?

**Check these files:**
- `NEXT_PHASES_ROADMAP.md` - Detailed action plan
- `ANALYSIS_SUMMARY.md` - Complete assessment
- Backend logs in Django terminal
- Frontend logs in browser console

**Common Commands:**

```powershell
# Restart backend
cd backend
python manage.py runserver

# Restart frontend
cd mtc-frontend
npm run dev

# Test APIs
cd backend
.\test-api-endpoints.ps1

# Clear cache (if issues persist)
# Browser: Ctrl+Shift+Delete
# Or incognito mode: Ctrl+Shift+N
```

---

**Good luck! You've got this!** 💪

The hardest part is done - now it's just connecting the dots.

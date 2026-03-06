# 🚀 Quick Start - Phase 1

## Today's Goal
Get the Students page working with real backend data!

---

## Step 1: Activate Virtual Environment & Start Backend (2 minutes)

```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

✅ You should see: "(venv)" in your terminal prompt!
✅ Keep this window open!

---

## Step 2: Test APIs (1 minute)

**NEW PowerShell window:**
```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\test-api-endpoints.ps1
```

✅ Should see all green checkmarks!

---

## Step 3: Create Superuser (1 minute)

**In backend window (Ctrl+C to stop server first):**
```powershell
.\venv\Scripts\Activate.ps1  # If not already activated
python manage.py createsuperuser
# Email: admin@mtc.ac.zw
# Password: (choose one)
python manage.py runserver
```

---

## Step 4: Start Frontend (2 minutes)

**NEW PowerShell window:**
```powershell
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\mtc-frontend
npm run dev
```

✅ Opens http://localhost:3000

---

## Step 5: Test It! (1 minute)

1. Open: `http://localhost:3000/auth/login`
2. Login with superuser
3. Click "Students" in sidebar
4. **Should see real data!** 🎉

---

## 🐛 If Something Breaks

### "Failed to load students"
- ✅ Check backend is running at http://localhost:8000
- ✅ Check browser console (F12) for errors
- ✅ Try: `curl http://localhost:8000/api/students/`
- ✅ Make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`

### Can't login
- ✅ Verify superuser created
- ✅ Check password is correct
- ✅ Clear browser cache (Ctrl+Shift+Delete)

### TypeScript errors
- ✅ Restart VS Code
- ✅ Ctrl+Shift+P → "TypeScript: Restart TS Server"

### Virtual environment issues
- ✅ See `backend/VENV_GUIDE.md` for complete troubleshooting
- ✅ Quick fix: Use CMD instead of PowerShell
  ```cmd
  cd backend
  venv\Scripts\activate.bat
  python manage.py runserver
  ```

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] API test script passes
- [ ] Can login successfully
- [ ] Students page shows data from database
- [ ] No console errors

---

## 📞 Help Files

- `PHASE1_QUICKSTART.md` - Detailed guide
- `PHASE1_PROGRESS.md` - Implementation tracker
- `NEXT_PHASES_ROADMAP.md` - Full roadmap

---

**You've got this!** 💪  
One step at a time.

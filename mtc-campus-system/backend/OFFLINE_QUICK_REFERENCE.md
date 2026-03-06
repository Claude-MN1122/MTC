# 📶 Offline Dining - Quick Reference

## New API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dining/sync/` | POST | Batch sync offline scans |
| `/api/dining/offline-status/` | GET | Check sync status |
| `/api/dining/offline-dashboard/` | GET | Enhanced dashboard with offline info |

---

## JavaScript Usage

### Initialize
```javascript
const manager = new OfflineDiningManager({
    deviceId: 'SCANNER_01',
    autoSync: true,
    syncInterval: 30000
});
```

### Add Scan
```javascript
const result = await manager.addScan({
    studentNumber: 'STU0001',
    mealType: 'BREAKFAST',
    timestamp: new Date().toISOString()
});
```

### Get Stats
```javascript
const stats = await manager.getStats();
console.log(stats); 
// { total: 50, pending: 5, synced: 45, failed: 0 }
```

---

## Sync Status Values

- **PENDING** - Waiting to sync
- **SYNCING** - Currently syncing
- **SYNCED** - Successfully synced
- **FAILED** - Sync failed (check error)

---

## Dashboard Modes

- **ONLINE** - Connected, no pending scans
- **OFFLINE_PENDING** - Have scans waiting to sync
- **HYBRID** - Some synced, some pending
- **ONLINE_SCANS_PENDING** - Connected with backlog

---

## Test Commands

```powershell
# Run offline tests
cd c:\Users\CLAUDE\Documents\MTC\mtc-campus-system\backend
.\venv\Scripts\Activate.ps1
python test-offline-dining.py

# Create migration
python manage.py makemigrations dining

# Apply migration
python manage.py migrate
```

---

## Admin Panel

Access: `/admin/dining/offlinescan/`

**Actions:**
- View all offline scans
- Filter by status
- Retry failed syncs (bulk action)
- Export data

---

## Troubleshooting

### Scans Not Syncing?
1. Check internet connection
2. Verify JWT token is valid
3. Check browser console for errors
4. Manually trigger sync

### Too Many Failed Syncs?
1. Review error messages in admin
2. Check student eligibility
3. Use "Retry Failed Syncs" action
4. Investigate patterns

### IndexedDB Issues?
1. Clear old synced records
2. Check browser storage quota
3. Restart browser
4. Clear browser cache

---

## File Locations

- **Backend Models**: `apps/dining/models.py`
- **Backend Views**: `apps/dining/views.py`
- **JS Library**: `static/js/offline-dining-manager.js`
- **Tests**: `test-offline-dining.py`
- **Docs**: `STAGE_5_OFFLINE_COMPLETE.md`

---

*Quick Reference - Stage 5 Offline Mode*

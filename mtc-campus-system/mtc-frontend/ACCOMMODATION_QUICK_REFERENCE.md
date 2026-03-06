# Accommodation Management - Quick Reference Guide

## 🎯 Quick Start

### 1. View Accommodation Dashboard
- Navigate to **Accommodation** from sidebar
- Default view shows overview statistics
- See occupancy rates, applications, and available spaces

### 2. Manage Hostels
- Click **Hostels** tab
- Search by name or description
- Filter by gender (Male/Female/Mixed)
- Add new hostel with capacity details
- Edit existing hostel information
- View occupancy statistics per hostel

### 3. Manage Rooms
- Click **Rooms** tab
- Search by room number or hostel
- Filter by hostel and status
- Add rooms with capacity details
- Track occupancy per room
- View floor assignments

### 4. Process Applications
- Click **Applications** tab
- Search by student name/number
- Filter by status (Pending/Approved/Rejected/Waiting)
- Approve applications with room assignment
- Reject applications with reasons
- View application history

---

## 📱 Component Usage

### Display Accommodation Dashboard

```tsx
import { AccommodationDashboard } from '@/components/accommodation';

<AccommodationDashboard 
  totalHostels={4}
  totalRooms={85}
  occupancyRate={78.5}
  availableSpaces={45}
  pendingApplications={23}
  approvedApplications={297}
  waitingList={15}
/>
```

### List Hostels

```tsx
import { HostelsList } from '@/components/accommodation';

<HostelsList 
  hostels={hostelsData}
  isLoading={false}
  onAddHostel={() => handleAdd()}
  onViewHostel={(id) => handleView(id)}
  onEditHostel={(id) => handleEdit(id)}
  onDeleteHostel={(id) => handleDelete(id)}
/>
```

### List Rooms

```tsx
import { RoomsList } from '@/components/accommodation';

<RoomsList 
  rooms={roomsData}
  isLoading={false}
  onAddRoom={() => handleAdd()}
  onViewRoom={(id) => handleView(id)}
  onEditRoom={(id) => handleEdit(id)}
  onDeleteRoom={(id) => handleDelete(id)}
/>
```

### List Applications

```tsx
import { ApplicationsList } from '@/components/accommodation';

<ApplicationsList 
  applications={appsData}
  isLoading={false}
  onViewApplication={(id) => handleView(id)}
  onApprove={(id) => handleApprove(id)}
  onReject={(id) => handleReject(id)}
/>
```

---

## 🔧 API Integration

### Get All Hostels

```typescript
import { getHostels } from '@/services/accommodationApi';

const hostels = await getHostels({
  gender: 'FEMALE',      // Optional filter
  is_active: true,        // Optional filter
  search: 'Main'          // Optional search
});
```

### Get Hostel Statistics

```typescript
import { getHostelStatistics } from '@/services/accommodationApi';

const stats = await getHostelStatistics(hostelId);
// Returns: { total_rooms, occupied_spaces, available_spaces, occupancy_rate }
```

### Create New Hostel

```typescript
import { createHostel } from '@/services/accommodationApi';

const newHostel = await createHostel({
  name: 'New Hostel',
  gender: 'MIXED',
  capacity: 100,
  description: 'Modern facilities',
  is_active: true
});
```

### Get Rooms by Hostel

```typescript
import { getRooms } from '@/services/accommodationApi';

const rooms = await getRooms({
  hostel: hostelId,       // Filter by hostel
  is_active: true,        // Only active rooms
  search: '101'           // Search by room number
});
```

### Submit Accommodation Application

```typescript
import { applyForAccommodation } from '@/services/accommodationApi';

const application = await applyForAccommodation({
  student: studentId,
  hostel: preferredHostelId,  // Optional
  period: 'FULL_YEAR',
  notes: 'Special requirements'
});
```

### Approve Application

```typescript
import { approveApplication } from '@/services/accommodationApi';

const result = await approveApplication(applicationId, {
  assign_room: roomId,      // Specific room (optional)
  assign_hostel: hostelId,  // Preferred hostel (optional)
  notes: 'Approved based on merit'
});
```

### Reject Application

```typescript
import { rejectApplication } from '@/services/accommodationApi';

await rejectApplication(applicationId, {
  reason: 'No available space in preferred hostel'
});
```

### Get Waiting List

```typescript
import { getWaitingList } from '@/services/accommodationApi';

const waitingList = await getWaitingList();
// Returns applications with status=WAITING_LIST
```

### Process Waiting List

```typescript
import { processWaitingList } from '@/services/accommodationApi';

const result = await processWaitingList(hostelId);
console.log(`Assigned ${result.assigned_count} students`);
```

### Get Application Statistics

```typescript
import { getApplicationStatistics } from '@/services/accommodationApi';

const stats = await getApplicationStatistics();
// Returns: { total_applications, pending, approved, rejected, waiting_list, cancelled }
```

---

## 📋 Data Models

### Hostel

```typescript
interface Hostel {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  capacity: number;
  description?: string;
  is_active: boolean;
  total_rooms: number;
  occupied_spaces: number;
  available_spaces: number;
  occupancy_rate: number;
}
```

### Room

```typescript
interface Room {
  id: number;
  hostel: number;
  hostel_name: string;
  room_number: string;
  capacity: number;
  floor?: string;
  room_type?: string;
  is_active: boolean;
  occupied_spaces: number;
  available_spaces: number;
  is_full: boolean;
  occupancy_rate: number;
}
```

### Application

```typescript
interface AccommodationApplication {
  id: number;
  student: number;
  student_details?: {
    full_name: string;
    student_number: string;
  };
  hostel?: number;
  hostel_name?: string;
  room?: number;
  room_number?: string;
  period: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'CANCELLED';
  application_date: string;
  decision_date?: string;
  notes?: string;
  rejection_reason?: string;
  waiting_list_position: number;
}
```

---

## 🎨 Status & Badges

### Application Status Colors

| Status | Color | Badge Variant | Icon |
|--------|-------|---------------|------|
| Pending | Amber | warning | ⏰ |
| Approved | Green | success | ✅ |
| Rejected | Red | error | ❌ |
| Waiting List | Blue | info | 👥 |
| Cancelled | Grey | default | — |

### Occupancy Rate Colors

| Rate | Color | Meaning |
|------|-------|---------|
| 0-70% | Green | Healthy |
| 70-90% | Amber | Getting Full |
| 90-100% | Red | Critical |

### Gender Badge Colors

| Gender | Color | Badge Variant |
|--------|-------|---------------|
| Male | Blue | info |
| Female | Gold | gold |
| Mixed | Grey | default |

---

## 🔍 Search & Filters

### Hostels Filtering

```typescript
// Search by name or description
searchQuery: string;

// Filter options
genderFilter: 'all' | 'MALE' | 'FEMALE' | 'MIXED';
```

### Rooms Filtering

```typescript
// Search by room number or hostel name
searchQuery: string;

// Filter options
hostelFilter: 'all' | hostelId;
statusFilter: 'all' | 'active' | 'inactive';
```

### Applications Filtering

```typescript
// Search by student name or number
searchQuery: string;

// Filter options
statusFilter: 'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'CANCELLED';
```

---

## 💡 Pro Tips

### For Administrators

1. **Monitor Occupancy Daily**
   - Check dashboard for overall picture
   - Identify hostels nearing capacity
   - Plan maintenance during low occupancy

2. **Process Applications Weekly**
   - Review pending applications every Friday
   - Approve qualified students promptly
   - Provide clear rejection reasons

3. **Manage Waiting List**
   - Run waiting list processing bi-weekly
   - Monitor position changes
   - Communicate with waiting students

4. **Optimize Room Allocation**
   - Fill rooms to capacity before opening new ones
   - Consider floor assignments strategically
   - Group students by program/year when possible

### For Developers

1. **Handle Loading States**
   ```tsx
   const [isLoading, setIsLoading] = useState(true);
   
   useEffect(() => {
     fetchData().finally(() => setIsLoading(false));
   }, []);
   ```

2. **Error Handling**
   ```tsx
   try {
     await apiCall();
   } catch (error) {
     showErrorToast('Operation failed');
   }
   ```

3. **Debounce Search**
   ```tsx
   const debouncedSearch = useMemo(
     () => debounce((query) => setSearchQuery(query), 300),
     []
   );
   ```

---

## ⚠️ Common Issues & Solutions

### Issue: Duplicate Applications

**Solution:**
```typescript
// Backend validates no duplicate pending applications
// Frontend should check before submitting
if (hasPendingApplication) {
  showWarning('You already have a pending application');
  return;
}
```

### Issue: No Available Rooms

**Solution:**
```typescript
// Auto-add to waiting list
const result = await approveApplication(id);
if (result.waiting_list) {
  showMessage(`Added to waiting list at position ${result.position}`);
}
```

### Issue: Room Over-assignment

**Solution:**
```typescript
// Always check availability before assignment
const availability = await getRoomAvailability(roomId);
if (!availability.available_spaces) {
  showError('Room is full');
  return;
}
```

---

## 📊 Workflow Examples

### Student Application Workflow

1. Student submits application
2. Status set to PENDING
3. Admin reviews application
4. If approved → Room assigned automatically
5. If rejected → Reason provided
6. If no space → Added to waiting list
7. Student notified of decision

### Admin Approval Workflow

1. Navigate to Applications tab
2. Filter by "Pending" status
3. Review each application
4. Click "Approve" or "Reject"
5. If approving, optionally specify room
6. System assigns room if not specified
7. Update reflected immediately

### Waiting List Processing

1. Room becomes available (cancellation/check-out)
2. Admin clicks "Process Waiting List"
3. System assigns first student in line
4. Application status updated to APPROVED
5. Remaining positions adjusted
6. Notifications sent

---

## 🎯 Key Metrics to Watch

### Daily Metrics
- Available spaces count
- Pending applications count
- New applications

### Weekly Metrics
- Occupancy rate trends
- Application processing time
- Waiting list movement

### Monthly Metrics
- Total accommodation revenue
- Room turnover rate
- Satisfaction scores (future feature)

---

## 📞 Support

### Getting Help
1. Check this quick reference
2. Review full documentation
3. Inspect browser console
4. Verify API endpoints
5. Contact system admin

### Related Documentation
- **STAGE_10_ACCOMMODATION_COMPLETE.md** - Full technical docs
- **backend/ACCOMMODATION_SYSTEM_COMPLETE.md** - Backend implementation
- **API Reference** - accommodationApi.ts methods

---

**Last Updated**: 2026-03-06  
**Version**: 1.0  
**Stage**: 10 Complete ✅

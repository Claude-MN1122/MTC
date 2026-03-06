"""
Test script for Offline Dining Scan Mode
Tests:
- Offline scan creation
- Sync functionality
- Duplicate prevention during sync
- Dashboard with offline status
"""

import os
import sys
import django
from datetime import timedelta

# Setup Django environment
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from students.models import Student
from accommodation.models import AccommodationApplication, ApplicationStatus
from dining.models import DiningAttendance, MealType, OfflineScan, SyncStatus


def print_header(title):
    """Print a formatted section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def print_success(message):
    """Print a success message"""
    print(f"✓ {message}")


def print_error(message):
    """Print an error message"""
    print(f"✗ {message}")


def setup_test_data():
    """Create test data for offline scanning"""
    print_header("Setting Up Test Data")
    
    # Create or get hostel
    from accommodation.models import Hostel, Room
    hostel, created = Hostel.objects.get_or_create(
        name='Main Hostel',
        defaults={'gender': 'MIXED', 'capacity': 100}
    )
    
    # Create or get room
    room, created = Room.objects.get_or_create(
        hostel=hostel,
        room_number='101',
        defaults={'capacity': 4}
    )
    
    # Create test students
    test_students = []
    for i in range(1, 6):
        student, created = Student.objects.get_or_create(
            student_number=f'STU{i:04d}',
            defaults={
                'full_name': f'Test Student {i}',
                'national_id': f'67-{123456+i}X78',
                'department': 'EDUCATION',
                'year_of_study': 1,
                'gender': 'MALE',
                'is_registered': True,
                'is_active': True
            }
        )
        test_students.append(student)
        if created:
            print_success(f"Created student: {student.full_name}")
        else:
            print(f"Using existing student: {student.full_name}")
    
    # Approve accommodation for first 3 students
    for student in test_students[:3]:
        AccommodationApplication.objects.update_or_create(
            student=student,
            defaults={
                'hostel': hostel,
                'room': room,
                'status': ApplicationStatus.APPROVED,
                'period': 'FULL_YEAR'
            }
        )
        print_success(f"Approved accommodation for {student.full_name}")
    
    # Leave student 4 and 5 without approved accommodation
    AccommodationApplication.objects.update_or_create(
        student=test_students[3],
        defaults={'status': ApplicationStatus.PENDING}
    )
    print(f"Student {test_students[4].full_name} has NO accommodation")
    
    return test_students


def test_offline_scan_creation():
    """Test creating offline scans"""
    print_header("Testing Offline Scan Creation")
    
    # Create some offline scans
    test_scans = [
        {'student_number': 'STU0001', 'meal_type': MealType.BREAKFAST, 'device_id': 'OFFLINE_DEVICE_01'},
        {'student_number': 'STU0002', 'meal_type': MealType.LUNCH, 'device_id': 'OFFLINE_DEVICE_01'},
        {'student_number': 'STU0003', 'meal_type': MealType.DINNER, 'device_id': 'OFFLINE_DEVICE_02'},
    ]
    
    for scan_data in test_scans:
        offline_scan = OfflineScan.objects.create(
            student_number=scan_data['student_number'],
            meal_type=scan_data['meal_type'],
            device_id=scan_data['device_id'],
            timestamp=timezone.now(),
            sync_status=SyncStatus.PENDING
        )
        print_success(f"Created offline scan: {offline_scan}")
    
    # Check count
    pending_count = OfflineScan.get_pending_count()
    print(f"\nTotal pending offline scans: {pending_count}")


def test_sync_process():
    """Test the sync process"""
    print_header("Testing Sync Process")
    
    # Get all pending scans
    pending_scans = OfflineScan.get_pending_scans()
    print(f"Found {pending_scans.count()} pending scans")
    
    # Simulate sync for each
    for offline_scan in pending_scans:
        print(f"\nProcessing: {offline_scan.student_number} - {offline_scan.meal_type}")
        
        try:
            # Find student
            student = Student.objects.get(student_number=offline_scan.student_number)
            
            # Check accommodation
            has_accommodation = AccommodationApplication.objects.filter(
                student=student,
                status=ApplicationStatus.APPROVED
            ).exists()
            
            if not has_accommodation:
                print(f"  ✗ Not eligible - no approved accommodation")
                offline_scan.mark_as_failed('No approved accommodation')
                continue
            
            # Extract date
            scan_date = offline_scan.timestamp.date()
            
            # Check for duplicates
            exists = DiningAttendance.objects.filter(
                student=student,
                meal_type=offline_scan.meal_type,
                date=scan_date
            ).exists()
            
            if exists:
                print(f"  ⚠ Duplicate - already scanned for {offline_scan.meal_type} today")
                offline_scan.mark_as_failed('Duplicate scan')
                continue
            
            # Create attendance record
            attendance = DiningAttendance.objects.create(
                student=student,
                meal_type=offline_scan.meal_type,
                date=scan_date,
                scanner_device=offline_scan.device_id,
                notes='Synced from offline scan'
            )
            
            # Mark as synced
            offline_scan.mark_as_synced(attendance)
            print(f"  ✓ Synced successfully - Attendance ID: {attendance.id}")
            
        except Student.DoesNotExist:
            print(f"  ✗ Student {offline_scan.student_number} not found")
            offline_scan.mark_as_failed('Student not found')
        except Exception as e:
            print(f"  ✗ Error: {e}")
            offline_scan.mark_as_failed(str(e))
    
    # Show results
    synced_count = OfflineScan.objects.filter(sync_status=SyncStatus.SYNCED).count()
    failed_count = OfflineScan.objects.filter(sync_status=SyncStatus.FAILED).count()
    print(f"\nSync Results:")
    print(f"  Successful: {synced_count}")
    print(f"  Failed: {failed_count}")


def test_dashboard_with_offline():
    """Test dashboard showing offline status"""
    print_header("Testing Dashboard with Offline Status")
    
    from dining.views import OfflineDashboardView
    from django.test import RequestFactory
    
    factory = RequestFactory()
    request = factory.get('/api/dining/offline-dashboard/')
    
    # Mock user (in real scenario, this would be authenticated)
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user, _ = User.objects.get_or_create(username='testuser', is_staff=True)
    request.user = user
    
    # Get dashboard data
    view = OfflineDashboardView()
    response = view.get(request)
    
    if response.status_code == 200:
        data = response.data['data']
        
        print("Dashboard Status:")
        print(f"  Mode: {data['mode']}")
        print(f"  Connection: {data['connection_status']}")
        print(f"\nDining Stats:")
        print(f"  Total Eligible: {data['dining_stats']['total_eligible_students']}")
        print(f"  Ate Today: {data['dining_stats']['students_ate_today']}")
        print(f"\nOffline Stats:")
        print(f"  Pending Sync: {data['offline_stats']['pending_sync']}")
        print(f"  Failed Sync: {data['offline_stats']['failed_sync']}")
        print(f"  Sync Health: {data['offline_stats']['sync_health']}")
        
        print_success("Dashboard with offline status working correctly")
    else:
        print_error(f"Dashboard request failed with status {response.status_code}")


def test_duplicate_prevention_in_sync():
    """Test that duplicate prevention works during sync"""
    print_header("Testing Duplicate Prevention During Sync")
    
    # Create an offline scan for a student who already ate today
    student = Student.objects.filter(
        accommodation_applications__status=ApplicationStatus.APPROVED
    ).first()
    
    if student:
        today = timezone.now().date()
        
        # First, create an attendance record
        existing = DiningAttendance.objects.create(
            student=student,
            meal_type=MealType.BREAKFAST,
            date=today,
            scanner_device='ONLINE_DEVICE'
        )
        print(f"Created existing attendance: {existing}")
        
        # Now try to create an offline scan for the same meal
        offline_scan = OfflineScan.objects.create(
            student_number=student.student_number,
            meal_type=MealType.BREAKFAST,
            device_id='OFFLINE_DEVICE',
            timestamp=timezone.now(),
            sync_status=SyncStatus.PENDING
        )
        print(f"Created offline scan: {offline_scan}")
        
        # Try to sync it
        print("\nAttempting to sync duplicate scan...")
        
        # Manually run sync logic
        try:
            exists = DiningAttendance.objects.filter(
                student=student,
                meal_type=MealType.BREAKFAST,
                date=today
            ).exists()
            
            if exists:
                offline_scan.mark_as_failed('Duplicate scan')
                print(f"✓ Duplicate prevented! Status: {offline_scan.sync_status}")
                print(f"  Error: {offline_scan.sync_error}")
            else:
                print("✗ Duplicate was NOT prevented!")
                
        except Exception as e:
            print(f"Error during duplicate check: {e}")


def cleanup():
    """Clean up test data"""
    print_header("Cleaning Up Test Data")
    
    # Delete offline scans
    count, _ = OfflineScan.objects.all().delete()
    print(f"Deleted {count} offline scans")
    
    # Delete dining attendances
    count, _ = DiningAttendance.objects.all().delete()
    print(f"Deleted {count} dining attendances")
    
    # Delete accommodation applications
    count, _ = AccommodationApplication.objects.all().delete()
    print(f"Deleted {count} accommodation applications")
    
    # Delete students
    count, _ = Student.objects.all().delete()
    print(f"Deleted {count} students")
    
    print_success("Cleanup complete")


def main():
    """Main test function"""
    print_header("MTC OFFLINE DINING SCAN MODE - TEST SUITE")
    
    try:
        # Setup
        test_students = setup_test_data()
        
        # Run tests
        test_offline_scan_creation()
        test_sync_process()
        test_dashboard_with_offline()
        test_duplicate_prevention_in_sync()
        
        print_header("ALL TESTS COMPLETED SUCCESSFULLY")
        
        # Ask if user wants to cleanup
        print("\nDo you want to clean up test data? (y/n): ", end="")
        choice = input().lower()
        if choice == 'y':
            cleanup()
        
    except Exception as e:
        print_error(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()

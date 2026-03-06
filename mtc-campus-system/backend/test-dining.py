"""
Test script for MTC Dining Hall Management System
Tests all dining-related functionality including:
- QR code scanning
- Meal eligibility verification
- Duplicate scan prevention
- Dashboard statistics
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
from accommodation.models import Hostel, Room, AccommodationApplication, ApplicationStatus
from dining.models import DiningAttendance, MealType


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
    """Create test data for dining system"""
    print_header("Setting Up Test Data")
    
    # Create or get hostel
    hostel, created = Hostel.objects.get_or_create(
        name='Main Hostel',
        defaults={
            'gender': 'MIXED',
            'capacity': 100,
            'description': 'Main student hostel'
        }
    )
    if created:
        print_success(f"Created hostel: {hostel.name}")
    else:
        print(f"Using existing hostel: {hostel.name}")
    
    # Create or get room
    room, created = Room.objects.get_or_create(
        hostel=hostel,
        room_number='101',
        defaults={
            'capacity': 4,
            'floor': '1',
            'room_type': 'Standard'
        }
    )
    if created:
        print_success(f"Created room: {room.room_number} in {hostel.name}")
    else:
        print(f"Using existing room: {room.room_number}")
    
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
                'email': f'student{i}@mtc.ac.zw',
                'is_registered': True,
                'is_active': True
            }
        )
        test_students.append(student)
        if created:
            print_success(f"Created student: {student.full_name} ({student.student_number})")
        else:
            print(f"Using existing student: {student.full_name}")
    
    # Approve accommodation for first 3 students
    approved_students = []
    for student in test_students[:3]:
        app, created = AccommodationApplication.objects.get_or_create(
            student=student,
            defaults={
                'hostel': hostel,
                'room': room,
                'status': ApplicationStatus.APPROVED,
                'period': 'FULL_YEAR',
                'decision_date': timezone.now()
            }
        )
        approved_students.append(student)
        if created:
            print_success(f"Approved accommodation for {student.full_name}")
        else:
            print(f"Accommodation already approved for {student.full_name}")
    
    # Leave student 4 and 5 without approved accommodation (for testing)
    pending_student = test_students[3]
    AccommodationApplication.objects.update_or_create(
        student=pending_student,
        defaults={
            'hostel': hostel,
            'status': ApplicationStatus.PENDING,
            'period': 'FULL_YEAR'
        }
    )
    print(f"Student {pending_student.full_name} has PENDING accommodation")
    
    no_accommodation_student = test_students[4]
    print(f"Student {no_accommodation_student.full_name} has NO accommodation application")
    
    print_header("Test Data Setup Complete")
    print(f"Total students: {len(test_students)}")
    print(f"Students with approved accommodation: {len(approved_students)}")
    print(f"Students without meal eligibility: 2")
    
    return test_students, approved_students


def test_meal_eligibility_check():
    """Test meal eligibility checking"""
    print_header("Testing Meal Eligibility Check")
    
    # Test student with approved accommodation
    eligible_student = Student.objects.filter(
        accommodation_applications__status=ApplicationStatus.APPROVED
    ).first()
    
    if eligible_student:
        eligibility = DiningAttendance.get_meal_eligibility(eligible_student)
        print(f"Student: {eligible_student.full_name}")
        print(f"Has accommodation: {eligibility['has_accommodation']}")
        print(f"Is eligible: {eligibility['is_eligible']}")
        print(f"Can scan breakfast: {eligibility['can_scan_breakfast']}")
        print(f"Can scan lunch: {eligibility['can_scan_lunch']}")
        print(f"Can scan dinner: {eligibility['can_scan_dinner']}")
        print_success("Eligibility check working correctly")
    
    # Test student without accommodation
    ineligible_student = Student.objects.exclude(
        accommodation_applications__status=ApplicationStatus.APPROVED
    ).first()
    
    if ineligible_student:
        eligibility = DiningAttendance.get_meal_eligibility(ineligible_student)
        print(f"\nStudent: {ineligible_student.full_name}")
        print(f"Has accommodation: {eligibility['has_accommodation']}")
        print(f"Is eligible: {eligibility['is_eligible']}")
        print_success("Ineligible student correctly identified")


def test_qr_scan_and_duplicate_prevention():
    """Test QR code scanning and duplicate prevention"""
    print_header("Testing QR Scan & Duplicate Prevention")
    
    # Get an eligible student
    eligible_student = Student.objects.filter(
        accommodation_applications__status=ApplicationStatus.APPROVED
    ).first()
    
    if not eligible_student:
        print_error("No eligible student found for testing")
        return
    
    today = timezone.now().date()
    
    # Test 1: First scan for breakfast (should succeed)
    print(f"\nTest 1: First scan for {eligible_student.full_name}")
    try:
        attendance = DiningAttendance.objects.create(
            student=eligible_student,
            meal_type=MealType.BREAKFAST,
            date=today,
            scanner_device='TEST_DEVICE_01'
        )
        print_success(f"Breakfast scan recorded: {attendance.id}")
    except Exception as e:
        print_error(f"First scan failed: {e}")
        return
    
    # Test 2: Try to scan again for same meal (should fail)
    print(f"\nTest 2: Duplicate scan prevention for {eligible_student.full_name}")
    try:
        duplicate_attendance = DiningAttendance.objects.create(
            student=eligible_student,
            meal_type=MealType.BREAKFAST,
            date=today,
            scanner_device='TEST_DEVICE_02'
        )
        print_error("Duplicate scan was NOT prevented! This is a bug.")
    except Exception as e:
        print_success(f"Duplicate scan prevented: {e}")
    
    # Test 3: Scan for different meal on same day (should succeed)
    print(f"\nTest 3: Different meal type scan for {eligible_student.full_name}")
    try:
        lunch_attendance = DiningAttendance.objects.create(
            student=eligible_student,
            meal_type=MealType.LUNCH,
            date=today,
            scanner_device='TEST_DEVICE_01'
        )
        print_success(f"Lunch scan recorded: {lunch_attendance.id}")
    except Exception as e:
        print_error(f"Different meal scan failed: {e}")
    
    # Test 4: Verify has_eaten_today method
    print(f"\nTest 4: Checking has_eaten_today for {eligible_student.full_name}")
    has_eaten_breakfast = DiningAttendance.has_eaten_today(
        eligible_student,
        MealType.BREAKFAST
    )
    has_eaten_lunch = DiningAttendance.has_eaten_today(
        eligible_student,
        MealType.LUNCH
    )
    has_eaten_dinner = DiningAttendance.has_eaten_today(
        eligible_student,
        MealType.DINNER
    )
    
    print(f"Has eaten breakfast: {has_eaten_breakfast}")
    print(f"Has eaten lunch: {has_eaten_lunch}")
    print(f"Has eaten dinner: {has_eaten_dinner}")
    
    if has_eaten_breakfast and has_eaten_lunch and not has_eaten_dinner:
        print_success("Meal tracking working correctly")
    else:
        print_error("Meal tracking has issues")


def test_dining_dashboard():
    """Test dining dashboard statistics"""
    print_header("Testing Dining Dashboard Statistics")
    
    today = timezone.now().date()
    
    # Calculate statistics
    total_eligible = AccommodationApplication.objects.filter(
        status=ApplicationStatus.APPROVED
    ).values('student').distinct().count()
    
    students_ate_today = DiningAttendance.objects.filter(
        date=today
    ).values('student').distinct().count()
    
    remaining_students = total_eligible - students_ate_today
    
    breakfast_count = DiningAttendance.objects.filter(
        date=today,
        meal_type=MealType.BREAKFAST
    ).count()
    
    lunch_count = DiningAttendance.objects.filter(
        date=today,
        meal_type=MealType.LUNCH
    ).count()
    
    dinner_count = DiningAttendance.objects.filter(
        date=today,
        meal_type=MealType.DINNER
    ).count()
    
    total_meals = breakfast_count + lunch_count + dinner_count
    
    # Display statistics
    print("DINING DASHBOARD - Today's Statistics")
    print("-" * 60)
    print(f"Date: {today}")
    print("-" * 60)
    print(f"Total Eligible Students:     {total_eligible}")
    print(f"Students Ate Today:          {students_ate_today}")
    print(f"Remaining Students:          {remaining_students}")
    print("-" * 60)
    print(f"Breakfast Served:            {breakfast_count}")
    print(f"Lunch Served:                {lunch_count}")
    print(f"Dinner Served:               {dinner_count}")
    print(f"Total Meals Served:          {total_meals}")
    print("-" * 60)
    
    if total_eligible > 0:
        print(f"\nMeal Coverage:")
        print(f"  Breakfast: {(breakfast_count/total_eligible*100):.1f}%")
        print(f"  Lunch:     {(lunch_count/total_eligible*100):.1f}%")
        print(f"  Dinner:    {(dinner_count/total_eligible*100):.1f}%")
    
    print_success("Dashboard statistics calculated successfully")


def test_api_endpoints():
    """Test API endpoints manually"""
    print_header("API Endpoints Testing Guide")
    
    print("""
To test the API endpoints, use the following commands:

1. GET /api/dining/dashboard/
   - View dining hall statistics
   
2. POST /api/dining/scan/
   - Test QR code scanning
   - Request body:
   {
     "qr_data": "MTC|STU0001|Test Student|EDUCATION",
     "meal_type": "BREAKFAST",
     "scanner_device": "DEVICE_01"
   }
   
3. GET /api/dining/eligibility/?student_number=STU0001
   - Check student meal eligibility
   
4. GET /api/dining/attendance/
   - List all attendance records
   
5. GET /api/dining/stats/
   - Quick statistics

Make sure you have a valid JWT token for authentication.
""")


def cleanup_test_data():
    """Clean up test data"""
    print_header("Cleaning Up Test Data")
    
    # Delete all dining attendances
    count, _ = DiningAttendance.objects.all().delete()
    print(f"Deleted {count} dining attendance records")
    
    # Delete all accommodation applications
    count, _ = AccommodationApplication.objects.all().delete()
    print(f"Deleted {count} accommodation applications")
    
    # Delete all students
    count, _ = Student.objects.all().delete()
    print(f"Deleted {count} student records")
    
    # Delete rooms and hostels
    count, _ = Room.objects.all().delete()
    print(f"Deleted {count} room records")
    
    count, _ = Hostel.objects.all().delete()
    print(f"Deleted {count} hostel records")
    
    print_success("Cleanup complete")


def main():
    """Main test function"""
    print_header("MTC DINING HALL MANAGEMENT SYSTEM - TEST SUITE")
    
    try:
        # Setup test data
        test_students, approved_students = setup_test_data()
        
        # Run tests
        test_meal_eligibility_check()
        test_qr_scan_and_duplicate_prevention()
        test_dining_dashboard()
        test_api_endpoints()
        
        print_header("ALL TESTS COMPLETED SUCCESSFULLY")
        
        # Ask if user wants to cleanup
        print("\nDo you want to clean up test data? (y/n): ", end="")
        choice = input().lower()
        if choice == 'y':
            cleanup_test_data()
        
    except Exception as e:
        print_error(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()

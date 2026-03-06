"""
Test script for Student QR Code Generation
This script tests creating a student and verifying QR code generation.
"""

import os
import sys
import django

# Add apps directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps'))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from students.models import Student, Department, Gender, YearOfStudy


def test_qr_code_generation():
    """Test QR code generation by creating a sample student"""
    
    print("=" * 60)
    print("Testing Student QR Code Generation")
    print("=" * 60)
    
    # Clean up any existing test students
    Student.objects.filter(student_number='TEST2024001').delete()
    print("✓ Cleaned up existing test data")
    
    # Create a test student
    print("\nCreating test student...")
    student = Student.objects.create(
        student_number='TEST2024001',
        full_name='John Doe Test',
        national_id='67-123456X78',
        department=Department.EDUCATION,
        year_of_study=YearOfStudy.YEAR_1,
        gender=Gender.MALE,
        email='john.doe@test.com',
        phone_number='+263771234567',
        is_registered=True,
        is_active=True
    )
    
    print(f"✓ Created student: {student.student_number} - {student.full_name}")
    
    # Check if QR code was generated
    print("\nChecking QR code generation...")
    if student.qr_code:
        print(f"✓ QR code generated successfully!")
        print(f"  File path: {student.qr_code.path}")
        print(f"  URL: {student.qr_code.url}")
        
        # Verify file exists
        if os.path.exists(student.qr_code.path):
            file_size = os.path.getsize(student.qr_code.path)
            print(f"  File size: {file_size} bytes")
            print(f"✓ QR code file exists on disk")
        else:
            print(f"✗ ERROR: QR code file not found at {student.qr_code.path}")
    else:
        print("✗ ERROR: QR code was not generated!")
    
    # Test QR code data
    print("\nQR Code Data:")
    print(f"  Student Number: {student.student_number}")
    print(f"  Full Name: {student.full_name}")
    print(f"  Department: {student.department}")
    print(f"  Institution: Mutare Teachers College")
    
    # Test properties
    print("\nStudent Properties:")
    print(f"  Has Photo: {student.has_photo}")
    print(f"  Has QR Code: {student.has_qr_code}")
    print(f"  ID Card Ready: {student.id_card_ready}")
    
    # Test updating student number (should regenerate QR)
    print("\nTesting QR code regeneration on student number change...")
    old_qr_path = student.qr_code.path if student.qr_code else None
    student.student_number = 'TEST2024002'
    student.save()
    
    print(f"  Changed student number to: {student.student_number}")
    
    # Refresh from database
    student.refresh_from_db()
    
    if student.qr_code:
        new_qr_path = student.qr_code.path
        print(f"✓ New QR code generated: {new_qr_path}")
        
        if old_qr_path and os.path.exists(old_qr_path):
            print(f"  Old QR code still exists: {old_qr_path}")
        else:
            print(f"  Old QR code was cleaned up")
    
    # Clean up
    print("\nCleaning up test data...")
    student.delete()
    print("✓ Test student deleted")
    
    print("\n" + "=" * 60)
    print("QR Code Generation Test Complete!")
    print("=" * 60)


if __name__ == '__main__':
    test_qr_code_generation()

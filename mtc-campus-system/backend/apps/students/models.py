import os
import qrcode
from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile
from django.utils.text import slugify
from PIL import Image


class Gender(models.TextChoices):
    """Gender choices for students"""
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'
    OTHER = 'OTHER', 'Other'


class YearOfStudy(models.IntegerChoices):
    """Year of study choices"""
    YEAR_1 = 1, 'First Year'
    YEAR_2 = 2, 'Second Year'
    YEAR_3 = 3, 'Third Year'
    YEAR_4 = 4, 'Fourth Year'
    POSTGRADUATE = 5, 'Postgraduate'


class Department(models.TextChoices):
    """Academic departments at MTC"""
    EDUCATION = 'EDUCATION', 'Education'
    SCIENCES = 'SCIENCES', 'Sciences'
    ARTS = 'ARTS', 'Arts & Humanities'
    COMMERCE = 'COMMERCE', 'Commerce'
    AGRICULTURE = 'AGRICULTURE', 'Agriculture'
    VOCATIONAL = 'VOCATIONAL', 'Vocational Studies'


class Student(models.Model):
    """
    Student model for MTC Campus Management System.
    Represents a registered student with ID card information.
    """
    
    student_number = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique student identification number"
    )
    full_name = models.CharField(
        max_length=255,
        help_text="Student's full name as it appears on official documents"
    )
    national_id = models.CharField(
        max_length=50,
        unique=True,
        help_text="National ID number (e.g., 67-123456X78)"
    )
    department = models.CharField(
        max_length=50,
        choices=Department.choices,
        help_text="Academic department"
    )
    year_of_study = models.IntegerField(
        choices=YearOfStudy.choices,
        default=YearOfStudy.YEAR_1,
        help_text="Current year of study"
    )
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        help_text="Student's gender"
    )
    photo = models.ImageField(
        upload_to='student_photos/',
        blank=True,
        null=True,
        help_text="Student's passport-style photograph"
    )
    qr_code = models.ImageField(
        upload_to='qr_codes/',
        blank=True,
        null=True,
        editable=False,
        help_text="Auto-generated QR code containing student number"
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text="Date of birth"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        help_text="Student's email address"
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Contact phone number"
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text="Physical address"
    )
    next_of_kin_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Next of kin full name"
    )
    next_of_kin_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Next of kin contact number"
    )
    next_of_kin_relationship = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Relationship to next of kin"
    )
    
    # Status fields
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the student is currently active"
    )
    is_registered = models.BooleanField(
        default=False,
        help_text="Whether the student has completed registration"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the student record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time when the student record was last updated"
    )
    
    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student_number']),
            models.Index(fields=['national_id']),
            models.Index(fields=['department']),
            models.Index(fields=['year_of_study']),
        ]
    
    def __str__(self):
        return f"{self.student_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to generate QR code automatically.
        QR code is generated when:
        1. New student is created
        2. Student number changes
        """
        generate_qr = False
        
        # Check if this is a new record or if student_number changed
        if not self.pk:
            # New record
            generate_qr = True
        else:
            # Existing record - check if student_number changed
            try:
                old_record = Student.objects.get(pk=self.pk)
                if old_record.student_number != self.student_number:
                    generate_qr = True
                    # Delete old QR code if exists
                    if old_record.qr_code:
                        old_record.qr_code.delete(save=False)
            except Student.DoesNotExist:
                generate_qr = True
        
        # Save the student record first (without QR)
        super().save(*args, **kwargs)
        
        # Generate QR code if needed
        if generate_qr and self.student_number:
            self.generate_qr_code()
            # Save again to store QR code (don't force insert this time)
            kwargs.pop('force_insert', None)  # Remove force_insert if present
            super().save(update_fields=['qr_code'], *args, **kwargs)
    
    def generate_qr_code(self):
        """
        Generate QR code containing student number.
        QR code includes:
        - Student number
        - Full name
        - Department
        """
        if not self.student_number:
            return
        
        # Create QR code data
        qr_data = {
            'student_number': self.student_number,
            'full_name': self.full_name,
            'department': self.get_department_display(),
            'institution': 'Mutare Teachers College'
        }
        
        # Convert to string format for QR code
        qr_string = f"MTC|{self.student_number}|{self.full_name}|{self.department}"
        
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,  # Smallest size
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction
            box_size=10,
            border=4,
        )
        
        # Add data to QR code
        qr.add_data(qr_string)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes and save to file
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Generate filename
        filename = f"qr_{slugify(self.student_number)}.png"
        
        # Save to file field
        self.qr_code.save(
            filename,
            ContentFile(buffer.getvalue()),
            save=False
        )
        
        buffer.close()
    
    def get_student_number(self):
        """Return formatted student number"""
        return self.student_number
    
    def get_full_name(self):
        """Return student's full name"""
        return self.full_name
    
    def get_department_display_short(self):
        """Return short department name"""
        return self.department
    
    @property
    def has_photo(self):
        """Check if student has uploaded a photo"""
        return bool(self.photo)
    
    @property
    def has_qr_code(self):
        """Check if QR code has been generated"""
        return bool(self.qr_code)
    
    @property
    def id_card_ready(self):
        """Check if student has all requirements for ID card"""
        return self.has_photo and self.has_qr_code and self.is_registered

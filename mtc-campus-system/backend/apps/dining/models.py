from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from students.models import Student


class MealType(models.TextChoices):
    """Meal type choices"""
    BREAKFAST = 'BREAKFAST', 'Breakfast'
    LUNCH = 'LUNCH', 'Lunch'
    DINNER = 'DINNER', 'Dinner'


class SyncStatus(models.TextChoices):
    """Sync status choices for offline scans"""
    PENDING = 'PENDING', 'Pending Sync'
    SYNCING = 'SYNCING', 'Syncing...'
    SYNCED = 'SYNCED', 'Synced'
    FAILED = 'FAILED', 'Sync Failed'


class OfflineScan(models.Model):
    """
    Offline Scan model for storing scans when network is unavailable.
    These records are synced to the server when connection is restored.
    """
    
    student_number = models.CharField(
        max_length=20,
        help_text="Student number (stored for offline operation)"
    )
    meal_type = models.CharField(
        max_length=20,
        choices=MealType.choices,
        help_text="Type of meal"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when scan was recorded offline"
    )
    device_id = models.CharField(
        max_length=100,
        help_text="Device identifier that recorded the scan"
    )
    sync_status = models.CharField(
        max_length=20,
        choices=SyncStatus.choices,
        default=SyncStatus.PENDING,
        help_text="Current sync status"
    )
    sync_attempts = models.IntegerField(
        default=0,
        help_text="Number of sync attempts"
    )
    last_sync_attempt = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Last sync attempt timestamp"
    )
    sync_error = models.TextField(
        blank=True,
        null=True,
        help_text="Error message from last sync attempt"
    )
    attendance_record = models.ForeignKey(
        'DiningAttendance',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='offline_scan_source',
        help_text="Linked attendance record after successful sync"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the offline scan was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time when the offline scan was last updated"
    )
    
    class Meta:
        db_table = 'offline_scans'
        verbose_name = 'Offline Scan'
        verbose_name_plural = 'Offline Scans'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sync_status']),
            models.Index(fields=['student_number']),
            models.Index(fields=['meal_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.student_number} - {self.get_meal_type_display()} ({self.get_sync_status_display()})"
    
    def mark_as_syncing(self):
        """Mark the offline scan as being synced"""
        self.sync_status = SyncStatus.SYNCING
        self.sync_attempts += 1
        self.last_sync_attempt = timezone.now()
        self.save(update_fields=['sync_status', 'sync_attempts', 'last_sync_attempt'])
    
    def mark_as_synced(self, attendance_record):
        """Mark the offline scan as successfully synced"""
        self.sync_status = SyncStatus.SYNCED
        self.attendance_record = attendance_record
        self.save(update_fields=['sync_status', 'attendance_record'])
    
    def mark_as_failed(self, error_message):
        """Mark the offline scan as failed"""
        self.sync_status = SyncStatus.FAILED
        self.sync_error = error_message
        self.sync_attempts += 1
        self.last_sync_attempt = timezone.now()
        self.save(update_fields=['sync_status', 'sync_error', 'sync_attempts', 'last_sync_attempt'])
    
    @classmethod
    def get_pending_scans(cls):
        """Get all pending offline scans"""
        return cls.objects.filter(sync_status=SyncStatus.PENDING).order_by('created_at')
    
    @classmethod
    def get_pending_count(cls):
        """Get count of pending offline scans"""
        return cls.objects.filter(sync_status=SyncStatus.PENDING).count()


class DiningAttendance(models.Model):
    """
    Dining Hall Attendance model for MTC Campus Management System.
    Tracks student meal attendance through QR code scanning.
    """
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='dining_attendances',
        help_text="Student who attended the meal"
    )
    meal_type = models.CharField(
        max_length=20,
        choices=MealType.choices,
        help_text="Type of meal (breakfast, lunch, dinner)"
    )
    date = models.DateField(
        help_text="Date of the meal"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the attendance was recorded"
    )
    scanner_device = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Scanner device identifier (e.g., device ID, terminal name)"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes or special dietary requirements"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time when the record was last updated"
    )
    
    class Meta:
        db_table = 'dining_attendances'
        verbose_name = 'Dining Attendance'
        verbose_name_plural = 'Dining Attendances'
        ordering = ['-timestamp']
        unique_together = ['student', 'meal_type', 'date']
        indexes = [
            models.Index(fields=['student', 'meal_type', 'date']),
            models.Index(fields=['date', 'meal_type']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.student.full_name} - {self.get_meal_type_display()} on {self.date}"
    
    def clean(self):
        """Validate dining attendance data"""
        # Prevent duplicate scans for the same meal
        if not self.pk and DiningAttendance.objects.filter(
            student=self.student,
            meal_type=self.meal_type,
            date=self.date
        ).exists():
            raise ValidationError({
                'student': f'Already scanned for {self.get_meal_type_display()} on {self.date}'
            })
    
    def save(self, *args, **kwargs):
        """Override save to ensure date is set if not provided"""
        if not self.date:
            self.date = timezone.now().date()
        super().save(*args, **kwargs)
    
    @classmethod
    def has_eaten_today(cls, student, meal_type=None):
        """
        Check if a student has eaten today (optionally for a specific meal type).
        
        Args:
            student: Student instance or ID
            meal_type: Optional meal type (if None, checks any meal)
        
        Returns:
            bool: True if student has eaten, False otherwise
        """
        today = timezone.now().date()
        queryset = cls.objects.filter(student=student, date=today)
        
        if meal_type:
            queryset = queryset.filter(meal_type=meal_type)
        
        return queryset.exists()
    
    @classmethod
    def get_meal_eligibility(cls, student):
        """
        Get meal eligibility for a student.
        
        Args:
            student: Student instance or ID
        
        Returns:
            dict: Dictionary with eligibility status for each meal type
        """
        from accommodation.models import AccommodationApplication, ApplicationStatus
        
        today = timezone.now().date()
        
        # Check if student has approved accommodation
        has_accommodation = AccommodationApplication.objects.filter(
            student=student,
            status=ApplicationStatus.APPROVED
        ).exists()
        
        # Get meals already consumed today
        meals_consumed = {}
        for meal_choice in MealType.choices:
            meal_key = meal_choice[0].lower()
            meals_consumed[meal_key] = cls.objects.filter(
                student=student,
                meal_type=meal_choice[0],
                date=today
            ).exists()
        
        return {
            'is_eligible': has_accommodation,
            'has_accommodation': has_accommodation,
            'meals_consumed': meals_consumed,
            'can_scan_breakfast': has_accommodation and not meals_consumed.get('breakfast', False),
            'can_scan_lunch': has_accommodation and not meals_consumed.get('lunch', False),
            'can_scan_dinner': has_accommodation and not meals_consumed.get('dinner', False),
        }

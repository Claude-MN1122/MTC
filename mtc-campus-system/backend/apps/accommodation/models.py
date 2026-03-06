from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Count, Q, F
from students.models import Student


class Gender(models.TextChoices):
    """Gender choices for hostels"""
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'
    MIXED = 'MIXED', 'Mixed'


class ApplicationStatus(models.TextChoices):
    """Application status choices"""
    PENDING = 'PENDING', 'Pending Review'
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'
    WAITING_LIST = 'WAITING_LIST', 'Waiting List'
    CANCELLED = 'CANCELLED', 'Cancelled'


class AccommodationPeriod(models.TextChoices):
    """Accommodation period choices"""
    SEMESTER_1 = 'SEMESTER_1', 'Semester 1'
    SEMESTER_2 = 'SEMESTER_2', 'Semester 2'
    FULL_YEAR = 'FULL_YEAR', 'Full Academic Year'
    SHORT_TERM = 'SHORT_TERM', 'Short Term'


class Hostel(models.Model):
    """
    Hostel model representing residence halls at MTC.
    Each hostel has a gender designation and total capacity.
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Name of the hostel (e.g., 'Main Hostel', 'Girls Hostel')"
    )
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        default=Gender.MIXED,
        help_text="Gender designation for the hostel"
    )
    capacity = models.IntegerField(
        default=0,
        help_text="Total number of students the hostel can accommodate"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Description of the hostel facilities"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the hostel is currently in use"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date when the hostel was added to the system"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date when the hostel information was last updated"
    )
    
    class Meta:
        db_table = 'hostels'
        verbose_name = 'Hostel'
        verbose_name_plural = 'Hostels'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.get_gender_display()})"
    
    @property
    def total_rooms(self):
        """Return total number of rooms in the hostel"""
        return self.rooms.count()
    
    @property
    def occupied_spaces(self):
        """Return total occupied spaces in the hostel"""
        from django.db.models import Sum, Count
        # Count approved applications across all rooms
        total = Room.objects.filter(hostel=self).aggregate(
            total=Count('applications', filter=models.Q(applications__status=ApplicationStatus.APPROVED))
        )
        return total['total'] or 0
    
    @property
    def available_spaces(self):
        """Return available spaces in the hostel"""
        return self.capacity - self.occupied_spaces
    
    @property
    def occupancy_rate(self):
        """Return occupancy rate as percentage"""
        if self.capacity == 0:
            return 0
        return (self.occupied_spaces / self.capacity) * 100
    
    def clean(self):
        """Validate hostel data"""
        if self.capacity < 0:
            raise ValidationError({'capacity': 'Capacity cannot be negative'})


class Room(models.Model):
    """
    Room model representing individual rooms within hostels.
    Tracks room number, capacity, and current occupancy.
    """
    
    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name='rooms',
        help_text="Hostel where the room is located"
    )
    room_number = models.CharField(
        max_length=20,
        help_text="Room number/identifier (e.g., '101', 'A101')"
    )
    capacity = models.IntegerField(
        default=1,
        help_text="Maximum number of students the room can accommodate"
    )
    floor = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text="Floor level (optional)"
    )
    room_type = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Room type (e.g., 'Single', 'Double', 'Suite')"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the room is available for allocation"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date when the room was added to the system"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date when the room information was last updated"
    )
    
    class Meta:
        db_table = 'rooms'
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'
        unique_together = ['hostel', 'room_number']
        ordering = ['hostel__name', 'room_number']
        indexes = [
            models.Index(fields=['hostel', 'room_number']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.hostel.name} - Room {self.room_number}"
    
    def clean(self):
        """Validate room data"""
        if self.capacity < 1:
            raise ValidationError({'capacity': 'Room capacity must be at least 1'})
    
    @property
    def occupied_spaces(self):
        """Return number of occupied spaces in this room"""
        return self.applications.filter(
            status=ApplicationStatus.APPROVED
        ).count()
    
    @property
    def available_spaces(self):
        """Return available spaces in this room"""
        return self.capacity - self.occupied_spaces
    
    @property
    def is_full(self):
        """Check if room is at full capacity"""
        return self.occupied_spaces >= self.capacity
    
    @property
    def occupancy_rate(self):
        """Return occupancy rate as percentage"""
        if self.capacity == 0:
            return 0
        return (self.occupied_spaces / self.capacity) * 100


class AccommodationApplication(models.Model):
    """
    Accommodation application model.
    Students apply for accommodation and are assigned rooms upon approval.
    Supports waiting list functionality when hostels are full.
    """
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='accommodation_applications',
        help_text="Student applying for accommodation"
    )
    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applications',
        help_text="Preferred hostel (assigned on approval if not specified)"
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applications',
        help_text="Assigned room (set on approval)"
    )
    period = models.CharField(
        max_length=20,
        choices=AccommodationPeriod.choices,
        default=AccommodationPeriod.FULL_YEAR,
        help_text="Accommodation period"
    )
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.PENDING,
        help_text="Current application status"
    )
    application_date = models.DateField(
        auto_now_add=True,
        help_text="Date when the application was submitted"
    )
    decision_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date when the application was approved/rejected"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes or special requirements"
    )
    rejection_reason = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Reason for rejection (if applicable)"
    )
    waiting_list_position = models.IntegerField(
        default=0,
        help_text="Position on waiting list (0 if not on waiting list)"
    )
    check_in_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Actual check-in date"
    )
    check_out_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Actual check-out date"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when the application was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time when the application was last updated"
    )
    
    class Meta:
        db_table = 'accommodation_applications'
        verbose_name = 'Accommodation Application'
        verbose_name_plural = 'Accommodation Applications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['status', 'application_date']),
            models.Index(fields=['hostel', 'status']),
        ]
    
    def __str__(self):
        return f"{self.student.full_name} - {self.get_status_display()}"
    
    def clean(self):
        """Validate application data"""
        # Check for duplicate pending applications
        if not self.pk and AccommodationApplication.objects.filter(
            student=self.student,
            status=ApplicationStatus.PENDING
        ).exists():
            raise ValidationError({
                'student': 'You already have a pending accommodation application'
            })
    
    def save(self, *args, **kwargs):
        """Override save to update waiting list position"""
        if self.status == ApplicationStatus.WAITING_LIST and self.waiting_list_position == 0:
            # Auto-assign waiting list position
            self.waiting_list_position = self._get_next_waiting_list_position()
        
        super().save(*args, **kwargs)
    
    def _get_next_waiting_list_position(self):
        """Get next available position on the waiting list"""
        last_position = AccommodationApplication.objects.filter(
            status=ApplicationStatus.WAITING_LIST
        ).order_by('-waiting_list_position').values_list('waiting_list_position', flat=True).first()
        
        return (last_position or 0) + 1
    
    def approve(self, assign_hostel=None, assign_room=None):
        """
        Approve the application and assign accommodation.
        
        Args:
            assign_hostel: Preferred hostel (optional)
            assign_room: Specific room (optional, overrides hostel preference)
        
        Returns:
            tuple: (success: bool, message: str)
        """
        from django.utils import timezone
        
        # If room is specified, use it
        if assign_room:
            if assign_room.is_full:
                return False, f"Room {assign_room.room_number} is full"
            
            self.room = assign_room
            self.hostel = assign_room.hostel
        else:
            # Try to find available space in preferred hostel or any matching hostel
            target_hostel = assign_hostel or self.hostel
            
            if not target_hostel:
                # Find any hostel with available space matching student's gender
                target_hostel = self._find_available_hostel()
            
            if not target_hostel or target_hostel.available_spaces <= 0:
                # No space available, add to waiting list
                self.status = ApplicationStatus.WAITING_LIST
                self.save(update_fields=['status', 'waiting_list_position'])
                return False, "No available space. Added to waiting list."
            
            # Find available room in the hostel
            available_room = self._find_available_room(target_hostel)
            
            if not available_room:
                # Should not happen if hostel has space, but fallback to waiting list
                self.status = ApplicationStatus.WAITING_LIST
                self.save(update_fields=['status', 'waiting_list_position'])
                return False, "No available room found. Added to waiting list."
            
            self.room = available_room
            self.hostel = target_hostel
        
        # Update application
        self.status = ApplicationStatus.APPROVED
        self.decision_date = timezone.now()
        self.save(update_fields=['status', 'room', 'hostel', 'decision_date'])
        
        return True, f"Approved and assigned to {self.hostel.name}, Room {self.room.room_number}"
    
    def _find_available_hostel(self):
        """Find a hostel with available space matching student's gender"""
        # Simple implementation - find any hostel with space
        # Can be enhanced to match gender preferences
        return Hostel.objects.filter(
            is_active=True
        ).annotate(
            occupied=models.Sum('rooms__occupied_spaces')
        ).filter(
            models.Q(capacity__gt=models.F('occupied')) | models.Q(capacity__gt=0)
        ).first()
    
    def _find_available_room(self, hostel):
        """Find an available room in the specified hostel"""
        from django.db.models import Count, Q
        # Find rooms with fewer approved applications than capacity
        return Room.objects.filter(
            hostel=hostel,
            is_active=True
        ).annotate(
            occupied_count=Count('applications', filter=Q(applications__status=ApplicationStatus.APPROVED))
        ).filter(
            capacity__gt=F('occupied_count')
        ).order_by('room_number').first()
    
    def reject(self, reason=None):
        """
        Reject the application.
        
        Args:
            reason: Reason for rejection (optional)
        
        Returns:
            bool: Success
        """
        from django.utils import timezone
        
        if self.status != ApplicationStatus.PENDING:
            return False
        
        self.status = ApplicationStatus.REJECTED
        self.rejection_reason = reason
        self.decision_date = timezone.now()
        self.save(update_fields=['status', 'rejection_reason', 'decision_date'])
        
        return True
    
    def move_to_waiting_list(self):
        """Move application to waiting list"""
        if self.status in [ApplicationStatus.PENDING, ApplicationStatus.APPROVED]:
            self.status = ApplicationStatus.WAITING_LIST
            self.save(update_fields=['status'])
            return True
        return False
    
    def cancel(self):
        """Cancel the application"""
        from django.utils import timezone
        
        self.status = ApplicationStatus.CANCELLED
        self.save(update_fields=['status'])
        
        # Free up the room if assigned
        # Room will be automatically freed as this application is no longer active
    
    @classmethod
    def process_waiting_list(cls, hostel=None):
        """
        Process waiting list and assign rooms when spaces become available.
        
        Args:
            hostel: Specific hostel to process (optional, processes all if None)
        
        Returns:
            int: Number of students assigned from waiting list
        """
        queryset = cls.objects.filter(
            status=ApplicationStatus.WAITING_LIST
        ).order_by('waiting_list_position', 'application_date')
        
        if hostel:
            queryset = queryset.filter(hostel=hostel)
        
        assigned_count = 0
        
        for application in queryset:
            # Try to approve (will find available space)
            success, message = application.approve(assign_hostel=hostel)
            
            if success:
                assigned_count += 1
            else:
                # If we couldn't assign this student, stop processing
                # (likely no more spaces)
                break
        
        # Reorder waiting list after assignments
        cls._reorder_waiting_list()
        
        return assigned_count
    
    @classmethod
    def _reorder_waiting_list(cls):
        """Reorder waiting list positions after assignments"""
        waiting_list = cls.objects.filter(
            status=ApplicationStatus.WAITING_LIST
        ).order_by('application_date')
        
        for idx, application in enumerate(waiting_list, start=1):
            if application.waiting_list_position != idx:
                application.waiting_list_position = idx
                application.save(update_fields=['waiting_list_position'])

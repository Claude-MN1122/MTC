from django.contrib import admin
from .models import Hostel, Room, AccommodationApplication, ApplicationStatus


@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    """
    Admin panel for managing hostels.
    Provides overview of capacity and occupancy.
    """
    
    list_display = [
        'name',
        'gender',
        'capacity',
        'occupied_spaces',
        'available_spaces',
        'occupancy_rate_display',
        'is_active',
        'created_at',
    ]
    
    list_filter = ['gender', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'gender', 'description')
        }),
        ('Capacity', {
            'fields': ('capacity', 'is_active')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def occupied_spaces(self, obj):
        return obj.occupied_spaces
    occupied_spaces.short_description = 'Occupied'
    
    def available_spaces(self, obj):
        return obj.available_spaces
    available_spaces.short_description = 'Available'
    
    def occupancy_rate_display(self, obj):
        return f"{obj.occupancy_rate:.1f}%"
    occupancy_rate_display.short_description = 'Occupancy Rate'


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    """
    Admin panel for managing rooms.
    Shows room allocation status.
    """
    
    list_display = [
        'room_number',
        'hostel',
        'capacity',
        'occupied_spaces',
        'available_spaces',
        'is_full',
        'floor',
        'room_type',
        'is_active',
    ]
    
    list_filter = ['hostel', 'is_active', 'floor', 'room_type']
    search_fields = ['room_number', 'hostel__name']
    ordering = ['hostel__name', 'room_number']
    
    fieldsets = (
        ('Room Details', {
            'fields': ('hostel', 'room_number', 'capacity')
        }),
        ('Additional Info', {
            'fields': ('floor', 'room_type', 'is_active')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def occupied_spaces(self, obj):
        return obj.occupied_spaces
    occupied_spaces.short_description = 'Occupied'
    
    def available_spaces(self, obj):
        return obj.available_spaces
    available_spaces.short_description = 'Available'
    
    def is_full(self, obj):
        return obj.is_full
    is_full.boolean = True
    is_full.short_description = 'Full'


@admin.register(AccommodationApplication)
class AccommodationApplicationAdmin(admin.ModelAdmin):
    """
    Admin panel for managing accommodation applications.
    Provides approval/rejection actions and waiting list management.
    """
    
    list_display = [
        'student',
        'hostel',
        'room',
        'status',
        'period',
        'waiting_list_position',
        'application_date',
        'decision_date',
    ]
    
    list_filter = ['status', 'period', 'hostel', 'application_date']
    search_fields = [
        'student__full_name',
        'student__student_number',
        'hostel__name',
        'room__room_number'
    ]
    ordering = ['-application_date']
    date_hierarchy = 'application_date'
    
    fieldsets = (
        ('Application Details', {
            'fields': ('student', 'hostel', 'room', 'period')
        }),
        ('Status & Decision', {
            'fields': ('status', 'rejection_reason', 'decision_date')
        }),
        ('Waiting List', {
            'fields': ('waiting_list_position',),
            'description': 'Position on waiting list (if applicable)'
        }),
        ('Check-in/out', {
            'fields': ('check_in_date', 'check_out_date')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )
    
    readonly_fields = [
        'application_date', 'decision_date', 'created_at', 'updated_at',
        'waiting_list_position'
    ]
    
    actions = [
        'approve_applications',
        'reject_applications',
        'move_to_waiting_list',
        'process_waiting_list',
    ]
    
    def approve_applications(self, request, queryset):
        """Approve selected pending applications"""
        approved_count = 0
        for application in queryset.filter(status=ApplicationStatus.PENDING):
            success, message = application.approve()
            if success:
                approved_count += 1
        
        self.message_user(
            request,
            f'{approved_count} applications approved successfully.'
        )
    
    approve_applications.short_description = 'Approve selected applications'
    
    def reject_applications(self, request, queryset):
        """Reject selected pending applications"""
        rejected_count = 0
        for application in queryset.filter(status=ApplicationStatus.PENDING):
            success = application.reject(reason='Bulk rejection via admin')
            if success:
                rejected_count += 1
        
        self.message_user(
            request,
            f'{rejected_count} applications rejected.'
        )
    
    reject_applications.short_description = 'Reject selected applications'
    
    def move_to_waiting_list(self, request, queryset):
        """Move selected applications to waiting list"""
        moved_count = 0
        for application in queryset.filter(
            status__in=[ApplicationStatus.PENDING, ApplicationStatus.APPROVED]
        ):
            if application.move_to_waiting_list():
                moved_count += 1
        
        self.message_user(
            request,
            f'{moved_count} applications moved to waiting list.'
        )
    
    move_to_waiting_list.short_description = 'Move to waiting list'
    
    def process_waiting_list(self, request, queryset):
        """Process waiting list for selected hostel(s)"""
        hostels = set(app.hostel for app in queryset if app.hostel)
        
        total_assigned = 0
        for hostel in hostels:
            assigned = AccommodationApplication.process_waiting_list(hostel=hostel)
            total_assigned += assigned
        
        self.message_user(
            request,
            f'Processed waiting list. {total_assigned} students assigned rooms.'
        )
    
    process_waiting_list.short_description = 'Process waiting list for hostels'

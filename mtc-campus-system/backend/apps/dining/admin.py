from django.contrib import admin
from .models import DiningAttendance, MealType, OfflineScan, SyncStatus


@admin.register(DiningAttendance)
class DiningAttendanceAdmin(admin.ModelAdmin):
    """Admin configuration for Dining Attendance"""
    list_display = [
        'student',
        'get_meal_type_display',
        'date',
        'timestamp',
        'scanner_device'
    ]
    list_filter = ['meal_type', 'date', 'scanner_device']
    search_fields = ['student__full_name', 'student__student_number']
    readonly_fields = ['timestamp', 'created_at', 'updated_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Attendance Information', {
            'fields': ('student', 'meal_type', 'date', 'scanner_device')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('timestamp', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make all fields readonly after creation"""
        if obj:
            return self.readonly_fields
        return []


@admin.register(OfflineScan)
class OfflineScanAdmin(admin.ModelAdmin):
    """Admin configuration for Offline Scans"""
    list_display = [
        'student_number',
        'get_meal_type_display',
        'device_id',
        'get_sync_status_display',
        'sync_attempts',
        'last_sync_attempt',
        'created_at'
    ]
    list_filter = ['sync_status', 'meal_type', 'device_id']
    search_fields = ['student_number', 'device_id']
    readonly_fields = [
        'sync_status', 'sync_attempts', 'last_sync_attempt', 
        'sync_error', 'attendance_record', 'created_at', 'updated_at'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Scan Information', {
            'fields': ('student_number', 'meal_type', 'timestamp', 'device_id')
        }),
        ('Sync Status', {
            'fields': ('sync_status', 'sync_attempts', 'last_sync_attempt', 'sync_error')
        }),
        ('Linked Record', {
            'fields': ('attendance_record',),
            'description': 'Attendance record created after successful sync'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['retry_failed_syncs']
    
    def retry_failed_syncs(self, request, queryset):
        """Retry failed syncs"""
        failed_scans = queryset.filter(sync_status=SyncStatus.FAILED)
        count = failed_scans.update(
            sync_status=SyncStatus.PENDING,
            sync_error=None
        )
        self.message_user(request, f'{count} failed syncs marked as pending for retry')
    
    retry_failed_syncs.short_description = 'Retry selected failed syncs'

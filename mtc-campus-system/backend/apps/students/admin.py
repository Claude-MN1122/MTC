from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    """
    Admin panel for managing students.
    Provides list view, filters, search, and QR code management.
    """
    
    # List display settings
    list_display = [
        'student_number',
        'full_name',
        'department',
        'year_of_study',
        'gender',
        'is_registered',
        'is_active',
        'has_photo',
        'has_qr_code',
        'created_at',
    ]
    
    # Filters in the right sidebar
    list_filter = [
        'department',
        'year_of_study',
        'gender',
        'is_active',
        'is_registered',
    ]
    
    # Search fields
    search_fields = [
        'student_number',
        'full_name',
        'national_id',
        'email',
    ]
    
    # Date-based drill-down navigation
    date_hierarchy = 'created_at'
    
    # Ordering
    ordering = ['-created_at']
    
    # Read-only fields (includes auto-generated fields)
    readonly_fields = [
        'qr_code',
        'has_photo',
        'has_qr_code',
        'id_card_ready',
        'created_at',
        'updated_at',
    ]
    
    # Field organization
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'student_number',
                'full_name',
                'national_id',
                'date_of_birth',
                'gender',
            )
        }),
        ('Academic Information', {
            'fields': (
                'department',
                'year_of_study',
                'email',
                'phone_number',
                'address',
            )
        }),
        ('Next of Kin Information', {
            'fields': (
                'next_of_kin_name',
                'next_of_kin_phone',
                'next_of_kin_relationship',
            ),
            'description': 'Emergency contact information'
        }),
        ('ID Card Assets', {
            'fields': (
                'photo',
                'qr_code',
                'has_photo',
                'has_qr_code',
                'id_card_ready',
            ),
            'description': 'Photo and QR code for student ID card'
        }),
        ('Status', {
            'fields': (
                'is_active',
                'is_registered',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',)
        }),
    )
    
    # Actions available in list view
    actions = [
        'mark_as_registered',
        'mark_as_unregistered',
        'activate_students',
        'deactivate_students',
    ]
    
    def mark_as_registered(self, request, queryset):
        """Mark selected students as registered"""
        updated = queryset.update(is_registered=True)
        self.message_user(request, f'{updated} students marked as registered.')
    
    mark_as_registered.short_description = 'Mark selected as registered'
    
    def mark_as_unregistered(self, request, queryset):
        """Mark selected students as unregistered"""
        updated = queryset.update(is_registered=False)
        self.message_user(request, f'{updated} students marked as unregistered.')
    
    mark_as_unregistered.short_description = 'Mark selected as unregistered'
    
    def activate_students(self, request, queryset):
        """Activate selected students"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} students activated.')
    
    activate_students.short_description = 'Activate selected students'
    
    def deactivate_students(self, request, queryset):
        """Deactivate selected students"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} students deactivated.')
    
    deactivate_students.short_description = 'Deactivate selected students'

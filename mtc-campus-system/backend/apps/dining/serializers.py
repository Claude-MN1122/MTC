from rest_framework import serializers
from .models import DiningAttendance, MealType, OfflineScan, SyncStatus
from students.models import Student
from students.serializers import StudentSerializer


class DiningAttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Dining Attendance"""
    student_details = StudentSerializer(source='student', read_only=True)
    meal_type_display = serializers.CharField(
        source='get_meal_type_display',
        read_only=True
    )
    
    class Meta:
        model = DiningAttendance
        fields = [
            'id',
            'student',
            'student_details',
            'meal_type',
            'meal_type_display',
            'date',
            'timestamp',
            'scanner_device',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'timestamp', 'created_at', 'updated_at']


class QRScanRequestSerializer(serializers.Serializer):
    """Serializer for QR code scan request"""
    qr_data = serializers.CharField(
        required=True,
        help_text="QR code data (format: MTC|student_number|...)"
    )
    meal_type = serializers.ChoiceField(
        choices=MealType.choices,
        required=True,
        help_text="Type of meal being scanned"
    )
    scanner_device = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        help_text="Scanner device identifier"
    )
    
    def validate_qr_data(self, value):
        """Validate QR code data format"""
        if not value.startswith('MTC|'):
            raise serializers.ValidationError(
                "Invalid QR code format. Expected format: MTC|student_number|..."
            )
        return value
    
    def validate(self, data):
        """Validate the entire request"""
        qr_data = data.get('qr_data')
        
        # Extract student number from QR data
        parts = qr_data.split('|')
        if len(parts) < 2:
            raise serializers.ValidationError({
                'qr_data': 'Invalid QR code format. Expected: MTC|student_number|...'
            })
        
        student_number = parts[1]
        
        try:
            student = Student.objects.get(student_number=student_number)
            data['student'] = student
        except Student.DoesNotExist:
            raise serializers.ValidationError({
                'qr_data': f'Student with number {student_number} not found'
            })
        
        return data


class MealEligibilitySerializer(serializers.Serializer):
    """Serializer for meal eligibility response"""
    student_number = serializers.CharField()
    full_name = serializers.CharField()
    is_eligible = serializers.BooleanField()
    has_accommodation = serializers.BooleanField()
    meals_consumed = serializers.DictField()
    can_scan_breakfast = serializers.BooleanField()
    can_scan_lunch = serializers.BooleanField()
    can_scan_dinner = serializers.BooleanField()


class ScanResponseSerializer(serializers.Serializer):
    """Serializer for scan response"""
    success = serializers.BooleanField()
    message = serializers.CharField()
    student = StudentSerializer(read_only=True)
    meal_type = serializers.CharField()
    date = serializers.DateField()
    timestamp = serializers.DateTimeField()
    attendance_id = serializers.IntegerField(allow_null=True)
    eligibility = MealEligibilitySerializer(read_only=True)


class OfflineScanSerializer(serializers.ModelSerializer):
    """Serializer for Offline Scan"""
    meal_type_display = serializers.CharField(
        source='get_meal_type_display',
        read_only=True
    )
    sync_status_display = serializers.CharField(
        source='get_sync_status_display',
        read_only=True
    )
    
    class Meta:
        model = OfflineScan
        fields = [
            'id',
            'student_number',
            'meal_type',
            'meal_type_display',
            'timestamp',
            'device_id',
            'sync_status',
            'sync_status_display',
            'sync_attempts',
            'last_sync_attempt',
            'sync_error',
            'attendance_record',
            'created_at',
        ]
        read_only_fields = [
            'id', 'sync_status', 'sync_attempts', 
            'last_sync_attempt', 'sync_error', 'attendance_record', 'created_at'
        ]


class OfflineScanRequestSerializer(serializers.Serializer):
    """Serializer for offline scan batch upload"""
    scans = serializers.ListField(
        child=serializers.DictField(),
        required=True,
        help_text="List of offline scan records to sync"
    )
    device_id = serializers.CharField(
        max_length=100,
        required=False,
        help_text="Device ID uploading the scans"
    )
    
    def validate_scans(self, value):
        """Validate the list of scans"""
        if not value or len(value) == 0:
            raise serializers.ValidationError("Scans list cannot be empty")
        
        # Validate each scan
        validated_scans = []
        for scan in value:
            # Check required fields
            if 'studentNumber' not in scan:
                raise serializers.ValidationError(
                    "Each scan must have 'studentNumber' field"
                )
            if 'mealType' not in scan:
                raise serializers.ValidationError(
                    "Each scan must have 'mealType' field"
                )
            if 'timestamp' not in scan:
                raise serializers.ValidationError(
                    "Each scan must have 'timestamp' field"
                )
            
            # Validate meal type
            meal_type = scan.get('mealType')
            valid_meal_types = [choice[0] for choice in MealType.choices]
            if meal_type not in valid_meal_types:
                raise serializers.ValidationError(
                    f"Invalid meal type: {meal_type}. Must be one of {valid_meal_types}"
                )
            
            validated_scans.append(scan)
        
        return validated_scans

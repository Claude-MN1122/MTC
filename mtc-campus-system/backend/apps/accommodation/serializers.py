from rest_framework import serializers
from django.utils import timezone
from .models import Hostel, Room, AccommodationApplication, ApplicationStatus, AccommodationPeriod
from students.serializers import StudentSerializer, StudentListSerializer


class HostelSerializer(serializers.ModelSerializer):
    """Serializer for Hostel model"""
    total_rooms = serializers.IntegerField(read_only=True)
    occupied_spaces = serializers.IntegerField(read_only=True)
    available_spaces = serializers.IntegerField(read_only=True)
    occupancy_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Hostel
        fields = [
            'id', 'name', 'gender', 'capacity', 'description',
            'is_active', 'total_rooms', 'occupied_spaces',
            'available_spaces', 'occupancy_rate',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_capacity(self, value):
        """Validate hostel capacity"""
        if value < 0:
            raise serializers.ValidationError("Capacity cannot be negative")
        return value


class HostelCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new hostel"""
    class Meta:
        model = Hostel
        fields = ['name', 'gender', 'capacity', 'description', 'is_active']


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for Room model"""
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    occupied_spaces = serializers.IntegerField(read_only=True)
    available_spaces = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    occupancy_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Room
        fields = [
            'id', 'hostel', 'hostel_name', 'room_number', 'capacity',
            'floor', 'room_type', 'is_active', 'occupied_spaces',
            'available_spaces', 'is_full', 'occupancy_rate',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_capacity(self, value):
        """Validate room capacity"""
        if value < 1:
            raise serializers.ValidationError("Room capacity must be at least 1")
        return value
    
    def validate(self, data):
        """Validate room data"""
        # Check if room number already exists in this hostel
        if 'hostel' in data and 'room_number' in data:
            hostel = data['hostel'] if isinstance(data['hostel'], Hostel) else None
            room_number = data['room_number']
            
            if hostel and Room.objects.filter(
                hostel=hostel,
                room_number=room_number
            ).exists():
                raise serializers.ValidationError({
                    'room_number': f"Room {room_number} already exists in {hostel.name}"
                })
        
        return data


class RoomCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new room"""
    class Meta:
        model = Room
        fields = ['hostel', 'room_number', 'capacity', 'floor', 'room_type', 'is_active']


class AccommodationApplicationSerializer(serializers.ModelSerializer):
    """Serializer for AccommodationApplication model"""
    student_details = StudentSerializer(source='student', read_only=True)
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AccommodationApplication
        fields = [
            'id', 'student', 'student_details',
            'hostel', 'hostel_name', 'room', 'room_number',
            'period', 'period_display', 'status', 'status_display',
            'application_date', 'decision_date', 'notes',
            'rejection_reason', 'waiting_list_position',
            'check_in_date', 'check_out_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'application_date', 'decision_date', 'created_at', 'updated_at',
            'waiting_list_position'
        ]


class AccommodationApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating accommodation applications"""
    class Meta:
        model = AccommodationApplication
        fields = [
            'student', 'hostel', 'period', 'notes'
        ]
    
    def validate_student(self, value):
        """Validate that student doesn't already have pending application"""
        if AccommodationApplication.objects.filter(
            student=value,
            status=ApplicationStatus.PENDING
        ).exists():
            raise serializers.ValidationError(
                "You already have a pending accommodation application"
            )
        return value
    
    def create(self, validated_data):
        """Create application - status will be PENDING by default"""
        return super().create(validated_data)


class ApplicationApprovalSerializer(serializers.Serializer):
    """Serializer for approving accommodation applications"""
    assign_room = serializers.IntegerField(
        required=False,
        help_text="Specific room ID to assign (optional)"
    )
    assign_hostel = serializers.IntegerField(
        required=False,
        help_text="Preferred hostel ID (optional, used if no room specified)"
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Additional notes for approval"
    )


class ApplicationRejectionSerializer(serializers.Serializer):
    """Serializer for rejecting accommodation applications"""
    reason = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Reason for rejection"
    )


class WaitingListSerializer(serializers.ModelSerializer):
    """Serializer for waiting list view"""
    student_details = StudentSerializer(source='student', read_only=True)
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    days_waiting = serializers.SerializerMethodField()
    
    class Meta:
        model = AccommodationApplication
        fields = [
            'id', 'student_details', 'hostel_name',
            'period', 'period_display', 'status',
            'waiting_list_position', 'application_date',
            'days_waiting', 'notes'
        ]
    
    def get_days_waiting(self, obj):
        """Calculate days on waiting list"""
        if obj.application_date:
            delta = timezone.now().date() - obj.application_date
            return delta.days
        return 0

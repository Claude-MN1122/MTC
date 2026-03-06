from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q, Sum, F
from django.utils import timezone
from .models import Hostel, Room, AccommodationApplication, ApplicationStatus
from .serializers import (
    HostelSerializer,
    HostelCreateSerializer,
    RoomSerializer,
    RoomCreateSerializer,
    AccommodationApplicationSerializer,
    AccommodationApplicationCreateSerializer,
    ApplicationApprovalSerializer,
    ApplicationRejectionSerializer,
    WaitingListSerializer
)


class HostelViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing hostels.
    
    Provides CRUD operations for hostel management.
    """
    queryset = Hostel.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gender', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'capacity', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        """Customize permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return HostelCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return HostelCreateSerializer
        return HostelSerializer
    
    @swagger_auto_schema(
        operation_summary="Get hostel statistics",
        operation_description="Retrieve occupancy statistics for a hostel.",
        tags=['Accommodation - Hostels'],
        responses={
            200: openapi.Response(
                description='Hostel statistics',
                examples={
                    'application/json': {
                        'name': 'Main Hostel',
                        'total_rooms': 20,
                        'occupied_spaces': 45,
                        'available_spaces': 15,
                        'occupancy_rate': 75.0
                    }
                }
            )
        }
    )
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get detailed statistics for a hostel"""
        hostel = self.get_object()
        
        return Response({
            'id': hostel.id,
            'name': hostel.name,
            'gender': hostel.gender,
            'capacity': hostel.capacity,
            'total_rooms': hostel.total_rooms,
            'occupied_spaces': hostel.occupied_spaces,
            'available_spaces': hostel.available_spaces,
            'occupancy_rate': round(hostel.occupancy_rate, 2),
            'is_active': hostel.is_active
        })


class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing rooms.
    
    Provides CRUD operations for room management.
    """
    queryset = Room.objects.select_related('hostel').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['hostel', 'is_active', 'floor']
    search_fields = ['room_number', 'hostel__name']
    ordering_fields = ['room_number', 'capacity', 'created_at']
    ordering = ['hostel__name', 'room_number']
    
    def get_permissions(self):
        """Customize permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return RoomCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return RoomCreateSerializer
        return RoomSerializer
    
    @swagger_auto_schema(
        operation_summary="Get room availability",
        operation_description="Check if a room has available spaces.",
        tags=['Accommodation - Rooms'],
        responses={
            200: openapi.Response(
                description='Room availability',
                examples={
                    'application/json': {
                        'room_number': '101',
                        'capacity': 4,
                        'occupied_spaces': 3,
                        'available_spaces': 1,
                        'is_full': False
                    }
                }
            )
        }
    )
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Get room availability details"""
        room = self.get_object()
        
        return Response({
            'id': room.id,
            'room_number': room.room_number,
            'hostel': room.hostel.name,
            'capacity': room.capacity,
            'occupied_spaces': room.occupied_spaces,
            'available_spaces': room.available_spaces,
            'is_full': room.is_full,
            'occupancy_rate': round(room.occupancy_rate, 2)
        })


class AccommodationApplicationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing accommodation applications.
    
    Provides endpoints for:
    - Applying for accommodation
    - Viewing applications
    - Approving/rejecting applications
    - Managing waiting list
    """
    queryset = AccommodationApplication.objects.select_related(
        'student', 'hostel', 'room'
    ).all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'period', 'hostel']
    search_fields = ['student__full_name', 'student__student_number']
    ordering_fields = ['application_date', 'created_at', 'waiting_list_position']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Customize permissions based on action"""
        if self.action in ['apply', 'my_applications', 'cancel_application']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['approve', 'reject', 'process_waiting_list']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'apply':
            return AccommodationApplicationCreateSerializer
        elif self.action in ['approve']:
            return ApplicationApprovalSerializer
        elif self.action in ['reject']:
            return ApplicationRejectionSerializer
        elif self.action in ['waiting_list']:
            return WaitingListSerializer
        return AccommodationApplicationSerializer
    
    @swagger_auto_schema(
        operation_summary="Apply for accommodation",
        operation_description="Submit an accommodation application as a student.",
        tags=['Accommodation - Applications'],
        request=AccommodationApplicationCreateSerializer,
        responses={
            201: AccommodationApplicationSerializer,
            400: 'Bad Request - Duplicate application or validation error'
        }
    )
    @action(detail=False, methods=['post'])
    def apply(self, request):
        """
        Apply for accommodation.
        
        Students can submit applications for hostel accommodation.
        Status will be set to PENDING automatically.
        """
        serializer = AccommodationApplicationCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            application = serializer.save()
            
            return Response({
                'message': 'Application submitted successfully',
                'application': AccommodationApplicationSerializer(
                    application, context={'request': request}
                ).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Get my applications",
        operation_description="Get all accommodation applications for the current user.",
        tags=['Accommodation - Applications'],
        responses={
            200: openapi.Response(
                description='List of applications',
                examples={
                    'application/json': {
                        'count': 2,
                        'results': []
                    }
                }
            )
        }
    )
    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """
        Get current user's accommodation applications.
        
        Requires authentication.
        """
        # Assuming user has a related student profile
        # This may need adjustment based on your user model structure
        try:
            student = request.user.student
            applications = AccommodationApplication.objects.filter(
                student=student
            ).order_by('-created_at')
            
            page = self.paginate_queryset(applications)
            if page is not None:
                serializer = AccommodationApplicationSerializer(
                    page, many=True, context={'request': request}
                )
                return self.get_paginated_response(serializer.data)
            
            serializer = AccommodationApplicationSerializer(
                applications, many=True, context={'request': request}
            )
            return Response(serializer.data)
        except Exception:
            return Response(
                {'error': 'User does not have a student profile'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @swagger_auto_schema(
        operation_summary="Approve accommodation application",
        operation_description="Approve an application and assign accommodation.",
        tags=['Accommodation - Applications'],
        request=ApplicationApprovalSerializer,
        responses={
            200: openapi.Response(
                description='Application approved',
                examples={
                    'application/json': {
                        'message': 'Approved and assigned to Main Hostel, Room 101',
                        'success': True
                    }
                }
            ),
            400: 'Bad Request - Already processed or no space available'
        }
    )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        Approve accommodation application.
        
        Automatically assigns:
        - Hostel (based on preference or availability)
        - Room (first available room with space)
        
        If no space available, student is moved to waiting list.
        """
        application = self.get_object()
        
        if application.status != ApplicationStatus.PENDING:
            return Response(
                {'error': f'Application already {application.get_status_display()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ApplicationApprovalSerializer(data=request.data)
        serializer.is_valid()  # Don't raise error, fields are optional
        
        assign_room_id = serializer.validated_data.get('assign_room')
        assign_hostel_id = serializer.validated_data.get('assign_hostel')
        
        # Get room/hostel objects if specified
        assign_room = None
        assign_hostel = None
        
        if assign_room_id:
            try:
                assign_room = Room.objects.get(pk=assign_room_id)
            except Room.DoesNotExist:
                return Response(
                    {'error': 'Room not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        if assign_hostel_id and not assign_room:
            try:
                assign_hostel = Hostel.objects.get(pk=assign_hostel_id)
            except Hostel.DoesNotExist:
                return Response(
                    {'error': 'Hostel not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Attempt approval with room assignment
        success, message = application.approve(
            assign_hostel=assign_hostel,
            assign_room=assign_room
        )
        
        if success:
            return Response({
                'message': message,
                'success': True,
                'hostel': application.hostel.name,
                'room': application.room.room_number
            })
        else:
            # Check if moved to waiting list
            if application.status == ApplicationStatus.WAITING_LIST:
                return Response({
                    'message': message,
                    'success': False,
                    'waiting_list': True,
                    'position': application.waiting_list_position
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': message,
                'success': False
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Reject accommodation application",
        operation_description="Reject an accommodation application.",
        tags=['Accommodation - Applications'],
        request=ApplicationRejectionSerializer,
        responses={
            200: openapi.Response(
                description='Application rejected',
                examples={
                    'application/json': {
                        'message': 'Application rejected',
                        'success': True
                    }
                }
            ),
            400: 'Bad Request - Already processed'
        }
    )
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Reject accommodation application.
        
        Optionally provide a reason for rejection.
        """
        application = self.get_object()
        
        if application.status != ApplicationStatus.PENDING:
            return Response(
                {'error': f'Application already {application.get_status_display()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ApplicationRejectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reason = serializer.validated_data.get('reason', '')
        
        success = application.reject(reason=reason)
        
        if success:
            return Response({
                'message': 'Application rejected',
                'success': True,
                'reason': reason
            })
        
        return Response(
            {'error': 'Failed to reject application'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @swagger_auto_schema(
        operation_summary="Cancel accommodation application",
        operation_description="Cancel a pending or approved application.",
        tags=['Accommodation - Applications'],
        responses={
            200: openapi.Response(
                description='Application cancelled',
                examples={
                    'application/json': {
                        'message': 'Application cancelled successfully',
                        'success': True
                    }
                }
            )
        }
    )
    @action(detail=True, methods=['post'])
    def cancel_application(self, request, pk=None):
        """Cancel an accommodation application"""
        application = self.get_object()
        
        if application.status in [
            ApplicationStatus.CANCELLED,
            ApplicationStatus.REJECTED
        ]:
            return Response(
                {'error': f'Application already {application.get_status_display()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.cancel()
        
        return Response({
            'message': 'Application cancelled successfully',
            'success': True
        })
    
    @swagger_auto_schema(
        operation_summary="Get waiting list",
        operation_description="View students on the accommodation waiting list.",
        tags=['Accommodation - Applications'],
        responses={
            200: openapi.Response(
                description='Waiting list',
                examples={
                    'application/json': {
                        'count': 5,
                        'results': []
                    }
                }
            )
        }
    )
    @action(detail=False, methods=['get'])
    def waiting_list(self, request):
        """
        View accommodation waiting list.
        
        Shows students waiting for accommodation, ordered by position.
        """
        waiting_list = AccommodationApplication.objects.filter(
            status=ApplicationStatus.WAITING_LIST
        ).select_related('student', 'hostel').order_by(
            'waiting_list_position', 'application_date'
        )
        
        page = self.paginate_queryset(waiting_list)
        if page is not None:
            serializer = WaitingListSerializer(
                page, many=True, context={'request': request}
            )
            return self.get_paginated_response(serializer.data)
        
        serializer = WaitingListSerializer(
            waiting_list, many=True, context={'request': request}
        )
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Process waiting list",
        operation_description="Automatically assign rooms to waiting list students when spaces become available.",
        tags=['Accommodation - Applications'],
        manual_parameters=[
            openapi.Parameter(
                'hostel',
                openapi.IN_QUERY,
                description="Hostel ID to process (optional, processes all if not specified)",
                type=openapi.TYPE_INTEGER
            )
        ],
        responses={
            200: openapi.Response(
                description='Processing complete',
                examples={
                    'application/json': {
                        'message': 'Processed waiting list',
                        'assigned_count': 3,
                        'success': True
                    }
                }
            )
        }
    )
    @action(detail=False, methods=['post'])
    def process_waiting_list(self, request):
        """
        Process waiting list and auto-assign available rooms.
        
        When rooms become available (due to cancellations or check-outs),
        this endpoint automatically assigns rooms to students on the waiting list
        in order of their position.
        
        Optional hostel parameter to process specific hostel only.
        """
        hostel_id = request.query_params.get('hostel')
        
        hostel = None
        if hostel_id:
            try:
                hostel = Hostel.objects.get(pk=hostel_id)
            except Hostel.DoesNotExist:
                return Response(
                    {'error': 'Hostel not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        assigned_count = AccommodationApplication.process_waiting_list(hostel=hostel)
        
        return Response({
            'message': 'Processed waiting list',
            'assigned_count': assigned_count,
            'success': True
        })
    
    @swagger_auto_schema(
        operation_summary="Get application statistics",
        operation_description="Get statistics about accommodation applications.",
        tags=['Accommodation - Applications'],
        responses={
            200: openapi.Response(
                description='Application statistics',
                examples={
                    'application/json': {
                        'total_applications': 150,
                        'pending': 20,
                        'approved': 100,
                        'rejected': 15,
                        'waiting_list': 15
                    }
                }
            )
        }
    )
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get accommodation application statistics"""
        stats = {
            'total_applications': AccommodationApplication.objects.count(),
            'pending': AccommodationApplication.objects.filter(
                status=ApplicationStatus.PENDING
            ).count(),
            'approved': AccommodationApplication.objects.filter(
                status=ApplicationStatus.APPROVED
            ).count(),
            'rejected': AccommodationApplication.objects.filter(
                status=ApplicationStatus.REJECTED
            ).count(),
            'waiting_list': AccommodationApplication.objects.filter(
                status=ApplicationStatus.WAITING_LIST
            ).count(),
            'cancelled': AccommodationApplication.objects.filter(
                status=ApplicationStatus.CANCELLED
            ).count(),
        }
        
        return Response(stats)

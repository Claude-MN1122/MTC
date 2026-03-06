from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count, Q, F
from django.db import transaction
from .models import DiningAttendance, MealType, OfflineScan, SyncStatus
from .serializers import (
    DiningAttendanceSerializer,
    QRScanRequestSerializer,
    ScanResponseSerializer,
    MealEligibilitySerializer,
    OfflineScanSerializer,
    OfflineScanRequestSerializer
)
from students.models import Student
from accommodation.models import AccommodationApplication, ApplicationStatus


class DiningAttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing dining attendance records.
    
    list: GET /api/dining/attendance/
    retrieve: GET /api/dining/attendance/{id}/
    create: POST /api/dining/attendance/
    update: PUT /api/dining/attendance/{id}/
    delete: DELETE /api/dining/attendance/{id}/
    """
    queryset = DiningAttendance.objects.all().select_related('student')
    serializer_class = DiningAttendanceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['meal_type', 'date', 'student']
    search_fields = ['student__full_name', 'student__student_number']
    ordering_fields = ['timestamp', 'date', 'created_at']
    
    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = super().get_queryset()
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        # Filter by today
        if self.request.query_params.get('today') == 'true':
            today = timezone.now().date()
            queryset = queryset.filter(date=today)
        
        return queryset


class QRScanView(APIView):
    """
    API endpoint for processing QR code scans in the dining hall.
    
    POST /api/dining/scan/
    
    Process:
    1. Scan QR code
    2. Extract student number
    3. Verify accommodation approval
    4. Check meal eligibility
    5. Record attendance (if eligible)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = QRScanRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        qr_data = serializer.validated_data['qr_data']
        meal_type = serializer.validated_data['meal_type']
        scanner_device = serializer.validated_data.get('scanner_device', '')
        student = serializer.validated_data['student']
        
        # Extract student number from QR data
        parts = qr_data.split('|')
        student_number = parts[1]
        
        # Step 1: Verify accommodation approval
        accommodation_status = AccommodationApplication.objects.filter(
            student=student,
            status=ApplicationStatus.APPROVED
        ).exists()
        
        if not accommodation_status:
            # Get eligibility info even though not approved
            eligibility_info = {
                'student_number': student_number,
                'full_name': student.full_name,
                'is_eligible': False,
                'has_accommodation': False,
                'meals_consumed': {},
                'can_scan_breakfast': False,
                'can_scan_lunch': False,
                'can_scan_dinner': False,
            }
            
            return Response({
                'success': False,
                'message': 'Student does not have approved accommodation. Not eligible for meals.',
                'eligibility': eligibility_info
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Step 2: Check if already scanned for this meal today
        today = timezone.now().date()
        existing_scan = DiningAttendance.objects.filter(
            student=student,
            meal_type=meal_type,
            date=today
        ).exists()
        
        if existing_scan:
            # Get full eligibility info
            eligibility_info = DiningAttendance.get_meal_eligibility(student)
            eligibility_info['student_number'] = student_number
            eligibility_info['full_name'] = student.full_name
            
            return Response({
                'success': False,
                'message': f'Already scanned for {MealType(meal_type).label} today',
                'student': Student.objects.get(pk=student.pk),
                'eligibility': eligibility_info
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Step 3: Record attendance
        try:
            attendance = DiningAttendance.objects.create(
                student=student,
                meal_type=meal_type,
                date=today,
                scanner_device=scanner_device
            )
            
            # Get updated eligibility info
            eligibility_info = DiningAttendance.get_meal_eligibility(student)
            eligibility_info['student_number'] = student_number
            eligibility_info['full_name'] = student.full_name
            
            return Response({
                'success': True,
                'message': f'{MealType(meal_type).label} attendance recorded successfully',
                'student': Student.objects.get(pk=student.pk),
                'meal_type': meal_type,
                'date': today,
                'timestamp': attendance.timestamp,
                'attendance_id': attendance.id,
                'eligibility': eligibility_info
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error recording attendance: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MealEligibilityView(APIView):
    """
    API endpoint to check student meal eligibility.
    
    GET /api/dining/eligibility/?student_number=XXX
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        student_number = request.query_params.get('student_number')
        
        if not student_number:
            return Response({
                'success': False,
                'message': 'student_number parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(student_number=student_number)
        except Student.DoesNotExist:
            return Response({
                'success': False,
                'message': f'Student with number {student_number} not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get eligibility information
        eligibility_info = DiningAttendance.get_meal_eligibility(student)
        eligibility_info['student_number'] = student_number
        eligibility_info['full_name'] = student.full_name
        
        return Response({
            'success': True,
            'data': eligibility_info
        })


class DiningDashboardView(APIView):
    """
    API endpoint for dining dashboard statistics.
    
    GET /api/dining/dashboard/
    
    Returns:
    - Total eligible students (with approved accommodation)
    - Students who ate today
    - Remaining students (eligible but haven't eaten)
    - Meal statistics for today
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        
        # Total eligible students (with approved accommodation)
        total_eligible = AccommodationApplication.objects.filter(
            status=ApplicationStatus.APPROVED
        ).values('student').distinct().count()
        
        # Students who ate today (any meal)
        students_ate_today = DiningAttendance.objects.filter(
            date=today
        ).values('student').distinct().count()
        
        # Remaining students (eligible but haven't eaten)
        remaining_students = total_eligible - students_ate_today
        
        # Meal statistics for today
        breakfast_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.BREAKFAST
        ).count()
        
        lunch_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.LUNCH
        ).count()
        
        dinner_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.DINNER
        ).count()
        
        # Total meals served today
        total_meals_today = breakfast_count + lunch_count + dinner_count
        
        # Recent attendances (last 10)
        recent_attendances = DiningAttendance.objects.select_related(
            'student'
        ).filter(
            date=today
        ).order_by('-timestamp')[:10]
        
        recent_data = DiningAttendanceSerializer(
            recent_attendances,
            many=True
        ).data
        
        # Breakdown by meal type consumption
        meal_breakdown = {
            'breakfast': {
                'count': breakfast_count,
                'percentage': (breakfast_count / total_eligible * 100) if total_eligible > 0 else 0
            },
            'lunch': {
                'count': lunch_count,
                'percentage': (lunch_count / total_eligible * 100) if total_eligible > 0 else 0
            },
            'dinner': {
                'count': dinner_count,
                'percentage': (dinner_count / total_eligible * 100) if total_eligible > 0 else 0
            }
        }
        
        return Response({
            'success': True,
            'data': {
                'date': today,
                'total_eligible_students': total_eligible,
                'students_ate_today': students_ate_today,
                'remaining_students': remaining_students,
                'total_meals_served': total_meals_today,
                'meal_breakdown': meal_breakdown,
                'recent_attendances': recent_data
            }
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dining_stats(request):
    """
    Quick statistics endpoint.
    
    GET /api/dining/stats/
    """
    today = timezone.now().date()
    
    stats = {
        'today': {
            'date': str(today),
            'breakfast': DiningAttendance.objects.filter(
                date=today,
                meal_type=MealType.BREAKFAST
            ).count(),
            'lunch': DiningAttendance.objects.filter(
                date=today,
                meal_type=MealType.LUNCH
            ).count(),
            'dinner': DiningAttendance.objects.filter(
                date=today,
                meal_type=MealType.DINNER
            ).count(),
        },
        'total_records': DiningAttendance.objects.count()
    }
    
    return Response(stats)


class OfflineScanSyncView(APIView):
    """
    API endpoint for syncing offline scans to the server.
    
    POST /api/dining/sync/
    
    Accepts batch of offline scans and processes them:
    1. Validate student exists
    2. Check accommodation eligibility
    3. Prevent duplicates
    4. Create attendance records
    5. Update sync status
    """
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        serializer = OfflineScanRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        scans = serializer.validated_data['scans']
        device_id = serializer.validated_data.get('device_id', 'UNKNOWN')
        
        results = {
            'total': len(scans),
            'successful': 0,
            'failed': 0,
            'duplicates': 0,
            'ineligible': 0,
            'details': []
        }
        
        for scan_data in scans:
            student_number = scan_data['studentNumber']
            meal_type = scan_data['mealType']
            scan_timestamp = scan_data.get('timestamp')
            
            # Find or create offline scan record
            try:
                offline_scan = OfflineScan.objects.get(
                    student_number=student_number,
                    meal_type=meal_type,
                    timestamp=scan_timestamp,
                    device_id=device_id
                )
                # Mark as syncing
                offline_scan.mark_as_syncing()
            except OfflineScan.DoesNotExist:
                # Create new offline scan record for tracking
                offline_scan = OfflineScan.objects.create(
                    student_number=student_number,
                    meal_type=meal_type,
                    timestamp=scan_timestamp,
                    device_id=device_id,
                    sync_status=SyncStatus.SYNCING
                )
            
            try:
                # Step 1: Validate student exists
                student = Student.objects.get(student_number=student_number)
                
                # Step 2: Check accommodation eligibility
                has_accommodation = AccommodationApplication.objects.filter(
                    student=student,
                    status=ApplicationStatus.APPROVED
                ).exists()
                
                if not has_accommodation:
                    offline_scan.mark_as_failed('Student not eligible - no approved accommodation')
                    results['ineligible'] += 1
                    results['details'].append({
                        'student_number': student_number,
                        'status': 'FAILED',
                        'reason': 'Not eligible - no approved accommodation'
                    })
                    continue
                
                # Step 3: Extract date from timestamp
                try:
                    from datetime import datetime
                    if isinstance(scan_timestamp, str):
                        scan_date = datetime.fromisoformat(scan_timestamp.replace('Z', '+00:00')).date()
                    else:
                        scan_date = scan_timestamp.date()
                except:
                    scan_date = timezone.now().date()
                
                # Step 4: Check for duplicates
                existing_attendance = DiningAttendance.objects.filter(
                    student=student,
                    meal_type=meal_type,
                    date=scan_date
                ).exists()
                
                if existing_attendance:
                    offline_scan.mark_as_failed('Duplicate scan for this meal on this date')
                    results['duplicates'] += 1
                    results['details'].append({
                        'student_number': student_number,
                        'status': 'DUPLICATE',
                        'reason': f'Already scanned for {meal_type} on {scan_date}'
                    })
                    continue
                
                # Step 5: Create attendance record
                attendance = DiningAttendance.objects.create(
                    student=student,
                    meal_type=meal_type,
                    date=scan_date,
                    scanner_device=device_id,
                    notes=f'Synced from offline scan at {timezone.now()}'
                )
                
                # Mark offline scan as synced
                offline_scan.mark_as_synced(attendance)
                
                results['successful'] += 1
                results['details'].append({
                    'student_number': student_number,
                    'status': 'SUCCESS',
                    'attendance_id': attendance.id,
                    'message': f'{meal_type} attendance recorded successfully'
                })
                
            except Student.DoesNotExist:
                offline_scan.mark_as_failed(f'Student {student_number} not found')
                results['failed'] += 1
                results['details'].append({
                    'student_number': student_number,
                    'status': 'FAILED',
                    'reason': f'Student not found'
                })
            except Exception as e:
                offline_scan.mark_as_failed(f'Error: {str(e)}')
                results['failed'] += 1
                results['details'].append({
                    'student_number': student_number,
                    'status': 'FAILED',
                    'reason': str(e)
                })
        
        return Response({
            'success': True,
            'message': f'Sync completed: {results["successful"]} successful, {results["failed"]} failed',
            'results': results
        }, status=status.HTTP_200_OK)


class OfflineScanStatusView(APIView):
    """
    API endpoint to check offline scan sync status.
    
    GET /api/dining/offline-status/
    
    Returns:
    - Pending sync count
    - Failed sync count
    - Total offline scans
    - Pending scan details
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        pending_count = OfflineScan.get_pending_count()
        failed_count = OfflineScan.objects.filter(sync_status=SyncStatus.FAILED).count()
        syncing_count = OfflineScan.objects.filter(sync_status=SyncStatus.SYNCING).count()
        synced_count = OfflineScan.objects.filter(sync_status=SyncStatus.SYNCED).count()
        total_count = OfflineScan.objects.count()
        
        # Get recent pending scans (last 10)
        pending_scans = OfflineScan.get_pending_scans()[:10]
        pending_data = OfflineScanSerializer(pending_scans, many=True).data
        
        # Get recent failed scans (last 5)
        failed_scans = OfflineScan.objects.filter(
            sync_status=SyncStatus.FAILED
        ).order_by('-updated_at')[:5]
        failed_data = OfflineScanSerializer(failed_scans, many=True).data
        
        return Response({
            'success': True,
            'data': {
                'pending_count': pending_count,
                'failed_count': failed_count,
                'syncing_count': syncing_count,
                'synced_count': synced_count,
                'total_offline_scans': total_count,
                'pending_scans': pending_data,
                'failed_scans': failed_data
            }
        })


class OfflineDashboardView(APIView):
    """
    Enhanced dashboard with offline mode information.
    
    GET /api/dining/offline-dashboard/
    
    Returns all dashboard stats plus offline sync information.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        
        # Original dashboard stats
        total_eligible = AccommodationApplication.objects.filter(
            status=ApplicationStatus.APPROVED
        ).values('student').distinct().count()
        
        students_ate_today = DiningAttendance.objects.filter(
            date=today
        ).values('student').distinct().count()
        
        remaining_students = total_eligible - students_ate_today
        
        breakfast_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.BREAKFAST
        ).count()
        
        lunch_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.LUNCH
        ).count()
        
        dinner_count = DiningAttendance.objects.filter(
            date=today,
            meal_type=MealType.DINNER
        ).count()
        
        total_meals_today = breakfast_count + lunch_count + dinner_count
        
        # Offline scan statistics
        pending_sync = OfflineScan.get_pending_count()
        failed_sync = OfflineScan.objects.filter(sync_status=SyncStatus.FAILED).count()
        total_offline = OfflineScan.objects.count()
        
        # Determine mode
        mode = 'ONLINE'
        if pending_sync > 0:
            mode = 'OFFLINE_PENDING'
        elif total_offline > 0 and failed_sync == 0:
            mode = 'HYBRID'
        
        return Response({
            'success': True,
            'data': {
                'mode': mode,
                'connection_status': 'ONLINE' if pending_sync == 0 else 'OFFLINE_SCANS_PENDING',
                'dining_stats': {
                    'date': today,
                    'total_eligible_students': total_eligible,
                    'students_ate_today': students_ate_today,
                    'remaining_students': remaining_students,
                    'total_meals_served': total_meals_today,
                    'meal_breakdown': {
                        'breakfast': {'count': breakfast_count},
                        'lunch': {'count': lunch_count},
                        'dinner': {'count': dinner_count}
                    }
                },
                'offline_stats': {
                    'pending_sync': pending_sync,
                    'failed_sync': failed_sync,
                    'total_offline_scans': total_offline,
                    'sync_health': 'GOOD' if failed_sync == 0 and pending_sync == 0 else 'NEEDS_ATTENTION'
                }
            }
        })

from rest_framework import viewsets, status, permissions, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import HttpResponse, FileResponse
from django.template.loader import render_to_string
from io import BytesIO
import csv
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from PIL import Image as PILImage
import os
from .models import Student
from .serializers import (
    StudentSerializer,
    StudentCreateSerializer,
    StudentUpdateSerializer,
    StudentPhotoUploadSerializer,
    StudentListSerializer,
    QRCodeDataSerializer
)


class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing students.
    
    Provides CRUD operations for student records.
    Automatically generates QR codes when students are created.
    """
    queryset = Student.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'year_of_study', 'gender', 'is_active', 'is_registered']
    search_fields = ['student_number', 'full_name', 'national_id', 'email']
    ordering_fields = ['student_number', 'full_name', 'created_at', 'department']
    ordering = ['-created_at']
    
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
            return StudentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return StudentUpdateSerializer
        elif self.action == 'upload_photo':
            return StudentPhotoUploadSerializer
        elif self.action == 'list':
            return StudentListSerializer
        return StudentSerializer
    
    def get_queryset(self):
        """Optimize queryset for list vs detail"""
        if self.action == 'list':
            return Student.objects.select_related().all()
        return Student.objects.all()
    
    @swagger_auto_schema(
        operation_summary="Create a new student",
        operation_description="Register a new student. QR code will be auto-generated.",
        tags=['Students'],
        request=StudentCreateSerializer,
        responses={
            201: StudentSerializer,
            400: 'Bad Request - Invalid data or duplicate entry'
        }
    )
    def create(self, request, *args, **kwargs):
        """
        Create a new student record.
        
        QR code is automatically generated upon successful creation.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return full student data including QR code info
        headers = self.get_success_headers(serializer.data)
        full_serializer = StudentSerializer(serializer.instance, context={'request': request})
        
        response_data = {
            'message': 'Student registered successfully. QR code generated.',
            'student': full_serializer.data
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
    @swagger_auto_schema(
        operation_summary="Get student details",
        operation_description="Retrieve detailed information about a specific student.",
        tags=['Students'],
        responses={
            200: StudentSerializer,
            404: 'Student not found'
        }
    )
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a student's complete information including QR code."""
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Update student information",
        operation_description="Update student details. New QR code generated if student number changes.",
        tags=['Students'],
        request=StudentUpdateSerializer,
        responses={
            200: StudentSerializer,
            400: 'Bad Request',
            404: 'Student not found'
        }
    )
    def update(self, request, *args, **kwargs):
        """Update student information. QR code regenerates if student number changes."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(StudentSerializer(instance, context={'request': request}).data)
    
    @swagger_auto_schema(
        operation_summary="Upload student photo",
        operation_description="Upload a passport-style photo for the student.",
        tags=['Students'],
        request=StudentPhotoUploadSerializer,
        responses={
            200: openapi.Response(
                description='Photo uploaded successfully',
                examples={
                    'application/json': {
                        'message': 'Photo uploaded successfully',
                        'photo_url': 'http://example.com/media/student_photos/photo.jpg'
                    }
                }
            ),
            400: 'Bad Request'
        }
    )
    @action(detail=True, methods=['post'], parser_classes=[parsers.MultiPartParser, parsers.FormParser])
    def upload_photo(self, request, pk=None):
        """
        Upload student photo.
        
        Accepts image files (JPG, PNG).
        Photo is required for ID card generation.
        """
        student = self.get_object()
        serializer = StudentPhotoUploadSerializer(student, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Photo uploaded successfully',
                'photo_url': request.build_absolute_uri(student.photo.url) if student.photo else None,
                'id_card_ready': student.id_card_ready
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Get student QR code",
        operation_description="Retrieve the QR code image and data for a student.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='QR code data',
                examples={
                    'application/json': {
                        'student_number': 'STU2024001',
                        'full_name': 'John Doe',
                        'department': 'EDUCATION',
                        'institution': 'Mutare Teachers College',
                        'qr_code_url': 'http://example.com/media/qr_codes/qr_stu2024001.png'
                    }
                }
            ),
            404: 'Student not found or QR code not generated'
        }
    )
    @action(detail=True, methods=['get'])
    def qr_code(self, request, pk=None):
        """
        Get student's QR code information.
        
        Returns QR code image URL and decoded data.
        QR code contains: student number, name, department
        """
        student = self.get_object()
        
        if not student.qr_code:
            return Response(
                {'error': 'QR code not generated yet'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        qr_data = QRCodeDataSerializer({
            'student_number': student.student_number,
            'full_name': student.full_name,
            'department': student.get_department_display(),
            'institution': 'Mutare Teachers College'
        }).data
        
        return Response({
            'student_number': student.student_number,
            'full_name': student.full_name,
            'department': student.department,
            'qr_code_url': request.build_absolute_uri(student.qr_code.url),
            'qr_data': qr_data
        })
    
    @swagger_auto_schema(
        operation_summary="Download QR code",
        operation_description="Download the QR code image file.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='QR code image',
                schema=openapi.Schema(type=openapi.TYPE_FILE)
            ),
            404: 'QR code not found'
        }
    )
    @action(detail=True, methods=['get'])
    def download_qr_code(self, request, pk=None):
        """
        Download student's QR code image.
        
        Returns the actual QR code image file.
        """
        from django.http import FileResponse
        import os
        
        student = self.get_object()
        
        if not student.qr_code:
            return Response(
                {'error': 'QR code not generated'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Open QR code file
        qr_file = open(student.qr_code.path, 'rb')
        
        response = FileResponse(
            qr_file,
            content_type='image/png'
        )
        response['Content-Disposition'] = f'attachment; filename="qr_{student.student_number}.png"'
        
        return response
    
    @swagger_auto_schema(
        operation_summary="Regenerate QR code",
        operation_description="Manually regenerate the QR code for a student.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='QR code regenerated',
                examples={
                    'application/json': {
                        'message': 'QR code regenerated successfully',
                        'qr_code_url': 'http://example.com/media/qr_codes/qr_stu2024001.png'
                    }
                }
            ),
            400: 'Failed to regenerate QR code'
        }
    )
    @action(detail=True, methods=['post'])
    def regenerate_qr_code(self, request, pk=None):
        """
        Manually regenerate QR code.
        
        Useful if QR code was deleted or corrupted.
        """
        student = self.get_object()
        
        # Delete old QR code if exists
        if student.qr_code:
            student.qr_code.delete(save=False)
        
        # Generate new QR code
        try:
            student.generate_qr_code()
            student.save(update_fields=['qr_code'])
            
            return Response({
                'message': 'QR code regenerated successfully',
                'qr_code_url': request.build_absolute_uri(student.qr_code.url)
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to generate QR code: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @swagger_auto_schema(
        operation_summary="List all students",
        operation_description="Get a list of all students with filtering and search options.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='List of students',
                examples={
                    'application/json': {
                        'count': 100,
                        'next': 'http://example.com/api/students/?page=2',
                        'previous': None,
                        'results': []
                    }
                }
            )
        }
    )
    def list(self, request, *args, **kwargs):
        """List all students with pagination, filtering, and search."""
        queryset = self.filter_queryset(self.get_queryset())
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_summary="Bulk import students from CSV/Excel",
        operation_description="Upload a CSV or Excel file containing student data. Required columns: studentNumber, fullName, nationalId, department, year, gender.",
        tags=['Students'],
        request=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'file': openapi.Schema(type=openapi.TYPE_FILE, description='CSV or Excel file')
            },
            required=['file']
        ),
        responses={
            200: openapi.Response(
                description='Import summary',
                examples={
                    'application/json': {
                        'message': 'Successfully imported 50 students',
                        'total': 50,
                        'created': 48,
                        'failed': 2,
                        'errors': [{'row': 5, 'student_number': 'STU2024005', 'error': 'Duplicate student number'}]
                    }
                }
            ),
            400: 'Bad Request - Invalid file format'
        }
    )
    @action(detail=False, methods=['post'], parser_classes=[parsers.MultiPartParser, parsers.FileUploadParser])
    def bulk_import(self, request):
        """
        Bulk import students from CSV or Excel file.
        
        Required columns:
        - studentNumber
        - fullName
        - nationalId
        - department
        - year
        - gender
        
        QR codes are automatically generated for all imported students.
        """
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        filename = file.name.lower()
        
        try:
            # Read file based on extension
            if filename.endswith('.csv'):
                # Decode CSV file
                decoded_file = file.read().decode('utf-8').splitlines()
                reader = csv.DictReader(decoded_file)
                data = list(reader)
            elif filename.endswith(('.xlsx', '.xls')):
                # Read Excel file using pandas
                df = pd.read_excel(file)
                data = df.to_dict('records')
            else:
                return Response(
                    {'error': 'Unsupported file format. Please upload CSV or Excel file.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate and process data
            results = {
                'total': len(data),
                'created': 0,
                'failed': 0,
                'errors': []
            }
            
            # Department mapping (case-insensitive)
            department_map = {dept.value.upper(): dept.value for dept in Student._meta.get_field('department').choices}
            gender_map = {gender.value.upper(): gender.value for gender in Student._meta.get_field('gender').choices}
            
            for idx, row in enumerate(data, start=1):
                try:
                    # Normalize column names (remove spaces, convert to lowercase)
                    normalized_row = {k.strip().lower().replace(' ', '_'): v for k, v in row.items()}
                    
                    # Extract and validate required fields
                    student_number = str(normalized_row.get('studentnumber', '')).strip()
                    full_name = str(normalized_row.get('fullname', '')).strip()
                    national_id = str(normalized_row.get('nationalid', '')).strip()
                    department_raw = str(normalized_row.get('department', '')).strip().upper()
                    year_raw = int(float(normalized_row.get('year', 1)))
                    gender_raw = str(normalized_row.get('gender', 'MALE')).strip().upper()
                    
                    # Validate required fields
                    if not all([student_number, full_name, national_id]):
                        raise ValueError('Missing required fields')
                    
                    # Map department
                    department = department_map.get(department_raw)
                    if not department:
                        raise ValueError(f'Invalid department: {department_raw}')
                    
                    # Map gender
                    gender = gender_map.get(gender_raw)
                    if not gender:
                        raise ValueError(f'Invalid gender: {gender_raw}')
                    
                    # Validate year of study
                    if year_raw < 1 or year_raw > 5:
                        raise ValueError(f'Invalid year: {year_raw}')
                    
                    # Create student record
                    student = Student.objects.create(
                        student_number=student_number,
                        full_name=full_name,
                        national_id=national_id,
                        department=department,
                        year_of_study=year_raw,
                        gender=gender,
                        is_registered=True
                    )
                    
                    results['created'] += 1
                    
                except Exception as e:
                    results['failed'] += 1
                    results['errors'].append({
                        'row': idx,
                        'student_number': row.get('studentNumber', 'Unknown'),
                        'error': str(e)
                    })
            
            # Return summary
            message = f"Successfully imported {results['created']} students"
            if results['failed'] > 0:
                message += f" ({results['failed']} failed)"
            
            return Response({
                'message': message,
                'total': results['total'],
                'created': results['created'],
                'failed': results['failed'],
                'errors': results['errors'][:10]  # Limit errors shown
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to process file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @swagger_auto_schema(
        operation_summary="Generate printable ID cards",
        operation_description="Generate PDF ID cards for students. Can generate for single student or multiple students.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='PDF file',
                schema=openapi.Schema(type=openapi.TYPE_FILE)
            ),
            404: 'No students with photos found'
        }
    )
    @action(detail=False, methods=['get'])
    def generate_id_cards(self, request):
        """
        Generate printable PDF ID cards for students.
        
        Optionally filter by student IDs: ?ids=1,2,3
        Only includes students with uploaded photos.
        """
        # Get student IDs from query params
        student_ids = request.GET.get('ids', None)
        
        if student_ids:
            ids_list = [int(x) for x in student_ids.split(',')]
            queryset = Student.objects.filter(id__in=ids_list, photo__isnull=False)
        else:
            queryset = Student.objects.filter(photo__isnull=False)
        
        if not queryset.exists():
            return Response(
                {'error': 'No students with photos found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1a365d'),
            alignment=TA_CENTER,
            spaceAfter=30
        )
        
        # Title
        elements.append(Paragraph("Mutare Teachers College - Student ID Cards", title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Create ID cards
        for student in queryset:
            card_data = self._create_id_card(student, request)
            elements.extend(card_data)
            elements.append(Spacer(1, 0.2*inch))
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        response = FileResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="student_id_cards.pdf"'
        
        return response
    
    def _create_id_card(self, student, request):
        """
        Create a single ID card layout for a student.
        Returns list of Platypus elements.
        """
        elements = []
        
        # Card dimensions (approximate credit card size scaled up)
        card_width = 8.5*cm
        card_height = 5.5*cm
        
        # Create table for card layout
        card_table = Table([[None, None]], colWidths=[2.5*cm, card_width-2.5*cm], rowHeights=[card_height])
        
        # Left side: Photo
        photo_data = []
        if student.photo:
            try:
                # Open and resize photo
                photo_path = student.photo.path
                img = Image(photo_path, width=2.3*cm, height=2.8*cm)
                photo_data.append(img)
            except:
                photo_data.append(Paragraph("No Photo", styles['Normal']))
        else:
            photo_data.append(Paragraph("No Photo", styles['Normal']))
        
        # Right side: Student details
        details = []
        
        # Institution name
        details.append(Paragraph(
            "<b>MUTARE TEACHERS COLLEGE</b>",
            ParagraphStyle('Institution', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#1a365d'), alignment=TA_CENTER)
        ))
        details.append(Spacer(1, 0.1*inch))
        
        # STUDENT label
        details.append(Paragraph(
            "<b>STUDENT</b>",
            ParagraphStyle('StudentLabel', parent=styles['Normal'], fontSize=8, alignment=TA_CENTER)
        ))
        details.append(Spacer(1, 0.15*inch))
        
        # Student info
        info_style = ParagraphStyle('Info', parent=styles['Normal'], fontSize=7, alignment=TA_LEFT)
        details.append(Paragraph(f"<b>Name:</b> {student.full_name}", info_style))
        details.append(Paragraph(f"<b>ID:</b> {student.student_number}", info_style))
        details.append(Paragraph(f"<b>Dept:</b> {student.get_department_display()}", info_style))
        details.append(Paragraph(f"<b>Year:</b> {student.get_year_of_study_display()}", info_style))
        
        # Add QR code if available
        if student.qr_code:
            try:
                qr_path = student.qr_code.path
                qr_img = Image(qr_path, width=1.2*cm, height=1.2*cm)
                details.append(Spacer(1, 0.1*inch))
                details.append(qr_img)
            except:
                pass
        
        # Combine photo and details
        card_table_data = [[Table([photo_data], style=TableStyle([('ALIGN', (0, 0), (-1, -1), 'center')])), 
                           Table([details], style=TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))]]
        
        card_table = Table(card_table_data, colWidths=[2.5*cm, card_width-2.5*cm])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#1a365d')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(card_table)
        return elements
    
    @swagger_auto_schema(
        operation_summary="Generate single student ID card",
        operation_description="Generate PDF ID card for a specific student.",
        tags=['Students'],
        responses={
            200: openapi.Response(
                description='PDF file',
                schema=openapi.Schema(type=openapi.TYPE_FILE)
            ),
            404: 'Student photo not found'
        }
    )
    @action(detail=True, methods=['get'])
    def id_card(self, request, pk=None):
        """
        Generate printable ID card for a single student.
        
        Requires student to have uploaded a photo.
        """
        student = self.get_object()
        
        if not student.photo:
            return Response(
                {'error': 'Student photo not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        
        # Create ID card
        card_data = self._create_id_card(student, request)
        elements.extend(card_data)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        response = FileResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="id_card_{student.student_number}.pdf"'
        
        return response

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DiningAttendanceViewSet,
    QRScanView,
    MealEligibilityView,
    DiningDashboardView,
    OfflineScanSyncView,
    OfflineScanStatusView,
    OfflineDashboardView,
    dining_stats
)

router = DefaultRouter()
router.register(r'attendance', DiningAttendanceViewSet, basename='dining-attendance')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # QR Code Scanning endpoint
    path('scan/', QRScanView.as_view(), name='dining-scan'),
    
    # Meal eligibility check
    path('eligibility/', MealEligibilityView.as_view(), name='meal-eligibility'),
    
    # Dashboard statistics
    path('dashboard/', DiningDashboardView.as_view(), name='dining-dashboard'),
    
    # Quick stats
    path('stats/', dining_stats, name='dining-stats'),
    
    # Offline mode endpoints
    path('sync/', OfflineScanSyncView.as_view(), name='offline-scan-sync'),
    path('offline-status/', OfflineScanStatusView.as_view(), name='offline-status'),
    path('offline-dashboard/', OfflineDashboardView.as_view(), name='offline-dashboard'),
]

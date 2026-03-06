from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HostelViewSet, RoomViewSet, AccommodationApplicationViewSet

# Create routers and register viewsets
router = DefaultRouter()
router.register(r'hostels', HostelViewSet, basename='hostel')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'applications', AccommodationApplicationViewSet, basename='application')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]

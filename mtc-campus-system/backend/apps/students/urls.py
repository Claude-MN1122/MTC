from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet

# Create a router and register our viewset with it
router = DefaultRouter()
router.register(r'', StudentViewSet, basename='student')

urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
]

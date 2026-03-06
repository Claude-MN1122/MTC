from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    LogoutView,
    ChangePasswordView,
    ProfileUpdateView,
    RolesListView,
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Token management
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User endpoints
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Roles
    path('roles/', RolesListView.as_view(), name='roles-list'),
]

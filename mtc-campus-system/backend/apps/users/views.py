from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from users.models import Role
from users.serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    UserProfileUpdateSerializer,
    RoleSerializer
)

CustomUser = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    
    Creates a new user account with email, full name, password, and role.
    Returns JWT tokens upon successful registration.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_summary="Register a new user",
        operation_description="Create a new user account with the provided credentials.",
        tags=['Authentication'],
        responses={
            201: openapi.Response(
                description='User registered successfully',
                examples={
                    'application/json': {
                        'message': 'Registration successful',
                        'user': {
                            'id': 1,
                            'email': 'student@mtc.ac.zw',
                            'full_name': 'John Doe',
                            'role': 'STUDENT'
                        },
                        'tokens': {
                            'refresh': 'eyJ0eXAiOiJKV1QiLCJhbG...',
                            'access': 'eyJ0eXAiOiJKV1QiLCJhbG...'
                        }
                    }
                }
            ),
            400: 'Bad Request - Invalid data or email already exists'
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    API endpoint for user login.
    
    Authenticates user with email and password, returns JWT tokens.
    """
    serializer_class = LoginSerializer
    
    @swagger_auto_schema(
        operation_summary="User login",
        operation_description="Authenticate with email and password to receive JWT tokens.",
        tags=['Authentication'],
        responses={
            200: openapi.Response(
                description='Login successful',
                examples={
                    'application/json': {
                        'refresh': 'eyJ0eXAiOiJKV1QiLCJhbG...',
                        'access': 'eyJ0eXAiOiJKV1QiLCJhbG...',
                        'user': {
                            'id': 1,
                            'email': 'student@mtc.ac.zw',
                            'full_name': 'John Doe',
                            'role': 'STUDENT',
                            'is_verified': True
                        }
                    }
                }
            ),
            401: 'Unauthorized - Invalid credentials'
        }
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response


class CurrentUserView(APIView):
    """
    API endpoint to get current authenticated user information.
    
    Returns the profile of the currently logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_summary="Get current user profile",
        operation_description="Retrieve the profile information of the currently authenticated user.",
        tags=['Authentication'],
        responses={
            200: openapi.Response(
                description='Current user data',
                schema=UserSerializer
            ),
            401: 'Unauthorized - Not authenticated'
        }
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    """
    API endpoint for user logout.
    
    Blacklists the refresh token to log out the user.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_summary="User logout",
        operation_description="Logout by blacklisting the refresh token.",
        tags=['Authentication'],
        responses={
            200: 'Successfully logged out',
            400: 'Bad Request'
        }
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    API endpoint to change user password.
    
    Allows authenticated users to change their password.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_summary="Change password",
        operation_description="Change your password by providing old and new passwords.",
        tags=['Authentication'],
        responses={
            200: 'Password changed successfully',
            400: 'Bad Request - Invalid passwords'
        }
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Verify old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'error': 'Old password is incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileUpdateView(APIView):
    """
    API endpoint to update user profile.
    
    Allows users to update their profile information.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_summary="Update profile",
        operation_description="Update your profile information (name, phone, picture).",
        tags=['Authentication'],
        request_body=UserProfileUpdateSerializer,
        responses={
            200: UserSerializer,
            400: 'Bad Request - Invalid data'
        }
    )
    def put(self, request):
        serializer = UserProfileUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RolesListView(APIView):
    """
    API endpoint to list all available roles.
    
    Returns a list of all user roles in the system.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_summary="List available roles",
        operation_description="Get all available user roles in the system.",
        tags=['Authentication'],
        responses={
            200: openapi.Response(
                description='List of roles',
                examples={
                    'application/json': [
                        {'value': 'STUDENT', 'label': 'Student'},
                        {'value': 'SUPER_ADMIN', 'label': 'Super Admin'}
                    ]
                }
            )
        }
    )
    def get(self, request):
        roles = [{'value': role[0], 'label': role[1]} for role in Role.choices]
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

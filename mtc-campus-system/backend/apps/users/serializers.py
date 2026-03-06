from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import Role

CustomUser = get_user_model()


class RoleSerializer(serializers.Serializer):
    """Serializer for user roles"""
    value = serializers.CharField()
    label = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data (excluding sensitive info)"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'full_name', 'role', 'role_display',
            'phone_number', 'profile_picture', 'is_verified',
            'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'is_verified', 'date_joined', 'last_login',
            'is_active', 'is_staff'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'full_name', 'password', 'password_confirm',
            'role', 'role_display', 'phone_number'
        ]
    
    def validate_email(self, value):
        """Validate email is not already registered"""
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, attrs):
        """Validate passwords match and role is valid"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords do not match."
            })
        
        # Validate role
        role = attrs.get('role')
        if role and role not in [r[0] for r in Role.choices]:
            raise serializers.ValidationError({
                'role': f"Invalid role. Must be one of: {', '.join([r[0] for r in Role.choices])}"
            })
        
        return attrs
    
    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            role=validated_data.get('role', Role.STUDENT),
            phone_number=validated_data.get('phone_number', '')
        )
        return user


class LoginSerializer(TokenObtainPairSerializer):
    """Custom login serializer with additional user info"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user information to response
        data.update({
            'user': {
                'id': self.user.id,
                'email': self.user.email,
                'full_name': self.user.full_name,
                'role': self.user.role,
                'role_display': self.user.get_role_display(),
                'is_verified': self.user.is_verified,
                'is_staff': self.user.is_staff,
            }
        })
        
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8
    )
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "New passwords do not match."
            })
        return attrs


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = CustomUser
        fields = [
            'full_name', 'phone_number', 'profile_picture'
        ]

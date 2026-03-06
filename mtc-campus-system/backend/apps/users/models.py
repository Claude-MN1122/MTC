from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta


class Role(models.TextChoices):
    """User roles for MTC Campus Management System"""
    SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
    SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR', 'System Administrator'
    ACCOMMODATION_OFFICER = 'ACCOMMODATION_OFFICER', 'Accommodation Officer'
    DINING_MANAGER = 'DINING_MANAGER', 'Dining Manager'
    HOSTEL_SUPERVISOR = 'HOSTEL_SUPERVISOR', 'Hostel Supervisor'
    SECURITY_OFFICER = 'SECURITY_OFFICER', 'Security Officer'
    STUDENT = 'STUDENT', 'Student'


class CustomUserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        if not full_name:
            raise ValueError('Full name is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', Role.SUPER_ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, full_name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user model with email as username and role-based access control"""
    
    email = models.EmailField(unique=True, max_length=255)
    full_name = models.CharField(max_length=255)
    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.STUDENT
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    
    # Status flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        db_table = 'auth_users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    def get_full_name(self):
        return self.full_name
    
    def get_short_name(self):
        return self.full_name.split()[0] if self.full_name else self.email
    
    def has_role(self, role):
        """Check if user has specific role"""
        return self.role == role
    
    def is_student(self):
        return self.role == Role.STUDENT
    
    def is_super_admin(self):
        return self.role == Role.SUPER_ADMIN
    
    def is_accommodation_officer(self):
        return self.role == Role.ACCOMMODATION_OFFICER
    
    def is_dining_manager(self):
        return self.role == Role.DINING_MANAGER

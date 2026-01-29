from django.db import models

class UserRole(models.TextChoices):
    PUBLIC_KIOSK = 'PUBLIC_KIOSK', 'Public Kiosk'
    TRAVELER = 'TRAVELER', 'Traveler'
    HOST = 'HOST', 'Host'
    MODERATOR = 'MODERATOR', 'Moderator'
    ADMIN = 'ADMIN', 'Admin'
    SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'

class KYCStatus(models.TextChoices):
    UNVERIFIED = 'UNVERIFIED', 'Unverified'
    PENDING = 'PENDING', 'Pending'
    VERIFIED = 'VERIFIED', 'Verified'
    REJECTED = 'REJECTED', 'Rejected'

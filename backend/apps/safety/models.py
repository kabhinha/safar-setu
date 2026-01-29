from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class ModerationTicket(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        DISMISSED = 'DISMISSED', 'Dismissed'

    # Generic link to what is being moderated (Hotspot, User, Review)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=50)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='reports_filed')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assigned_tickets')
    
    reason = models.CharField(max_length=100)
    description = models.TextField()
    
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.reason}"

import uuid
from django.utils import timezone

class CrowdAggregate(models.Model):
    class DensityState(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'

    class SourceType(models.TextChoices):
        CCTV_EDGE = 'CCTV_EDGE', 'CCTV Edge'
        MANUAL = 'MANUAL', 'Manual'
        OTHER = 'OTHER', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    district_id = models.CharField(max_length=50)
    hotspot_id = models.CharField(max_length=50, null=True, blank=True)
    source_type = models.CharField(max_length=50, choices=SourceType.choices, default=SourceType.CCTV_EDGE)
    density_state = models.CharField(max_length=50, choices=DensityState.choices)
    count_15min = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.district_id} - {self.density_state} @ {self.timestamp}"

class DistrictRestriction(models.Model):
    class RestrictionType(models.TextChoices):
        WETLAND = 'WETLAND', 'Wetland'
        FOREST = 'FOREST', 'Forest'
        BORDER = 'BORDER', 'Border'
        WEATHER = 'WEATHER', 'Weather'
        OTHER = 'OTHER', 'Other'
        
    class Severity(models.TextChoices):
        INFO = 'INFO', 'Info'
        WARNING = 'WARNING', 'Warning'
        CRITICAL = 'CRITICAL', 'Critical'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    district_id = models.CharField(max_length=50)
    restriction_type = models.CharField(max_length=50, choices=RestrictionType.choices)
    message = models.TextField()
    severity = models.CharField(max_length=50, choices=Severity.choices, default=Severity.INFO)
    start_at = models.DateTimeField(default=timezone.now)
    end_at = models.DateTimeField()
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self):
        now = timezone.now()
        return self.start_at <= now <= self.end_at

class EmergencyContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    district_id = models.CharField(max_length=50, null=True, blank=True)
    label = models.CharField(max_length=100) # Police, Medical, etc.
    phone = models.CharField(max_length=50)
    alternate_phone = models.CharField(max_length=50, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.label} ({self.district_id or 'Global'})"

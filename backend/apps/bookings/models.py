from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import uuid

class Inquiry(models.Model):
    class Status(models.TextChoices):
        RECEIVED = 'RECEIVED', _('Received')
        CONTACTED = 'CONTACTED', _('Contacted')
        CLOSED = 'CLOSED', _('Closed')
        SPAM = 'SPAM', _('Spam')

    class ResourceType(models.TextChoices):
        HOTSPOT = 'HOTSPOT', _('Hotspot')
        SIGHT = 'SIGHT', _('Sight')
        GENERAL = 'GENERAL', _('General')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Contact Info
    phone = models.CharField(max_length=20)
    name = models.CharField(max_length=100, blank=True)
    
    # Visit Details
    group_size = models.PositiveIntegerField(null=True, blank=True)
    preferred_date = models.DateField(null=True, blank=True)
    note = models.TextField(blank=True)
    
    # Context
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices, default=ResourceType.GENERAL)
    resource_id = models.CharField(max_length=100, blank=True) # ID of hotspot/sight
    
    # Status
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RECEIVED)
    reference_token = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')

    def save(self, *args, **kwargs):
        if not self.reference_token:
            # Simple reference gen (e.g., VIS-1234)
            # In a real app we'd want something collision-resistant but short
            import random
            import string
            suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            self.reference_token = f"VIS-{suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Inquiry {self.reference_token} ({self.phone})"

from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

class BroadcastMessage(models.Model):
    class Category(models.TextChoices):
        FESTIVAL = 'FESTIVAL', 'Festival'
        ROUTE_CLOSURE = 'ROUTE_CLOSURE', 'Route Closure'
        ADVISORY = 'ADVISORY', 'Advisory'
        CROWD_WARNING = 'CROWD_WARNING', 'Crowd Warning'

    class Severity(models.TextChoices):
        INFO = 'INFO', 'Info'
        WARNING = 'WARNING', 'Warning'
        CRITICAL = 'CRITICAL', 'Critical'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    district_id = models.CharField(max_length=50, null=True, blank=True, help_text="Null for global")
    category = models.CharField(max_length=50, choices=Category.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    severity = models.CharField(max_length=50, choices=Severity.choices, default=Severity.INFO)
    
    start_at = models.DateTimeField(default=timezone.now)
    end_at = models.DateTimeField()
    
    is_active_override = models.BooleanField(default=True, help_text="Manually disable")
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_active(self):
        now = timezone.now()
        return self.is_active_override and self.start_at <= now <= self.end_at

    def __str__(self):
        return f"[{self.category}] {self.title}"

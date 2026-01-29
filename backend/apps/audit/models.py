from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings

class AuditLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=50) # CREATE, UPDATE, DELETE, LOGIN, etc.
    
    # Generic FK to target object
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.CharField(max_length=50, null=True) # Char to support UUIDs
    content_object = GenericForeignKey('content_type', 'object_id')
    
    changes = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        db_table = 'audit_logs'

    def __str__(self):
        return f"{self.timestamp} - {self.actor} - {self.action}"

from django.db import models
import uuid

class KioskDevice(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        MAINTENANCE = 'MAINTENANCE', 'Maintenance'
        DECOMMISSIONED = 'DECOMMISSIONED', 'Decommissioned'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, help_text="Friendly name: e.g. 'North Gate Kiosk 1'")
    hardware_id = models.CharField(max_length=100, unique=True, help_text="Hardware Serial / MAC")
    
    # We use string reference to avoid direct dependency if Geography isn't ready or circular
    district_name = models.CharField(max_length=100, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    api_key_hash = models.CharField(max_length=255, blank=True, null=True, help_text="Hashed API Key for auth")
    
    last_heartbeat = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.hardware_id})"

class KioskHeartbeat(models.Model):
    kiosk = models.ForeignKey(KioskDevice, on_delete=models.CASCADE, related_name='heartbeats')
    timestamp = models.DateTimeField(auto_now_add=True)
    ipv4 = models.GenericIPAddressField(null=True, blank=True)
    status_payload = models.JSONField(default=dict, help_text="Device health metrics")
    
    def __str__(self):
        return f"{self.kiosk.name} @ {self.timestamp}"

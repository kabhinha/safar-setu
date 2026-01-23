import uuid
from django.db import models
from django.utils import timezone

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_amount = models.DecimalField(max_digits=10, decimal_places=2)
    vendor_id = models.IntegerField(help_text="Reference ID for pilot")
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Deal(models.Model):
    class Status(models.TextChoices):
        INITIATED = 'INITIATED', 'Initiated'
        VENDOR_CONFIRMED = 'VENDOR_CONFIRMED', 'Vendor Confirmed'
        CLOSED = 'CLOSED', 'Closed'
        EXPIRED = 'EXPIRED', 'Expired'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor_id = models.IntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED)
    kiosk_id = models.CharField(max_length=50, blank=True, null=True)
    district_id = models.CharField(max_length=50, blank=True, null=True)
    amount_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Deal {self.id} - {self.status}"

class DealToken(models.Model):
    class TokenType(models.TextChoices):
        TRAVELER_INTENT = 'TRAVELER_INTENT', 'Traveler Intent'
        VENDOR_CONFIRM = 'VENDOR_CONFIRM', 'Vendor Confirm'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name='tokens')
    token_type = models.CharField(max_length=20, choices=TokenType.choices)
    token_value = models.UUIDField(default=uuid.uuid4)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (not self.used_at) and (timezone.now() < self.expires_at)

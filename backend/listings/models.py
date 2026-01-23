from django.db import models
from django.conf import settings

class Hotspot(models.Model):
    class Status(models.TextChoices):
        Draft = 'DRAFT', 'Draft'
        Pending = 'UNDER_REVIEW', 'Under Review' # Renamed from PENDING
        ChangesRequested = 'CHANGES_REQUESTED', 'Changes Requested'
        Approved = 'APPROVED', 'Approved' # Ready to be published
        Live = 'LIVE', 'Live' # Visible to public
        Suspended = 'SUSPENDED', 'Suspended'
        Archived = 'ARCHIVED', 'Archived'

    class Sensitivity(models.TextChoices):
        Public = 'PUBLIC', 'Public'
        Protected = 'PROTECTED', 'Protected (Generalized)'
        Restricted = 'RESTRICTED', 'Restricted (Hidden)'

    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hotspots')
    
    # Basic Info
    name = models.CharField(max_length=200) # Title
    short_description = models.CharField(max_length=255, help_text="Tweet-sized summary")
    description = models.TextField(help_text="Full detailed narrative")
    
    # Location Abstraction
    district = models.CharField(max_length=100)
    village_cluster_label = models.CharField(max_length=100, help_text="Public safe label (e.g., 'Upper Majuli Cluster')")
    sensitivity_level = models.CharField(max_length=20, choices=Sensitivity.choices, default=Sensitivity.Public)
    
    # Details
    duration_minutes = models.IntegerField(null=True, blank=True)
    operating_hours = models.CharField(max_length=100, blank=True, help_text="e.g., '09:00 - 17:00'")
    seasons = models.JSONField(default=list, blank=True, help_text="e.g., ['Winter', 'Spring']")
    tags = models.JSONField(default=list, blank=True)
    
    # Safety & Access
    safety_notes = models.TextField(blank=True, help_text="Public safety warnings")
    accessibility_notes = models.TextField(blank=True)

    # Lifecycle
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.Draft)
    moderation_notes = models.TextField(blank=True, help_text="Internal notes")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_hotspots')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

class Media(models.Model):
    hotspot = models.ForeignKey(Hotspot, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='hotspot_media/')
    type = models.CharField(max_length=20) # image, video
    is_cover = models.BooleanField(default=False)
    
    # Compliance
    compliance_checked = models.BooleanField(default=False)
    compliance_notes = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Media for {self.hotspot.name}"

class ModerationTicket(models.Model):
    class Reason(models.TextChoices):
        SensitiveInfo = 'SENSITIVE_INFO', 'Sensitive Info Risk'
        PII = 'PII_RISK', 'PII Risk'
        Policy = 'POLICY_VIOLATION', 'Policy Violation'
        Quality = 'QUALITY_FIX', 'Quality Fix'
        DisallowedPhrase = 'DISALLOWED_PHRASE', 'Disallowed Phrase'

    class Status(models.TextChoices):
        Open = 'OPEN', 'Open'
        Resolved = 'RESOLVED', 'Resolved'
        Closed = 'CLOSED', 'Closed'

    hotspot = models.ForeignKey(Hotspot, on_delete=models.CASCADE, related_name='tickets')
    reason_code = models.CharField(max_length=50, choices=Reason.choices)
    notes = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.Open)
    
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='listing_moderation_tickets')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.hotspot.name}"

class Review(models.Model):
    hotspot = models.ForeignKey(Hotspot, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

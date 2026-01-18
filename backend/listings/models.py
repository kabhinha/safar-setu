from django.db import models
from django.conf import settings

class Hotspot(models.Model):
    class Status(models.TextChoices):
        Draft = 'DRAFT', 'Draft'
        Pending = 'PENDING', 'Pending Review'
        Approved = 'APPROVED', 'Approved'
        Rejected = 'REJECTED', 'Rejected'
        ChangesRequested = 'CHANGES_REQUESTED', 'Changes Requested'

    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hotspots')
    name = models.CharField(max_length=200)
    description = models.TextField()
    district = models.CharField(max_length=100) # Text for now, eventually FK to geography
    
    # STRICT: No GPS fields allowed
    
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.Draft)
    moderation_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Media(models.Model):
    hotspot = models.ForeignKey(Hotspot, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='hotspot_media/')
    type = models.CharField(max_length=20) # image, video
    is_cover = models.BooleanField(default=False)

class Review(models.Model):
    hotspot = models.ForeignKey(Hotspot, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

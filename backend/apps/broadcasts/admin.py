from django.contrib import admin
from .models import BroadcastMessage

@admin.register(BroadcastMessage)
class BroadcastMessageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'severity', 'is_active', 'start_at', 'end_at')
    list_filter = ('category', 'severity', 'is_active_override')
    search_fields = ('title', 'message')

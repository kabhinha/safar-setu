from django.contrib import admin
from .models import Hotspot, Media, Review, ModerationTicket

class MediaInline(admin.TabularInline):
    model = Media
    extra = 1
    fields = ('file', 'type', 'is_cover', 'compliance_checked', 'compliance_notes')

class TicketInline(admin.StackedInline):
    model = ModerationTicket
    extra = 0
    readonly_fields = ('created_at', 'status')

@admin.register(Hotspot)
class HotspotAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'district', 'village_cluster_label', 'host', 'sensitivity_level', 'created_at')
    list_filter = ('status', 'sensitivity_level', 'district')
    search_fields = ('name', 'description', 'short_description')
    inlines = [MediaInline, TicketInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'short_description', 'description', 'host', 'status')
        }),
        ('Location & Sensitivity', {
            'fields': ('district', 'village_cluster_label', 'sensitivity_level')
        }),
        ('Operations', {
            'fields': ('duration_minutes', 'operating_hours', 'seasons', 'tags')
        }),
        ('Safety & Access', {
            'fields': ('safety_notes', 'accessibility_notes')
        }),
        ('Decision-at-Time (Kiosk)', {
            'fields': ('approx_travel_time_min', 'distance_band', 'nearest_transport_hub_name', 'nearest_transport_hub_type')
        }),
        ('Moderation', {
            'fields': ('approved_by', 'moderation_notes')
        }),
    )

    actions = ['approve_hotspots', 'reject_hotspots', 'publish_hotspots']

    @admin.action(description='Approve selected hotspots')
    def approve_hotspots(self, request, queryset):
        queryset.update(status=Hotspot.Status.Approved, approved_by=request.user)

    @admin.action(description='Reject selected hotspots')
    def reject_hotspots(self, request, queryset):
        queryset.update(status=Hotspot.Status.Rejected)

    @admin.action(description='Publish (Go Live)')
    def publish_hotspots(self, request, queryset):
        queryset.filter(status=Hotspot.Status.Approved).update(status=Hotspot.Status.Live)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('hotspot', 'author', 'rating', 'created_at')
    list_filter = ('rating',)

@admin.register(ModerationTicket)
class ModerationTicketAdmin(admin.ModelAdmin):
    list_display = ('hotspot', 'reason_code', 'status', 'assigned_to', 'created_at')
    list_filter = ('status', 'reason_code')
    search_fields = ('hotspot__name', 'notes')

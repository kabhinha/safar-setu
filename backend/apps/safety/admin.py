from django.contrib import admin
from .models import ModerationTicket, CrowdAggregate, DistrictRestriction, EmergencyContact


@admin.register(ModerationTicket)
class ModerationTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'reason', 'status', 'assigned_to', 'reported_by', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('reason', 'description', 'reported_by__email', 'assigned_to__email')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_open', 'mark_in_progress', 'mark_resolved', 'mark_dismissed']

    @admin.action(description="Mark as Open")
    def mark_open(self, request, queryset):
        queryset.update(status=ModerationTicket.Status.OPEN)

    @admin.action(description="Mark In Progress")
    def mark_in_progress(self, request, queryset):
        queryset.update(status=ModerationTicket.Status.IN_PROGRESS)

    @admin.action(description="Mark Resolved")
    def mark_resolved(self, request, queryset):
        queryset.update(status=ModerationTicket.Status.RESOLVED)

    @admin.action(description="Mark Dismissed")
    def mark_dismissed(self, request, queryset):
        queryset.update(status=ModerationTicket.Status.DISMISSED)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(CrowdAggregate)
class CrowdAggregateAdmin(admin.ModelAdmin):
    list_display = ('district_id', 'hotspot_id', 'density_state', 'source_type', 'timestamp')
    list_filter = ('density_state', 'source_type')
    search_fields = ('district_id', 'hotspot_id')
    readonly_fields = ('timestamp', 'created_at')
    ordering = ('-timestamp',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(DistrictRestriction)
class DistrictRestrictionAdmin(admin.ModelAdmin):
    list_display = ('district_id', 'restriction_type', 'severity', 'start_at', 'end_at', 'created_by')
    list_filter = ('restriction_type', 'severity', 'district_id', 'start_at')
    search_fields = ('district_id', 'message')
    readonly_fields = ('created_at', 'created_by')
    ordering = ('-start_at',)

    def save_model(self, request, obj, form, change):
        if not obj.created_by_id:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('label', 'phone', 'district_id', 'active')
    list_filter = ('active', 'district_id')
    search_fields = ('label', 'phone', 'district_id')
    ordering = ('label',)

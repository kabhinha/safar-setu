from django.contrib import admin
from .models import BroadcastMessage


@admin.register(BroadcastMessage)
class BroadcastMessageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'severity', 'district_id', 'start_at', 'end_at', 'is_active_override')
    list_filter = ('category', 'severity', 'is_active_override', 'district_id', 'start_at')
    search_fields = ('title', 'message', 'district_id')
    ordering = ('-start_at',)
    date_hierarchy = 'start_at'
    readonly_fields = ('created_at', 'updated_at')

    actions = ['publish_selected', 'disable_selected']

    @admin.action(description="Publish (enable override)")
    def publish_selected(self, request, queryset):
        queryset.update(is_active_override=True)

    @admin.action(description="Disable broadcasts")
    def disable_selected(self, request, queryset):
        queryset.update(is_active_override=False)

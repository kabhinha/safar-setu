from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'actor', 'action', 'content_type', 'object_id', 'ip_address')
    list_filter = ('action', 'content_type', 'timestamp')
    search_fields = ('actor__email', 'actor__username', 'object_id', 'ip_address')
    readonly_fields = ('timestamp', 'actor', 'action', 'content_type', 'object_id', 'content_object', 'changes', 'ip_address', 'user_agent')
    date_hierarchy = 'timestamp'
    ordering = ('-timestamp',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

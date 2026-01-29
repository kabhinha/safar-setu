from django.contrib import admin
from apps.core.admin_utils import register_all_models
from .models import KioskDevice, KioskHeartbeat

class HeartbeatInline(admin.TabularInline):
    model = KioskHeartbeat
    extra = 0
    readonly_fields = ('timestamp', 'ipv4', 'status_payload')
    can_delete = False
    max_num = 10

@admin.register(KioskDevice)
class KioskDeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'hardware_id', 'status', 'last_heartbeat', 'district_name')
    list_filter = ('status', 'district_name')
    search_fields = ('name', 'hardware_id')
    inlines = [HeartbeatInline]

# register any remaining kiosk models for visibility
register_all_models('kiosk', exclude={'KioskDevice', 'KioskHeartbeat'})

from django.contrib import admin
from apps.core.admin_utils import register_all_models
from .models import Product, Deal, DealToken


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price_amount', 'vendor_id', 'active', 'created_at')
    list_filter = ('active',)
    search_fields = ('title', 'vendor_id')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'status', 'vendor_id', 'kiosk_id', 'district_id', 'created_at', 'expires_at')
    list_filter = ('status', 'district_id', 'kiosk_id')
    search_fields = ('id', 'product__title', 'vendor_id', 'kiosk_id')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('product',)
    ordering = ('-created_at',)

    actions = ['mark_closed', 'mark_cancelled']

    @admin.action(description="Mark closed")
    def mark_closed(self, request, queryset):
        queryset.update(status=Deal.Status.CLOSED)

    @admin.action(description="Mark cancelled")
    def mark_cancelled(self, request, queryset):
        queryset.update(status=Deal.Status.CANCELLED)


@admin.register(DealToken)
class DealTokenAdmin(admin.ModelAdmin):
    list_display = ('deal', 'token_type', 'token_value', 'expires_at', 'used_at')
    list_filter = ('token_type',)
    search_fields = ('token_value', 'deal__id')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('deal',)
    ordering = ('-expires_at',)

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


# catch-all for any unregistered commerce models
register_all_models('commerce', exclude={'Product', 'Deal', 'DealToken'})

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InviteCode


class SafeUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'nationality', 'kyc_status', 'is_active', 'date_joined')
    list_filter = ('role', 'kyc_status', 'is_active', 'nationality')
    search_fields = ('username', 'email', 'phone_number', 'identity_value')
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined')

    fieldsets = UserAdmin.fieldsets + (
        ('Verification & Role', {
            'fields': (
                'role', 'kyc_status', 'phone_number', 'kiosk_id',
                'nationality', 'country', 'identity_type', 'identity_value', 'address'
            )
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Verification & Role', {'fields': ('role', 'kyc_status', 'phone_number', 'email')}),
    )

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        # Moderators cannot elevate roles or deactivate accounts
        if not request.user.is_superuser and getattr(request.user, 'role', None) == User.Role.MODERATOR:
            return False
        return super().has_change_permission(request, obj)


@admin.register(User)
class CustomUserAdmin(SafeUserAdmin):
    pass


@admin.register(InviteCode)
class InviteCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'assigned_role', 'current_usage', 'max_usage', 'is_active', 'expiry_date')
    list_filter = ('assigned_role', 'is_active')
    search_fields = ('code',)
    readonly_fields = ('current_usage',)

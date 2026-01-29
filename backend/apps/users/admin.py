from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InviteCode

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'kyc_status', 'is_active', 'date_joined')
    list_filter = ('role', 'kyc_status', 'is_active')
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Verification & Role', {'fields': ('role', 'kyc_status', 'phone_number', 'kiosk_id')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Verification & Role', {'fields': ('role', 'kyc_status', 'phone_number', 'email')}),
    )

@admin.register(InviteCode)
class InviteCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'assigned_role', 'current_usage', 'max_usage', 'is_active', 'expiry_date')
    list_filter = ('assigned_role', 'is_active')
    search_fields = ('code',)

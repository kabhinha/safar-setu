from rest_framework import permissions
from shared.contracts.enums import UserRole

class IsKiosk(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request, 'is_kiosk', False)

class IsStartAuthenticated(permissions.BasePermission):
    """
    Allow access to authenticated users OR Verified Kiosks (for specific endpoints).
    """
    def has_permission(self, request, view):
        is_kiosk = getattr(request, 'is_kiosk', False)
        return bool(request.user and request.user.is_authenticated) or is_kiosk

class HasRole(permissions.BasePermission):
    """
    Base class for Role checks.
    """
    required_roles = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Ensure we compare against strings or Enum values correctly
        return request.user.role in self.required_roles

class IsTraveler(HasRole):
    required_roles = [
        UserRole.TRAVELER, 
        UserRole.HOST, 
        UserRole.MODERATOR, 
        UserRole.ADMIN, 
        UserRole.SUPER_ADMIN
    ]

class IsHost(HasRole):
    required_roles = [
        UserRole.HOST, 
        UserRole.MODERATOR, 
        UserRole.ADMIN, 
        UserRole.SUPER_ADMIN
    ]

class IsModerator(HasRole):
    required_roles = [
        UserRole.MODERATOR, 
        UserRole.ADMIN, 
        UserRole.SUPER_ADMIN
    ]

class IsAdmin(HasRole):
    required_roles = [
        UserRole.ADMIN, 
        UserRole.SUPER_ADMIN
    ]

class IsSuperAdmin(HasRole):
    required_roles = [UserRole.SUPER_ADMIN]

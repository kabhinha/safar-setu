# RBAC App (`backend/apps/rbac`)

The `rbac` (Role-Based Access Control) app centralizes permission logic and authorization services.

## Components

### `PermissionService`
- **Purpose**: Checks if a user can perform an action on a resource based on their role and the resource's state.

### Permissions (DRF)
- **`IsKiosk`**: Validates request originates from a verified Kiosk (via headers/middleware).
- **`HasRole`**: Decorator/Permission class to enforce Role requirements (e.g., `ADMIN` only).

## Roles
- Defined in shared contracts (`UserRole`): `TRAVELER`, `HOST`, `MODERATOR`, `ADMIN`.

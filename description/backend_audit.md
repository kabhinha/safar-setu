# Audit App (`backend/apps/audit`)

The `audit` app provides a centralized mechanism to track and log critical system actions for governance and security.

## Models

### `AuditLog`
- **Fields**: `actor` (User), `action` (CREATE, UPDATE, DELETE), `timestamp`, `content_object` (Generic FK), `changes` (JSON diff), `ip_address`, `user_agent`.
- **Purpose**: Immutable record of who did what and when.

## Middleware
- **`AuditLogMiddleware`**: Intercepts requests to automatically log non-safe methods (POST, PUT, DELETE) if configured.

Django Backend Architecture & Design Specification
1. 🧠 Django Backend Architecture Overview
The backend is the Authority Layer for Project X, enforcing strict security, governance, and business rules. It is a Modular Monolith built with Django Rest Framework (DRF).

Key Architectural Principles:

Security First: "Deny by default". Explicit permissions required for everything.
Audit-Driven: Every state change is recorded inmuthably.
Location Abstaction: No GPS coordinates stored or transmitted.
Kiosk Isolation: Kiosks operate in a restricted, unauthenticated (or fixed-identity) mode distinct from mobile users.
2. 🏗 App Structure & Responsibilities
We utilize a domain-driven app structure:

backend/
├── config/             # Settings, WSGI, ASGI, Root URLs
├── core/               # Shared utilities, Abstract Models, Middleware
├── users/              # custom User model, Auth, Profiles, KYC
├── rbac/               # Permission classes, Groups, ABAC Logic (New)
├── listings/           # Hotspots, Reviews, Media (Hotspots = Listings)
├── safety/             # Moderation Queue, Reports, Keywords
├── audit/              # Immutable Audit Logs (New)
├── geography/          # Districts, Regions (Location Abstraction)
├── commerce/           # QR Codes, Payments (Interface only)
└── features/           # Feature Flags (New)
Justification for Separation:

rbac: Centralizes complex permission logic, keeping views clean.
audit: Ensures logging is decoupled from business logic.
features: Allows granual control over Pilot/Emergency states.
3. 🔐 Auth & Invite-Only Flow
Authentication Stategy: SimpleJWT (Access/Refresh tokens)

Onboarding Flow (Invite-Only):

Admin/Host generates InviteCode (linked to specific Role + District).
User submits POST /auth/signup with:
invite_code
email (or phone)
password (set immediately, no temporary passwords)
Backend validates code:
Check is_active
Check usage_count < max_usage
Check expiry
User Created: Role assigned based on Invite Code.
Token Issuance: JWT Pair returned.
Kiosk Handling:

Kiosks do NOT use standard Auth.
They use X-Kiosk-ID and API Key headers.
Requests are routed to restricted "Public View" serializers.
4. 🧩 RBAC Role & Permission Mapping
Roles (User.role field):

PUBLIC_KIOSK (Technical User)
TRAVELER (Standard User)
HOST (Vendor/Business)
MODERATOR (Content Safety)
ADMIN (Regional Admin)
SUPER_ADMIN (System Owner)
Permission Implementation:

NOT using Django's default Groups/Permissions for business logic (too rigid).
Using Custom DRF BasePermission classes:
IsTraveler, IsHost, IsModerator, IsAdmin.
HasRole(role_list) factory.
5. 🧠 ABAC Rules & Enforcement Strategy
Attribute-Based Access Control logic overlays RBAC.

Enforcement: 

Core
 Middleware + Mixins.

Rules Engine (in rbac/services.py):

User Status: IF user.is_verified=False -> CANNOT create_listing.
Time Window: IF now() < pilot_start -> CANNOT Login (unless Admin).
Crowd Density: IF district.density > threshold -> CANNOT issue_promotion.
Order State: IF order.status != 'completed' -> CANNOT leave_review.
Example Permission Class:

class CanViewSensitiveDetails(BasePermission):
    def has_object_permission(self, request, view, obj):
        # RBAC
        if request.user.role == 'ADMIN': return True
        # ABAC
        return (obj.is_approved and 
                request.user.kyc_status == 'VERIFIED' and
                request.user.district == obj.district)
6. 🛡 Middleware & Security Enforcement Points
KioskIsolationMiddleware:
Intercepts requests with X-Kiosk-ID.
Enforces Read-Only on non-interactive endpoints.
Blocks access to /users/me, /wallet, etc.
RBACEnforcementMiddleware:
Global safety net. Rejects requests to /admin/* if role < ADMIN.
AuditMiddleware:
Logs standard request details (User, IP, Path, Status) for strictly regulated endpoints.
7. 🧾 Audit Logging Design
Model: audit.AuditLog

id: UUID
timestamp: DateTime (auto_now_add)
actor: User (FK)
action: String (e.g., "APPROVE_LISTING", "BAN_USER")
target_model: ContentType
target_id: String
changes: JSONField (Snapshot of Diff)
ip_address: GenericIPAddress
Guarantees:

Append-Only: Admin site disallows Delete/Updates on this model.
Signals: post_save signals trigger logs for critical models (

User
, Listing).
8. 🚦 Feature Flag & Governance Controls
Model: features.FeatureFlag

name: String
is_global_enabled: Bool
enabled_districts: ManyToMany(District)
rollout_percentage: Integer (0-100)
Governance Checks:

LoginView checks PILOT_ACTIVE flag.
ListingCreate checks HOST_ONBOARDING_ENABLED flag.
9. 🔄 Migration Notes (FastAPI → Django)
Database: Re-use Postgres. Django ORM will manage schema.
Data Preservation: If data exists, write a migration script to map standard SQL tables to Django Models.
Components:
FastAPI Pydantic Models -> Django Serializers.
FastAPI Routes -> Django ViewSets.

requirements.txt
: Remove fastapi, uvicorn. Add django, djangorestframework, simplejwt, django-filter.
10. ❌ Explicit “What NOT to Build”
Social Login: No Google/Facebook auth.
Facial Recognition: No processing of face data.
GPS Tracking: No lat/long storage.
Scraping: No external crawlers.
Open Registration: No public signup without invites
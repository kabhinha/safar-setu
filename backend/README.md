# Project X Backend (Django)

The authoritative backend service for Project X, built with **Django 5** and **Django Rest Framework**.
Implements strict **RBAC**, **Audit Logging**, and **Invite-Only Onboarding**.

## Tech Stack
- **Framework**: Django 5 + DRF
- **Database**: PostgreSQL 16
- **Auth**: JWT (SimpleJWT)
- **Infrastructure**: Docker Compose

## Architecture
Modular Monolith stricture:
- `users`: Identity, Invite Codes, KYC.
- `rbac`: Permission classes & ABAC engines.
- `audit`: Immutable logs of all mutations.
- `core`: Middleware (Kiosk isolation).
- `listings`: Hotspots & Media (No GPS).
- `safety`: Moderation queue.

## Setup & Run

### 1. Environment
Ensure `.env` exists (see `docker-compose.yml` environment variables).

### 2. Docker (Recommended)
```bash
docker-compose up --build
```
This starts:
- `db` (Postgres + pgvector)
- `backend` (Django gunicorn/runserver)
- `redis`

### 3. Initialize System
**Migrations:**
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

**Create Superuser:**
```bash
docker-compose exec backend python manage.py createsuperuser
```

**Generate Invite Code (Python Shell):**
```python
from users.models import InviteCode, User
InviteCode.objects.create(code="PILOT-ADMIN", assigned_role=User.Role.ADMIN, max_usage=5)
```

## Security & Constraints
- **No GPS**: Locations use District IDs.
- **Kiosk Isolation**: Kiosks must send `X-Kiosk-ID` header.
- **Audit**: All critical actions are logged to `audit_logs` table.

## Testing
Run the test suite:
```bash
docker-compose exec backend python manage.py test
```

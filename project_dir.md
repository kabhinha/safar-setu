# Project Directory Structure

## Root Directory
- **ai/**: AI related modules.
- **backend/**: Main Django Backend.
- **cctv-analytics/**: Analytics service (Python/CV).
- **cctv_agent/**: Edge agent for CCTV.
- **description/**: Documentation for project modules (aggregated).
- **docs/**: Project documentation and policies.
- **frontend/**: React + Vite Frontend application.
- **legacy_backend_fastapi/**: Legacy services.
- **scripts/**: Utility scripts.
- **tests/**: Test suites.

## Backend Structure (`/backend`)
- **config/**: Django project settings.
- **users/**: Authentication & User Management.
- **kiosk/**: Kiosk-specific APIs and logic.
- **listings/**: Hotspots, Places, Experiences management.
- **commerce/**: Local Products, Deals, and QR flows.
- **reco/**: Recommendation Engine.
- **safety/**: Trust & Safety / Moderation tickets.
- **geography/**: Location data management.
- **bookings/**: Booking management (Placeholder).
- **rbac/**: Role-Based Access Control policies.
- **core/**: Core utilities.
- **audit/**: Audit logging.
- **manage.py**: Django management script.

## Frontend Structure (`/frontend`)
- **src/**
    - **pages/**: Route components (Landing, Mobile, Kiosk, Host, Admin).
        - **Mobile/**: Authenticator, etc.
        - **Kiosk/**: Kiosk specific pages.
    - **components/**: Reusable UI components.
    - **context/**: React Contexts (Auth, etc.).
    - **services/**: API services (Axios).
    - **types/**: TypeScript definitions.
    - **utils/**: Helper functions.
    - **App.tsx**: Main Application Entry / Routes.
- **vite.config.ts**: Vite configuration.
- **package.json**: Dependencies.

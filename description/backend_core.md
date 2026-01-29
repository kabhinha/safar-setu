# Core App (`backend/apps/core`)

The `core` app handles global configurations, shared utilities, middleware, and management commands that cross-cut multiple domains.

## Key Components

### Management Commands
- **`seed_sikkim_demo`**: Populates the database with Sikkim-themed demo data (Hotspots, Products, Broadcasts) for the Kiosk pilot.
  - Usage: `python manage.py seed_sikkim_demo --reset`

### Middleware
- **`KioskIsolationMiddleware`**: Ensures Kiosk requests are properly tagged and isolated if needed.

### Configuration
- **`settings.py`**: Global Django settings.
- **`urls.py`**: Root URL routing.

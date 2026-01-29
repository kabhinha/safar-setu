# Broadcasts App (`backend/apps/broadcasts`)

The `broadcasts` app manages public safety announcements, travel advisories, and festival notifications displayed on the Kiosk ticker.

## Models

### `BroadcastMessage`
- **Fields**: `title`, `message`, `category` (FESTIVAL, ROUTE_CLOSURE, ADVISORY), `severity` (INFO, WARNING, CRITICAL), `start_at`, `end_at`.
- **Purpose**: Dynamic messages shown on the Kiosk Landing page safety ticker.
- **Seeding**: Populated via `seed_sikkim_demo` command.

## Key Features
- **Active Filtering**: Logic to only show messages where `now` is between `start_at` and `end_at`.
- **Severity Levels**: Controls visual styling on the frontend (e.g., Red for Critical).

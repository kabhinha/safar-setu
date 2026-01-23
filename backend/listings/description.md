# Listings Module

## Description
Manages "Hotspots" (Places, Experiences, Marts). Implements a multi-role system where Hosts create listings, Moderators approve them, and the Public discovers them.

## Routes
### Public (Read-Only)
- `GET /api/v1/hotspots/`: List and Filter confirmed hotspots.
- `GET /api/v1/hotspots/{id}/`: Retrieve details of a specific hotspot.

### Host (Manage)
- `GET /api/v1/host/hotspots/`: List hotspots owned by the authenticated host.
- `POST /api/v1/host/hotspots/`: Create a new hotspot draft.
- `PUT /api/v1/host/hotspots/{id}/`: Update a hotspot.

### Moderator (Review)
- `GET /api/v1/mod/hotspots/`: List hotspots requiring review.
- `POST /api/v1/mod/hotspots/{id}/approve/`: Approve a hotspot.
- `POST /api/v1/mod/hotspots/{id}/reject/`: Reject a hotspot.
- `GET /api/v1/mod/tickets/`: Manage moderation tickets.

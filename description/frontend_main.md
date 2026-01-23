# Frontend Module Structure

## Description
React + Vite application serving two distinct experiences:
1.  **Mobile Web App**: For Travelers, Hosts, and Admins.
2.  **Kiosk App**: Determining context for large touchscreen displays.

## Main Routes
### Public
- `/`: Landing Page (Kiosk Mode Start / General Info).
- `/login`: User Login.
- `/signup`: User Registration.

### Traveler (Protected)
- `/feed`: Personalized Feed.
- `/hotspot/:id`: Detailed view of a place/experience.
- `/chat`: AI Buddy Chat.
- `/profile`: User Profile & History.
- `/settings`: Account Settings.
- `/authenticator`: Mobile Authenticator for Kiosk Login.
- `/commerce/demo`: Commerce feature demo.

### Host (Protected)
- `/host`: Host Dashboard.
- `/host/create`: Create new Listing.
- `/host/edit/:id`: Edit Listing.

### Admin (Protected)
- `/admin`: Admin Dashboard.
- `/admin/approvals`: Content Moderation Queue.

### Kiosk (Lazy Loaded)
- `/kiosk/*`: Kiosk-specific routes (Attract Screen, Home Grid, etc.).

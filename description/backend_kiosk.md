# Kiosk Module

## Description
API endpoints dedicated to the Public Touchscreen Kiosk interface. Handles Kiosk feed data, discovery filters, and the Kiosk-side of the authentication handshake.

## Routes
### Feed & Discovery
- `GET /api/v1/kiosk/feed/`: Retrieve the main feed/home data for the Kiosk.
- `GET /api/v1/kiosk/discover/`: Filtered discovery endpoint (supports time and interest parameters).

### Authentication
- `POST /api/v1/kiosk/login/`: Authenticate Kiosk session using a 6-digit Connect Code from a mobile user. Returns ephemeral JWT.

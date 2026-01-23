# Users Module

## Description
Core User Management and Authentication module. Handles user registration, login (JWT), OTP verification, and profile management. Also manages the Mobile-to-Kiosk authentication handshake.

## Routes
### Authentication
- `POST /api/v1/auth/signup/`: Register a new user and trigger OTP.
- `POST /api/v1/auth/verify/`: Verify OTP to activate account.
- `POST /api/v1/auth/verify-invite/`: Activate account via special invite code.
- `POST /api/v1/auth/login/`: Obtain JWT Access/Refresh tokens.
- `POST /api/v1/auth/refresh/`: Refresh JWT Access token.

### Kiosk Connection
- `POST /api/v1/auth/kiosk-code/`: Generate a short-lived 6-digit code for Kiosk login (Authenticated Mobile User).

### Profile
- `GET /api/v1/users/me/`: Retrieve current user profile.
- `PUT /api/v1/users/me/`: Update user profile.

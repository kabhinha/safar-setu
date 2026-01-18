# Project X Backend

Backend service for Project X, built with FastAPI, PostgreSQL (pgvector), and Docker.

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL 16 + pgvector
- **Auth**: JWT (OAuth2 Password Flow)
- **Containerization**: Docker Compose

## Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local dev)

## Setup & Run

### Using Docker (Recommended)
1. **Start Services**
   ```bash
   docker-compose up --build
   ```
2. **Access API**
   - API Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Local Development
1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Run DB**
   - Ensure Postgres is running locally or use the docker container for DB only: `docker-compose up db`
3. **Run App**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

## Database Migrations & Seeding
1. **Initialize DB (Alembic)**
   Note: Requires running DB.
   ```bash
   alembic revision --autogenerate -m "Initial tables"
   alembic upgrade head
   ```
2. **Seed Data**
   Creates Admin, Moderator, Host, and sample Hotspots.
   ```bash
   python initial_data.py
   ```
   
## Testing
Run minimal test suite:
```bash
pytest
```

## Features Implemented
- **Auth**: Signup (Invite Only for Pilot), Login.
- **Roles**: Admin, Moderator, Host, Traveler.
- **Hotspots**: Create (Pending), Approve/Reject (Moderator), View (Traveler).
- **Location Abstraction**: No GPS coordinates stored/exposed.
- **Integrations**: Stubs for Agent 3 (Chat/Recommendations).

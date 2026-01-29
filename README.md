# SAFARSETU

SAFARSETU is a progressive web platform integrating CCTV analytics with a dual-interface frontend (Kiosk & Mobile) to provide smart, safe, and personalized travel experiences.

## Repository Structure

The repository is organized into the following main services:

- **backend/**: Django-based REST API handling core logic, users, commerce, and listings.
    - `apps/`: Contains isolated functional modules (e.g., `users`, `listings`, `kiosk`).
    - `shared/`: Common contracts, permissions, and utilities shared across apps.
    - `config/`: Project settings and configuration.
- **frontend/**: React + Vite application serving both Kiosk and Mobile experiences.
- **services/**: Independent micro-services.
    - `ai/`: AI models for recommendations and safety.
    - `cctv_agent/`: Edge processing for CCTV feeds.
    - `cctv_analytics/`: Analytics pipeline for crowd metrics.
- **legacy/**: Deprecated code references (e.g., FastAPI backend).

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis (for Celery/Caching)

### Backend Setup

1. **Environment Variables**:
   Copy `.env.example` to `backend/.env` and configure your database credentials.

2. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Environment Variables**:
   Copy `.env.example` to `frontend/.env`.

2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Key Modules

- **Kiosk**: Public-facing terminal interface (Landing, Screensaver, Connection Code).
- **Mobile**: Personal device interface (Authentication, Listings, Deal Closure).
- **CCTV**: Analyzes footfall and crowd density to inform recommendations.

## Contribution Guidelines

- **Refactoring**: Ensure that moving files includes updating all import references.
- **Apps**: New features should be encapsulated in their own app within `backend/apps/`.

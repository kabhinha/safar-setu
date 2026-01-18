# Project X - Frontend

React + Vite + Tailwind CSS PWA for Project X (Rural Tourism Pilot).

## Overview

This is the frontend client for Project X, designed as a lightweight Progressive Web App (PWA) to ensure accessibility in low-bandwidth rural areas. It serves four distinct user roles:

1.  **Traveler**: Explore curated hotspots, chat with AI buddy, request bookings.
2.  **Host**: Manage listings (Homestays/Hotspots), verify stats, interact with guests.
3.  **Moderator**: Approve/Reject listings and content.
4.  **Admin**: System oversight and metrics.

## Tech Stack

-   **Core**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, clsx, tailwind-merge
-   **Icons**: Lucide React (Lightweight SVG)
-   **State/API**: React Context (Auth), Axios
-   **PWA**: vite-plugin-pwa (Offline support, Manifest)
-   **Forms**: react-hook-form

## Features Implemented

-   **Role-based Auth**: Guest vs Host signup flows (Invite code / Govt ID).
-   **Traveler Feed**: Grid view of recommendations with filters.
-   **Hotspot Detail**: Abstracted location, story-first content.
-   **Buddy Chat**: AI chat interface with citation blocks.
-   **Mobile-First Design**: Bottom navigation for main traveler flows.
-   **Optimized Build**: Code splitting via generic React.lazy routes.

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    cd frontend
    npm install
    ```

2.  **Configuration**
    Create a `.env` file (optional, defaults to localhost):
    ```env
    VITE_API_URL=http://localhost:8000
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```
    Output is in `dist/`.

## PWA Notes

-   The app is configured to register a service worker for offline caching.
-   Manifest file is generated in `dist/manifest.webmanifest`.
-   To test PWA features locally, build the app and serve `dist` using `npx serve dist`.

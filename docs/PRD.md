# Project X - Product Requirements Document (PRD)

**Status:** DRAFT (Phase 1)
**Owner:** Agent 1 (Product + Security Architect)
**Classification:** GOVERNMENT-ALIGNED / PILOT-STAGE

## 1. Executive Summary
Project X is a security-aware, privacy-first monitoring and assistance system designed for a invite-only government pilot. It provides aggregate analytics from CCTV feeds and a culturally sensitive AI monitoring assistant ("Buddy Chat"). The system prioritizes data privacy, strictly adhering to non-intrusive monitoring standards.

## 2. Core Constraints & Principles
*   **Privacy First:** No Personally Identifiable Information (PII) collection.
*   **Aggregate Only:** CCTV data must be processed into counts, density, and flow metrics. No raw footage storage or retrieval.
*   **Location Abstraction:** All location references must be abstracted to State or District level. No GPS coordinates, routes, or precise map pins.
*   **Restricted Access:** The system is strictly Invite-Only for the pilot phase.

## 3. User Roles
*   **Administrator:** Manages invites, views system-wide aggregate dashboards.
*   **Pilot User:** Accesses Buddy Chat and view authorized district-level insights.

## 4. Key Features

### 4.1 Invite-Only Access Control
*   Verification mechanism for pilot participants.
*   Role-based access control (RBAC).

### 4.2 CCTV Aggregate Analytics Dashboard
*   **Input:** Simulated CCTV feed streams.
*   **Processing:** Real-time analysis for crowd density and vehicle flow.
*   **Output:** Statistical dashboards (Heatmaps by district, trend graphs).
*   **Restriction:** No face recognition, no license plate reading, no individual tracking.

### 4.3 AI Buddy Chat
*   **Function:** RAG-based assistant for safety guidelines and situational queries.
*   **Tone:** Culturally sensitive, formal, and compliant with local norms.
*   **Safety:** Guardrails against revealing precise locations or generating non-governance advice.

### 4.4 Data Layer
*   Storage of aggregate metrics only.
*   Audit logs for all system accesses.

## 5. Non-Functional Requirements
*   **Security:** End-to-end encryption for metadata.
*   **Auditability:** Comprehensive logging of all admin actions.
*   **Scalability:** Dockerized deployment for local pilot reproducibility.

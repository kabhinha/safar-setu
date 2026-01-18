# Project X: Product Requirements & Security/Governance Policy
**Version:** 1.0 (Pilot Candidate)
**Status:** DRAFT
**Author:** Agent 1 (Product Architect + Security/Compliance Officer)

---

## 1. Product Requirements Document (PRD)

### 1.1 Executive Summary
Project X is a government-aligned, invite-only rural tourism platform for North-East India. It acts as a curated bridge between respectful travelers and local host communities. The platform prioritizes cultural preservation, environmental safety, and community control over mass tourism. All features are designed for a controlled "Pilot" phase.

### 1.2 Personas

| Persona | Role | Key Characteristics | Goals |
| :--- | :--- | :--- | :--- |
| **Traveler (The Guest)** | End User | Vetted, respectful, invited by existing member or system admin. Seeking authentic experiences. | distinct cultural immersion, secure booking, safety assurance. |
| **Host (The Partner)** | Provider | Local homestay owner or village representative. Verification required. | Economic benefit, control over visitor flow, preserving local culture. |
| **Moderator** | Operations | Government or trusted NGO partner. Oversees content and alerts. | Ensure compliance, vet hosts/guests, manage sensitive content issues. |
| **Admin** | System Owner | Technical & Operational oversight. | Platform stability, audit logs, invite code generation, emergency shutdowns. |

### 1.3 Pilot Scope & Invite-Only Logic
*   **Access Control:** The platform is NOT open to the public. Registration is valid after verifing the invite code (one-time use) sent to the traveler's email address by the system. Registration process will be 2 step process in process 1 the user will feed all the details and in 2nd step password will setup and the details will be verified by the govt APIs
*   **Geographic Scope:** Limited to specific pilot districts in NE India (e.g., initial list of 5-10 approved villages).
*   **Feature Gating:**
    *   No public search (must be logged in).
    *   No "Instant Book" (all bookings are request-based).
    *   No social sharing features on the platform itself.

### 1.4 Core User Journeys
1.  **Guest Onboarding:**
    *   Receive Invite Code (offline/email).
    *   Sign up > Input Code > KYC Verification (Light).
    *   Agree to "Responsible Traveler Pledge".
2.  **Host Onboarding:**
    *   Admin creates Host account.
    *   Host completes profile with "Cultural Sensitivity" checklist.
    *   Uploads listings (Photos checked for privacy risks).
3.  **Booking Flow:**
    *   Guest explores **Coarse** locations (Region/District).
    *   Guest views listing (Photos + Description).
    *   Guest sends "Visit Request" with intent/group details.
    *   Host accepts/rejects.
    *   Payment held in escrow.
    *   **Exact location revealed ONLY 24hrs before check-in.**

---

## 2. Data Governance & Safety Policy

### 2.1 Data Collection & Privacy
*   **Allowed:** Name, Email, Phone (verified), Emergency Contact, Govt ID (Hash stored, or strictly siloed), Booking History.
*   **Forbidden:** 
    *   Continuous GPS tracking of users.
    *   Scraping social media profiles.
    *   Storing raw video footage from anywhere.
    *   Biometric data (Face ID) for surveillance.

### 2.2 Location Abstraction Rules
*   **Public View:** Maximum granularity is **District** or **Cluster** level (approx 10km radius center).
*   **Private View (Confirmed Booking only):** Exact coordinates revealed 24 hours prior to check-in.
*   **Metadata:** Use generic labels for sensitive zones (e.g., "Protected Forest Area" instead of specific trail names).

### 2.3 CCTV & Surveillance Rules
*   **Constraint:** Platform may ingest data from crowd-management cameras at hotspots.
*   **Processing:**
    *   Edge processing ONLY.
    *   Output: `flow_rate` (people/min), `density` (high/med/low), `count` (integer).
    *   **NO** facial recognition. **NO** license plate reading.
    *   **NO** storage of video feed.

### 2.4 Content Moderation
*   **Text/Media:** All host descriptions and guest reviews pass through a sensitivity filter.
*   **Blocked Patterns:**
    *   "Secret trail", "Unexplored", "Virgin land", "Hidden gem".
    *   Geo-tagging specific sensitive flora/fauna.
*   **Preferred Language:**
    *   "Community-led", "Locally curated", "Culturally guided", "Heritage zone".
*   **Escalation:** System flags content -> Manual Moderator Review -> Publish/Reject.

---

## 3. Interface Contracts (for Other Agents)

### 3.1 Shared Enums & Constants
```typescript
enum UserRole {
  GUEST = 'GUEST',
  HOST = 'HOST',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

enum BookingStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Sensitivity levels for locations/content
enum SensitivityLevel {
  PUBLIC = 'PUBLIC',       // Safe for general visibility
  PROTECTED = 'PROTECTED', // Requires generic abstraction
  RESTRICTED = 'RESTRICTED' // Admin/Govt view only
}

enum CrowdDensityState {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

### 3.2 High-Level API Endpoints

#### Auth Module
*   `POST /auth/register` (Requires `invite_code`)
*   `POST /auth/login`
*   `POST /auth/verify-kyc`

#### Listings & Location Module
*   `GET /listings` (Filter: `district`, `sensitivity_check=true`)
    *   *Response:* Returns minimal list. No exact lat/long.
*   `GET /listings/{id}`
    *   *Response:* Returns details. Lat/Long is fuzzy unless requester has valid booking < 24hrs.
*   `POST /listings` (Host only, enters `PENDING_REVIEW` state)

#### Booking Module
*   `POST /bookings` (Create request)
*   `PATCH /bookings/{id}/status` (Host approve/reject)

#### Safety & Compliance Module
*   `POST /telemetry/cctv-aggregate`
    *   *Payload:* `{ device_id, timestamp, density_state, count_15min }`
    *   *Restriction:* Reject if payload contains image/video data.
*   `GET /admin/audit-logs`

---

## 4. "Do Not Build" List (Explicit)

1.  **NO Social Login:** Do not implement "Login with Facebook/Google" to avoid tracking pixels and external data sharing.
2.  **NO "Nearby functionality" for Guests:** Do not show "Users near you".
3.  **NO Live Video Streaming:** Platform does not support streaming.
4.  **NO Public Reviews with PII:** Reviews must be anonymized or first-name only.
5.  **NO Gamification of Exploration:** No "badges" for visiting remote areas.
6.  **NO Automated Pricing/Surge:** Pricing is fixed by Host/Community, not algorithms.

---

## 5. Acceptance Criteria Checklist

### Module: Onboarding
- [ ] User cannot register without valid Invite Code.
- [ ] Invite code marks as "used" immediately after registration.
- [ ] KYC status defaults to "Unverified".

### Module: Location Privacy
- [ ] API returns "Fuzzy" coordinates (randomized offset) for unconfirmed bookings.
- [ ] "Exact" coordinates API throws 403 error if booking is > 24 hours away.

### Module: Content Safety
- [ ] Creating a listing with the word "Secret" or "Unexplored" triggers a validation error or "Pending Review" flag.
- [ ] CCTV Data ingestion endpoint rejects payloads > 1KB (prevents image upload).

### Module: Admin/Audit
- [ ] Every state change (Booking approved, Listing edited) generates an immutable Audit Log entry.
- [ ] Admin dashboard shows "Crowd Density" without showing video feeds.

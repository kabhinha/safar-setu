# Project X: Product Requirements & Security/Governance Policy
**Version:** 2.0 (Pilot Candidate)
**Status:** DRAFT
**Author:** Agent 1 (Product Architect + Security/Compliance Officer)

---

# Project X: Product Requirements & Security/Governance Policy  
**Version:** 2.0 (Unified Pilot Logic)  
**Status:** PITCH-CANDIDATE  
**Audience:** Government, Policy Makers, Implementation Partners  
**Objective:** Controlled Pilot Deployment (North-East India)

---

## 1. Executive Summary

Project X is a **government-aligned, controlled tourism and local-economy enablement platform** designed for the North-Eastern states of India.

Unlike conventional tourism platforms that emphasize pre-planned itineraries and mass exposure, Project X focuses on **situational decision-making**, cultural preservation, and administrative control.

The platform operates through **two tightly governed interaction modes**:
1. **Public Discovery Mode** via government-installed kiosks  
2. **Vetted Engagement Mode** via mobile/web access  

All system behaviors prioritize:
- security-sensitive regional realities  
- community consent  
- environmental and cultural protection  
- auditability and administrative oversight  

Project X is explicitly designed as a **pilot-first system**, not a public marketplace.

---

## 2. Core Design Philosophy

### 2.1 Controlled Decision System (CDS)

Project X is not merely a booking or listing platform.  
It is a **Controlled Decision System**, enabling tourists to make **safe, nearby, time-feasible decisions** while already on-ground.

This reflects real-world tourist behavior:
- decisions are often made **after reaching a destination**
- spare time windows arise unexpectedly
- users seek guidance, not exhaustive planning

The system responds to these moments **without tracking users or exposing sensitive locations**.

---

### 2.2 Dual Interaction Modes

| Mode | Audience | Device | Login | Purpose |
|---|---|---|---|---|
| **Discovery Mode** | Any traveler | Govt Kiosk | No | In-the-moment discovery |
| **Engagement Mode** | Vetted users | Mobile / Web | Yes | Requests, commerce, deeper access |

This separation ensures:
- privacy on public devices  
- controlled access to sensitive actions  
- inclusivity without compromising security  

---

## 3. Personas

| Persona | Role | Description | Primary Goal |
|---|---|---|---|
| **Traveler (Guest)** | End User | Respectful visitor engaging via kiosk or invited mobile access | Discover nearby experiences safely |
| **Vendor / Host (Partner)** | Local Provider | Homestays, artisans, producers | Fair income, controlled exposure |
| **Moderator** | Operations | Govt/NGO-appointed | Content & safety compliance |
| **Admin** | System Authority | Govt technical/operational control | Stability, audit, policy enforcement |

---

## 4. Access Control & Invite Logic (Corrected)

### 4.1 Public Discovery (No Login)
- Available on kiosks  
- No personal data collected  
- Session auto-resets  
- Limited to abstract discovery and QR continuation  

---

### 4.2 Engagement Mode (Invite-Based Access)

#### Step 0: Admin Provisioning
- Admin pre-creates a **User Shell**
  - Email / phone
  - Role (Traveler / Host)
  - Status = `INVITED`

---

#### Step 1: First-Time Access (Invite Link)
User:
- Verifies email/phone via OTP  
- **Sets password (mandatory)**  
- Accepts Responsible Traveler / Cultural Pledge  

> This step is **password creation**, not login.

---

#### Step 2: First Login Enforcement
- User cannot proceed unless:
  - password is set  
  - pledge accepted  
- KYC (if applicable) begins post-login  

---

#### Step 3: Feature Gating
Until verification:
- Abstract browsing allowed  
- Kiosk continuation allowed  
- ❌ No visit requests  
- ❌ No commerce settlement  

This ensures safety without friction.

---

## 5. Core User Journeys

### 5.1 Decision-at-Time Discovery (Kiosk)

1. Tourist visits a govt kiosk  
2. Selects:
   - available time (15m / 30m / 1h / 2h)  
   - interest (tea, craft, nature, quiet, shopping)  
   - language  
3. System displays:
   - nearby, time-feasible experiences  
   - approximate travel time  
   - current crowd advisories  
4. User selects experience or product  
5. QR token generated for continuation  

No login. No tracking. No exact locations.

---

### 5.2 Guided Engagement (Mobile/Web)

- User logs in via invite  
- Context from kiosk preserved  
- User may:
  - send visit requests  
  - engage in local commerce  
  - communicate via system channels  

---

### 5.3 Local Commerce (QR-Based, Controlled)

Project X supports **local product transactions** using a **two-QR, deal-close model**.

#### Flow (Model B – Dynamic QR):
1. Traveler places order (via kiosk or app)  
2. Vendor brings item to kiosk (delivery point)  
3. Vendor generates **dynamic, expiring settlement QR**  
4. Kiosk/app validates QR  
5. Payment triggered & order closed  
6. Vendor settlement recorded  

This ensures:
- payment only on verified handover  
- fraud resistance  
- auditability  

---

## 6. Location & Navigation Policy

### 6.1 Location Abstraction
- Public view: District / Cluster only  
- No GPS pins  
- No route maps  
- No turn-by-turn navigation  

### 6.2 Time-Based Proximity (Allowed)
- Approx travel time buckets  
- Feasibility scoring  
- “Open now” filtering  

### 6.3 Forbidden
- Live user tracking  
- User-to-user proximity  
- Sensitive route exposure  

---

## 7. CCTV & Crowd Management Policy

### 7.1 Purpose
CCTV integration is **only for crowd awareness**, not surveillance.

### 7.2 Processing Rules
- Edge processing only  
- Outputs:
  - crowd density (LOW/MED/HIGH)  
  - approximate count  
  - flow rate  
- ❌ No facial recognition  
- ❌ No video storage  
- ❌ No identity linkage  

### 7.3 Usage
- Crowd warnings on kiosk  
- Recommendation de-prioritization  
- Admin analytics only  

---

## 8. Content & Cultural Safety

### 8.1 Moderation
All content passes through:
- automated sensitivity filters  
- manual moderator review if flagged  

### 8.2 Blocked Language
- “Secret trail”  
- “Hidden gem”  
- “Unexplored”  
- “Virgin land”  

### 8.3 Preferred Language
- “Community-led”  
- “Locally curated”  
- “Culturally guided”  
- “Heritage zone”  

---

## 9. Data Governance & Privacy

### 9.1 Allowed Data
- Name, email, phone  
- Govt ID (hashed/siloed)  
- Order & visit history  
- Aggregate interaction metrics  

### 9.2 Forbidden Data
- Social media scraping  
- Biometric identifiers  
- Raw video feeds  
- Continuous location tracking  

---

## 10. Admin & Governance Controls

- Pilot geography enable/disable  
- Festival Mode  
- Crowd advisories  
- Vendor trust tiers  
- Immutable audit logs  
- Emergency feature shutdown  

---

## 11. Explicit “Do Not Build” List (v2)

1. No social login  
2. No social scraping  
3. No live maps or routes  
4. No face recognition  
5. No static payout QR codes  
6. No automated pricing  
7. No gamified exploration  
8. No public marketplaces  

---

## 12. Acceptance Criteria (Pilot)

### Access
- No login required on kiosks  
- No engagement without invite  

### Privacy
- No exact coordinates in public APIs  
- CCTV payloads reject media  

### Commerce
- Settlement only via dynamic QR  
- Order completion requires validation  

### Audit
- All state changes logged  
- Admin visibility without surveillance  

---

## 13. Closing Statement

Project X is designed to help the government **guide tourism, not chase it**.

It enables:
- respectful travel  
- real-time decision support  
- local economic participation  
- administrative confidence  

without compromising:
- cultural dignity  
- environmental safety  
- regional security  

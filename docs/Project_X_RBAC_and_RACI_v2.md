# Project X – Technical RBAC Specification & RACI Matrix (v2.0)

**Status:** Finalized (Pilot-Ready)  
**Scope:** North-East India | Government-Controlled Pilot  
**Purpose:** Security, Governance, and Operational Clarity  

---

## 1. RBAC DESIGN PRINCIPLES

- Least Privilege by default  
- Clear separation between **Kiosk (Public)** and **Authenticated Systems**
- RBAC enforced with ABAC overlays
- Immutable audit trails for all privileged actions
- Geography- and phase-aware feature gating

---

## 2. ROLE HIERARCHY

SUPER_ADMIN  
└── ADMIN  
&nbsp;&nbsp;&nbsp;&nbsp;└── MODERATOR  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── HOST / VENDOR  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── TRAVELER  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── PUBLIC_KIOSK (anonymous)

---

## 3. ROLE DEFINITIONS

### PUBLIC_KIOSK
- Authentication: None
- Session: Ephemeral (auto-reset)
- Permissions: Discovery-only, QR continuation

### TRAVELER
- Authentication: Invite-based
- States: INVITED, ACTIVE, SUSPENDED, KYC_PENDING

### HOST / VENDOR
- Authentication: Admin-provisioned
- States: PENDING_VERIFICATION, ACTIVE, SUSPENDED

### MODERATOR
- Authentication: Govt / NGO-appointed
- Scope: District / State

### ADMIN
- Authentication: Govt technical authority
- Scope: State / Pilot

### SUPER_ADMIN
- Authentication: Central authority
- Scope: Cross-state / National

---

## 4. PERMISSION MATRIX (SUMMARY)

### 4.1 Discovery & Decision-at-Time

| Action | Kiosk | Traveler | Host | Moderator | Admin |
|------|------|----------|------|-----------|-------|
| Abstract discovery | ✅ | ✅ | ✅ | ✅ | ✅ |
| Time-based nearby | ✅ | ✅ | ❌ | ❌ | ❌ |
| Interest filters | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crowd advisories | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exact locations | ❌ | ⚠️ | ❌ | ❌ | ❌ |

⚠️ Only after approved visit & time window

---

### 4.2 Authentication & Account Control

| Action | Kiosk | Traveler | Host | Moderator | Admin |
|------|------|----------|------|-----------|-------|
| Login | ❌ | ✅ | ✅ | ✅ | ✅ |
| First-time password setup | ❌ | ✅ | ✅ | ❌ | ❌ |
| Change / Reset password | ❌ | ✅ | ✅ | ❌ | ❌ |

---

### 4.3 Listings & Content

| Action | Kiosk | Traveler | Host | Moderator | Admin |
|------|------|----------|------|-----------|-------|
| Create listing / product | ❌ | ❌ | ✅ | ❌ | ❌ |
| Edit own content | ❌ | ❌ | ✅ | ❌ | ❌ |
| Review content | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve / Reject | ❌ | ❌ | ❌ | ✅ | ✅ |

---

### 4.4 Commerce (QR-Based Model B)

| Action | Kiosk | Traveler | Host | Moderator | Admin |
|------|------|----------|------|-----------|-------|
| Place order | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generate settlement QR | ❌ | ❌ | ✅ | ❌ | ❌ |
| Scan settlement QR | ✅ | ❌ | ❌ | ❌ | ❌ |
| Trigger payment | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ |
| View transactions | ❌ | ✅ | ✅ | ❌ | ✅ |

⚠️ System-triggered after validations

---

## 5. ABAC OVERLAY (MANDATORY)

### Key Attributes
- user_status
- kyc_status
- district_enabled
- time_window
- sensitivity_level
- crowd_density
- order_state

### Sample Rule
ALLOW view_exact_location  
IF role == TRAVELER  
AND booking_status == APPROVED  
AND current_time >= (checkin_time - 24h)

---

## 6. KIOSK SECURITY RULES

- No persistent identity
- Auto session reset
- No account creation
- No admin actions
- Expiring QR tokens only

---

## 7. AUDIT LOGGING (IMMUTABLE)

All privileged actions log:

{
  actor_role,
  actor_id,
  action,
  entity,
  entity_id,
  timestamp,
  geo_scope,
  result
}

Logs are append-only and non-editable.

---

## 8. FORBIDDEN ESCALATIONS

- Kiosk → Authenticated user  
- Host → Moderator  
- Moderator → Admin  
- Vendor scanning own settlement QR  
- Static payout QR codes  

---

# RACI MATRIX (PILOT)

R = Responsible | A = Accountable | C = Consulted | I = Informed

## 1. Governance & Policy

| Activity | State Govt | Tourism Dept | District Admin | Security Agencies | Admin |
|-------|------------|--------------|----------------|-------------------|-------|
| Pilot approval | A | C | I | C | R |
| Policy definition | A | R | C | C | I |
| Restricted zones | C | I | R | A | I |

---

## 2. Kiosk Deployment

| Activity | District Admin | Tech Team | Vendor | Tourism Dept |
|-------|----------------|-----------|--------|--------------|
| Placement | A | R | I | C |
| Maintenance | I | R | C | I |
| Connectivity | C | R | I | I |

---

## 3. Content & Experience

| Activity | Host/Vendor | Moderator | Tourism Dept | Admin |
|-------|-------------|-----------|--------------|-------|
| Content creation | R | I | I | I |
| Review | I | R | C | I |
| Final approval | I | A | C | I |

---

## 4. Commerce & Payments

| Activity | Traveler | Vendor | Payment Partner | Admin |
|-------|----------|--------|-----------------|-------|
| Order initiation | R | I | I | I |
| Delivery | I | R | I | I |
| Settlement | I | R | C | A |
| Audit | I | I | C | R |

---

## 5. Safety & Crowd Management

| Activity | District Admin | Security Agencies | Tech Team | Admin |
|-------|----------------|-------------------|-----------|-------|
| CCTV rules | I | A | C | R |
| Crowd alerts | R | C | I | I |
| Emergency response | R | A | C | I |

---

## 6. System Ops & Audit

| Activity | Admin | Moderator | Tech Team | Govt |
|-------|-------|-----------|-----------|------|
| User provisioning | R | I | I | I |
| Audit review | R | C | I | A |
| Emergency shutdown | R | I | C | A |

---

## 7. Pilot Review

| Activity | State Govt | Tourism Dept | Admin | Research Partners |
|-------|------------|--------------|-------|------------------|
| Impact assessment | A | R | C | C |
| Scale decision | A | C | R | I |

---

**End of Document – Project X v2.0**
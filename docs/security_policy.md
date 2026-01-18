# Project X - Security Policy & Global Constraints

**Owner:** Agent 1 (Product + Security Architect)
**Enforcement:** MANDATORY for all Agents (2-8)

## 1. Data Privacy Policy
*   **No PII:** Absolutely no storage of names, addresses, or biometric markers associated with surveillance data.
*   **No Face Recognition:** Algorithms for facial recognition are strictly prohibited.
*   **No Identity Tracking:** System must not track individuals across cameras or sessions.

## 2. Location Data Policy
*   **Abstraction Layer:** All location data must be rounded to District or State level.
*   **Prohibited Data Types:** 
    *   GPS Coordinates (Lat/Long)
    *   Turn-by-turn routes
    *   Precise map pins
*   **Allowed Data Types:**
    *   District Name (e.g., "District A")
    *   State Name
    *   Aggregate counts per District

## 3. Surveillance Policy
*   **Aggregate Only:** Video feeds are processed in memory to extract counts (people, vehicles).
*   **No Retention:** Raw video footage must never be written to disk.
*   **Output:** JSON statistics only (e.g., `{"timestamp": "...", "district": "D1", "count": 45}`).

## 4. Source Restrictions
*   **No Scraping:** Social media scraping is strictly forbidden.
*   **Authorized Feeds Only:** System connects only to configured, authorized CCTV simulation streams.

## 5. Cultural & Ethical Standards
*   **Language:** LLM outputs must use formal, culturally respectful language.
*   **Neutrality:** AI responses must remain politically and religiously neutral.

## 6. Access Control
*   **Invite Only:** No public sign-up. Whitelisted emails/tokens only.

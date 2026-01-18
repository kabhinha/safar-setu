# Project X - Test Plan Blueprint

**Author:** Agent 6 (QA Lead)
**Status:** ACTIVE
**Reviewer:** Agent 1 (Security Architect)

## 1. Introduction
This document outlines the testing strategy for Project X, focusing on critical privacy constraints, module functionality, and safety compliance.

## 2. Scope
The test suite covers the following modules:
1.  **Authentication & RBAC**: Invite-only access, role separation.
2.  **CCTV Analytics**: Aggregation verification, no-PII enforcement.
3.  **AI Services (Buddy Chat)**: Content safety, constraint enforcement (No GPS).
4.  **Backend API**: Contract validation, error handling.

## 3. Top-Level Constraints (Hard Fail Conditions)
The following are identifying as "Do Not Build" or "Must Not Allow" items. **Any test framework failure here triggers an immediate build block.**

| Constraint ID | Description | Validation Method |
| :--- | :--- | :--- |
| **C-PRIV-01** | NO GPS/Exact Coordinates | Regex scan on all API responses/logs. |
| **C-PRIV-02** | NO Identity/Face Data | Schema checks on CCTV storage/response. |
| **C-PRIV-03** | Invite-Only Access | Integration test: Public signup attempt must fail. |
| **C-SAFE-01** | Privacy-First Chat | Chat output scan for "routes", "lat/long". |

## 4. Test Strategy
### 4.1 Technology Stack
-   **Framework**: `pytest`
-   **Async Client**: `httpx` (for FastAPI async endpoints)
-   **Data Validation**: `pydantic` models

### 4.2 Test Pyramid
-   **Unit Tests (40%)**: Validation logic, utility functions, regex strictness.
-   **Integration/API Tests (50%)**: End-to-end flow from endpoint to mock DB/Service.
-   **Contract Tests (10%)**: OpenAPI schema compliance.

## 5. Coverage Goals
-   Overall Backend Coverage: > 80%
-   Critical Constraints Coverage: 100%

## 6. Test Data Strategy
-   **Fixtures**:
    -   `mock_pilot_token`: Valid invite token.
    -   `mock_district_stats`: Pre-calculated density metrics.
    -   `mock_chat_context`: Sample user queries about safety/locations.

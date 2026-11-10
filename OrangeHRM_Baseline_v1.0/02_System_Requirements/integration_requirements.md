# OrangeHRM v1.0 Integration & External Service Requirements

## 1.0 Integration Architecture Overview
OrangeHRM integrates with external enterprise services through modular adapters for authentication, email delivery, and REST APIs.

---

## 2.0 Integration Specifications

### 2.1 REST API Architecture & Protocols (`INT_API`)
- **Protocol:** REST over HTTPS, adhering strictly to OpenAPI 3.0 standards.
- **Data Envelope:** Request and response bodies are JSON formatted (`application/json`).
- **Standard HTTP Methods:**
  - `GET`: Retrieve resources or paginated collections.
  - `POST`: Create new resources.
  - `PUT`: Update existing resources.
  - `DELETE`: Remove or soft-delete resources.
- **Standard Envelope Response:**
  ```json
  {
    "data": { ... },
    "meta": {
      "total": 120,
      "limit": 50,
      "offset": 0
    },
    "rels": []
  }
  ```

### 2.2 Corporate Directory & Single Sign-On (SSO) (`INT_SSO`)
- **OpenID Connect (OIDC):** Support external OpenID identity providers (Google, Microsoft, Okta, Keycloak) configured via `orangehrmOpenidAuthenticationPlugin`.
- **LDAP / Active Directory:** Support LDAP synchronization and credential binding via `orangehrmLDAPAuthenticationPlugin` with fallback to native database credentials if LDAP is unreachable.

### 2.3 Email & Notification Gateway (`INT_MAIL`)
- **SMTP Gateway:** Asynchronous mail delivery supporting SSL/TLS, port 465/587, and configurable authentication.
- **Mail Spooler & Retry Queue:** Automated queuing mechanism ensuring transactional emails (leave approvals, welcome credentials, timesheet alerts) are spooled and retried on transient connection failures.


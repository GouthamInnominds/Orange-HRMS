# OrangeHRM v1.0 Software Architecture Document (SAD)
## 1.0 System Context (C4 Model Level 1 & Level 2)

### 1.1 Level 1: System Context Diagram
The System Context diagram illustrates the high-level actors, external services, and operational boundary of the OrangeHRM system.

```mermaid
graph TD
    Admin["Global Administrator"] -->|Configures Organization, Roles, Users| OHRM["OrangeHRM Web Application"]
    HR["HR Manager"] -->|Manages PIM, Leaves, Recruitment| OHRM
    Sup["Supervisor"] -->|Approves Leaves, Timesheets, Claims| OHRM
    Emp["Employee (ESS)"] -->|Applies Leave, Punches Clock, Submits Timesheet| OHRM

    OHRM -->|Delivers Notifications| SMTP["Enterprise SMTP Mail Gateway"]
    OHRM -->|Authenticates Credentials| LDAP["LDAP / Active Directory Server"]
    OHRM -->|SSO Token Validation| OIDC["OpenID Identity Providers (Google/Okta)"]
    OHRM -->|Persists Data| DB[("MySQL / MariaDB Database")]
```

---

### 1.2 Level 2: Container Diagram
The Container diagram illustrates the high-level technical containers making up the deployed system.

```mermaid
graph LR
    Browser["Web Browser (Chrome/Firefox/Edge)"] -->|HTTPS / REST API / JSON| Web["Nginx / Apache Web Server"]
    Web -->|PHP-FPM| Backend["Symfony PHP Application Engine"]
    Backend -->|Doctrine DBAL / ORM| SQL[("Relational Database MySQL 8 / MariaDB")]
    Backend -->|SMTP / TLS| MailServer["Corporate Mail Server"]
    Backend -->|Filesystem I/O| DocStore[("Local / Mounted Attachment Storage")]
    Browser -->|Serves Static Bundles| VueApp["Vue 3 SPA Client (Vite / Webpack)"]
```


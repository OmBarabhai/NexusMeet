# PRIVACY.md — NexusMeet

## Overview

NexusMeet is committed to protecting the privacy and security of users — especially in educational settings where the platform may be used by students, teachers, and administrators. This document explains what data we collect, how and why we use it, how it is stored, and what choices users and institutions have.

> **Principle:** Collection is minimized, consent is explicit for sensitive features (like screen monitoring), and data access is role-based and auditable.

---

## 1. Data We Collect

### 1.1 Account & Profile Data

* Name, email, institution (optional), role (student / instructor / admin).
* Profile metadata (avatar, display name).

### 1.2 Authentication & Security Data

* Hashed passwords (or OAuth tokens), JWT session tokens, and login timestamps.
* IP addresses and device metadata for security logging and abuse detection.

### 1.3 Meeting & Interaction Metadata

* Meeting IDs, participant lists, join/leave timestamps, chat messages, raised-hand events, polls, reactions, and task/submission metadata.
* Activity markers: camera/mic status, focus/blur events (optional, controlled by institution policy).

### 1.4 Monitoring & Screen View Data (Sensitive)

* **Screen view streams are not recorded by default.**
* When a professor requests to view a student’s screen, a consent workflow is generated and must be accepted by the student before a view-only stream is established.
* Optionally, institutions may enable temporary screen recording for exams or supervised labs — only after explicit institutional policy, user consent, and clear retention rules.

### 1.5 Logs & Audit Trails

* System logs for troubleshooting and security: consent events, admin actions, monitor requests, and denied/granted responses.

---

## 2. How We Use Data

* Provide core platform functionality (auth, meetings, video/audio connections).
* Enable instructor actions: presence view, raised hands, polls, task assignments, and monitor requests.
* Security & abuse prevention (rate-limiting, anomaly detection).
* Analytics & reporting (attendance, participation), aggregated or anonymized by default.

---

## 3. Consent & Transparency

* **Explicit consent is always required for screen monitoring.**

  * Instructor clicks *Request Screen View* → student sees a clear modal describing scope & duration → student grants/denies.
  * Consent events are logged and visible to both parties.
* Institutions can require prior consent in onboarding for specific courses. If so, that is documented in the institution settings and visible to students before enrollment.
* Students can revoke consent during a session; the platform will immediately stop the stream.

---

## 4. Data Retention & Deletion

* Meeting metadata and chat logs are retained for a configurable period (default 90 days) unless the institution requests a different policy.
* Consent logs are retained for 1 year for audit and dispute resolution.
* Recorded media (if enabled) must have a retention policy set by the institution; default retention is 30 days.
* Users can request account deletion; deletion requests will remove personal profile data and anonymize historical logs where feasible, subject to legal or institutional retention requirements.

---

## 5. Access Control & Security

* Role-based access control (RBAC): students, instructors, and admins have clearly separated privileges.
* All sensitive endpoints require authorization checks and server-side validation.
* Use HTTPS for all traffic; in production, store JWTs in httpOnly cookies and implement CSRF protections for cookie flows.
* Limit access to monitoring features to verified instructors and logged consent records.

---

## 6. Institutional Policies & SSO

* Institutions may configure custom policies, SSO (SAML/OAuth), and data retention rules. Institutional configs override default project settings and are visible to all members of that institution.

---

## 7. Legal & Compliance

* NexusMeet is designed to support compliance with major privacy frameworks (GDPR, FERPA, etc.) through features like explicit consent, data export, and account deletion.
* Institutional administrators are responsible for communicating local legal requirements to users and configuring NexusMeet accordingly.

---

## 8. User Controls

* Users can: view profile data, export their personal data, request deletion, and manage notification preferences.
* In-session: students can always stop screen-sharing and revoke monitor consent; instructors cannot enable a view without an active consent token.

---

## 9. Incident Response & Contact

* In case of a data breach or privacy incident, institution admins and affected users will be notified according to applicable laws.
* Contact: `privacy@nexusmeet.example` (replace with your institutional support address).

---

## 10. Implementation Checklist (for developers)

* [ ] Consent modal UI with clear scope & log entry on grant/deny
* [ ] Secure monitor-request API endpoints with RBAC checks
* [ ] Optional recording flow gated by institutional approval and explicit consent
* [ ] Audit logs for all consent and monitor actions
* [ ] Configurable retention policy in admin settings
* [ ] Privacy & Ethics pages linked in the onboarding flow

---

## 11. Notes & Recommendations

* Default to ephemeral streams (no server-side recording) to reduce privacy risk.
* Provide transparency: quick-access page for students listing recent monitor requests and who viewed their screen.
* Include a short in-app explainer during first use of monitor features to build trust.

---

*Last updated: Aug 26, 2025*

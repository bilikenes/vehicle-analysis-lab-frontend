# Known Issues

### KI-001 — Backend integration contract and production assets are pending

Status: Open

Area:
Cross-page integration and production assets

Problem:
The repository has no backend API contract or approved production assets. Endpoint and payload details, supported body classes, upload/retention rules, quota behavior on failed analyses, coordinate convention, production 3D vehicle asset, and palette reference asset are not yet available.

Current understanding:
The frontend technology and product behavior are approved, but live integration behavior cannot be finalized without these inputs. The Home Hero uses an isolated project-owned procedural vehicle until the production GLB is supplied.

Do not:
Invent authoritative API values, quota policy, body classes, or coordinate semantics.

Next investigation:
Obtain the backend contract before Phase 2 live integration work and replace the interim Hero vehicle after the production GLB is approved.

## Rules

Add an entry only for:
- unresolved bugs,
- recurring failures,
- important workarounds,
- technical debt that affects future work,
- environment/tooling problems likely to recur.

Do not use this file as a historical bug log.

When an issue is resolved, remove it.

Git history retains the historical record.

## Issue Template

### KI-XXX — Short title

Status: Open

Area:
<feature / route / subsystem>

Problem:
<concise description>

Current understanding:
<what is known>

Do not:
<known bad workaround, if relevant>

Next investigation:
<best next step>

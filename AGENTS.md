# Project Instructions

This repository uses a layered documentation system.

Do not ask the user to restate project context that already exists in the repository.

## Before Starting Any Task

Read:

1. `docs/memory/NOW.md`
2. `docs/memory/PROJECT_MAP.md`

Then identify the task area and read only the relevant source-of-truth document.

Do not read every large specification by default.

## Documentation Routing

If working on the Home page:
- Read `docs/specs/home-page.md`

If working on Analysis / Results:
- Read `docs/specs/analysis-results-page.md`

If working on Edit Results:
- Read `docs/specs/edit-results-page.md`

If adding, replacing, or evaluating frontend technologies or dependencies:
- Read `docs/contracts/frontend-technology-contract.md`

If the task changes behavior shared by multiple pages:
- Read every affected specification.

## Source-of-Truth Rules

The page specifications are authoritative for UX and visual behavior.

The Frontend Technology Contract is authoritative for:
- frameworks,
- libraries,
- state ownership,
- animation ownership,
- canvas technology,
- 3D technology,
- dependency boundaries,
- frontend architecture constraints.

Do not redesign an approved interaction unless the user explicitly requests a redesign.

Do not introduce a new framework, state library, animation library, canvas library, UI framework, or CSS methodology without first verifying that the approved stack cannot solve the problem cleanly.

## Context Retrieval Rule

Before asking a project-related clarification:

1. Read `NOW.md`.
2. Read `PROJECT_MAP.md`.
3. Find the relevant source-of-truth document.
4. Inspect the existing implementation.
5. Ask the user only if the answer is still genuinely missing.

## Documentation Maintenance

At the end of a meaningful task:

- Update `NOW.md` if project status changed.
- Update `PROJECT_MAP.md` if important paths or responsibilities changed.
- Update `DECISIONS.md` only when a real product or architecture decision was made.
- Update `KNOWN_ISSUES.md` only for unresolved bugs, workarounds, or technical debt that future sessions need to know.
- Update a source-of-truth document only when an approved requirement or architectural rule changes.

Do not log trivial implementation details.

## Working Discipline

Before completion:
- run relevant tests and checks,
- inspect the changed implementation,
- keep documentation synchronized,
- report unresolved problems clearly.

Prefer existing project primitives and approved libraries.

Do not install a dependency merely because an external component example imports it.

When adapting external UI examples:
- reuse the useful interaction idea,
- remove source-specific visual identity,
- apply this project's design tokens and interaction rules.

## Memory Hygiene

Keep active memory concise.

`NOW.md` must describe the current state, not project history.

When many small completed tasks accumulate, compress them into milestone-level summaries.

Resolved issues should be removed from `KNOWN_ISSUES.md`.

Git history is the long-term implementation log; memory files are not.

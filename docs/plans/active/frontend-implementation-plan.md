# Frontend Implementation Plan

Status: Active

Last updated: 2026-09-01

## Purpose

Deliver the three approved product experiences without changing the page specifications or the Frontend Technology Contract. This plan is an execution guide; the source-of-truth documents remain authoritative.

## Delivery Principles

- Build with the approved stack and one-tool-one-responsibility boundaries.
- Keep server authority on the backend; validate all external payloads with Zod.
- Use semantic design tokens from the first implementation step.
- Preserve native scrolling, reduced-motion support, keyboard operation, and responsive behavior throughout.
- Validate complete state flows, not only static happy-path screens.

## Dependencies and Gates

Before live integration, obtain or confirm:

- API endpoints, authentication expectations, and error format.
- Analysis, quota, correction-save, and download payload schemas.
- Body-type classes supported by the backend.
- Upload size limit, image-retention policy, and failure/quota semantics.
- Bounding-box coordinate convention.
- Production 3D vehicle asset and the palette reference asset, or approval for an interim project-owned fallback.

Frontend structure and isolated presentational work can begin before these are available. Do not invent authoritative backend values or finalize integration behavior without them.

## Phase 1 — Application Foundation

Create the approved Next.js App Router application and baseline developer tooling.

- Configure TypeScript, Tailwind CSS 4, Geist/Geist Mono, linting, Vitest, React Testing Library, and Playwright.
- Add semantic dark-theme tokens and reusable accessible primitives styled for the project.
- Establish the approved route shell: `/`, `/analysis/[analysisId]`, and `/edit/[analysisId]`.
- Add client boundaries only for browser interaction, Motion, upload, WebGL, and Konva work.
- Establish API, schema, geometry, feature, component, asset, and editor-store directory boundaries.

Exit criteria:
- Application starts, routes resolve, and baseline checks run.
- Tokens and shared primitives support the approved dark visual language without a generic component-library identity.

## Phase 2 — Domain and Integration Boundary

Define frontend domain models and API boundaries once backend details are available.

- Implement Zod schemas for validated analysis, quota, correction, and download data.
- Implement API clients and TanStack Query hooks for server-backed state.
- Implement the browser file-input and drag-and-drop boundary with client-side MIME/size checks driven by backend configuration.
- Define unit-testable image and bounding-box geometry utilities using the agreed coordinate system.
- Define a clearly isolated non-authoritative development fixture strategy if frontend work must proceed before the backend is available.

Exit criteria:
- Invalid backend payloads enter controlled error states.
- Server state is not mirrored into local editor state except as an explicit mutable draft.

## Phase 3 — Home Experience

Implement the compact discovery experience specified for `/`.

- Build the server-renderable shell and client-loaded React Three Fiber hero with lazy loading and a graceful static fallback.
- Implement the one-time scanner sequence, restrained pointer response, reduced-motion behavior, and integrated upload state.
- Build the real-photo Model View comparison with pointer, touch, and keyboard support.
- Build the genuinely interactive, intentionally imperfect plate-bbox and OCR correction demo.
- Add the small return-to-upload CTA and compact footer; retain native scrolling.

Exit criteria:
- The Hero is 3D, brand-neutral, non-configurator-like, and does not loop scanning.
- Upload and demo interactions remain usable by keyboard, touch, and reduced-motion users.

## Phase 4 — Upload-to-Analysis Flow

Connect accepted uploads to analysis creation and route transitions.

- Submit valid files through the approved API boundary.
- Render controlled invalid-file, request, backend-failure, and quota states.
- Navigate from the Home upload flow into `/analysis/[analysisId]` without replaying the Home experience.
- Keep quota display server-sourced and never enforce the five-analysis limit from client-only state.

Exit criteria:
- A valid backend response produces a routable analysis result.
- Failures preserve user context and follow the product’s quota rules once supplied.

## Phase 5 — Analysis / Results Experience

Implement the structured-extraction workspace.

- Render the original image as the dominant element with quiet vehicle and plate bounding boxes.
- Build the ordered reveal: vehicle detection and extraction, plate detection and extraction, OCR resolution, body-type result, then calm inspection.
- Implement responsive source-to-destination geometry, focus/trace-back interaction, reduced motion, utility bar, downloads, and Edit Results navigation.
- Implement New Analysis as an in-context upload state that preserves the current result until a new file is accepted.
- Implement quota-exhausted, invalid-file, and analysis-failure states.

Exit criteria:
- The Analysis page remains read-only and avoids dashboard/debug presentation.
- The source relationship between each result and its image region is clear on desktop, tablet, and mobile.

## Phase 6 — Edit Results Experience

Implement the precision correction workspace.

- Build the Konva canvas with image fitting, pan, zoom, direct vehicle/plate selection, move, resize, and image-bound constraints.
- Build the context-sensitive Inspector, compact object switcher, live crop previews, OCR input, and coherent body-type silhouette selector.
- Implement immutable model baseline, mutable current draft, and last-saved state in Zustand.
- Implement undo/redo, resets, edited indicators, compare with an accessible non-hold fallback, save/retry behavior, and unsaved-change protection.
- Keep direct geometry manipulation immediate and free of easing.

Exit criteria:
- Canvas and Inspector satisfy the editor acceptance criteria across desktop, tablet, and mobile layouts.
- Saves retain local edits on failure and return corrected values to Results after success.

## Phase 7 — Quality, Performance, and Release Readiness

Verify critical journeys and operational quality across all three experiences.

- Add unit/component tests for schemas, geometry, stores, upload validation, and state transitions.
- Add Playwright coverage for upload → analysis → inspection; New Analysis and quota; editor correction, undo/redo, unsaved protection, save, and return flow.
- Test keyboard, touch, responsive, and reduced-motion paths.
- Optimize 3D assets, loading, canvas subscriptions, image rendering, and extraction animation performance.
- Perform a source-specification acceptance review and update project memory with completed milestones and genuinely unresolved issues.

Exit criteria:
- Critical user journeys pass reliably.
- No page introduces prohibited visual patterns, overlapping libraries, or client-only server authority.

## Recommended Execution Order

1. Resolve integration and asset gates in parallel with Phase 1.
2. Complete Phases 1 and 2 before wiring live workflows.
3. Build Home and its isolated demo, then upload routing.
4. Build Analysis / Results before Edit Results because it establishes the result handoff.
5. Complete cross-page testing and performance work after all core states exist.

## Documentation Maintenance

- Keep this plan in `docs/plans/active/` while work is underway.
- Move it to `docs/plans/completed/` only after Phase 7 is complete.
- Update `NOW.md` after a milestone changes project state.
- Update `PROJECT_MAP.md` when implementation paths are created.
- Update `DECISIONS.md` only for approved decisions; update `KNOWN_ISSUES.md` only for unresolved risks, bugs, or workarounds.

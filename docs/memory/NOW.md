# Current Project State

Last updated: 2026-09-04

## Current Phase

Phase 1 — Application Foundation is complete. The fixture-driven Phase 5 — Analysis / Results experience is implemented while Phase 2 live-integration inputs remain pending.

## Product Definition Status

Completed and approved:
- Home Page design specification
- Analysis / Results Page design specification
- Edit Results Page design specification
- Frontend Technology Contract

## Current Objective

Review the fixture-driven Analysis / Results experience and replace its isolated fixture boundary when the backend contract becomes available.

## Approved Page Flow

1. Home
2. Analysis / Results
3. Edit Results

## Important Current Constraints

- Initial UI language: English
- Initial theme: dark
- Future light-theme support should remain possible through semantic design tokens
- Home hero uses a 3D vehicle
- Initial analysis expects one primary vehicle; the backend selects the highest-confidence detection
- Anonymous users receive five analyses; backend enforces quota
- Analysis supports New Analysis without returning to the Home hero
- Edit Results is a focused correction workspace, not a general image editor

## Approved Frontend Foundation

- Next.js 16.x, React, TypeScript, Tailwind CSS 4
- shadcn/ui + Base UI, Motion for React
- Three.js + React Three Fiber + Drei
- Konva + react-konva
- TanStack Query, Zustand, Zod, Lucide React
- Vitest + React Testing Library, Playwright

## Next Milestone

Connect the Analysis / Results data boundary to the backend contract when available; until then, keep fixture behavior explicit and non-authoritative.

## Active Work

The general execution plan is active at `docs/plans/active/frontend-implementation-plan.md`.

The Home Hero is implemented with a lazy client-loaded React Three Fiber scene, a one-time scanner sequence, restrained pointer response, reduced-motion behavior, an accessible file picker, drag/drop feedback, and controlled MIME validation. It now loads an optimized, user-provided black BMW M5 GLB; plate and OCR Hero indications are deferred until a plate mesh is added.

The Model View section is implemented with an original real-world vehicle photograph, a direct draggable comparison divider, animated vehicle and plate overlays with a one-time inference scan sequence, a surface-topology wireframe mesh that reveals progressively behind the scan line, OCR/body-type interpretation, reduced-motion behavior, and pointer, touch, and keyboard support.

The Human in the Loop demo now uses a project-owned black sedan photo with a deliberately imperfect plate box and `34 ABC 12B` model read. Its compact review workflow combines direct move/resize interaction, a crop card, constrained Turkish-plate OCR correction, reset behavior, validation, and restrained feedback confirmation.

The Analysis / Results route now presents its fixture-driven result as a 1672 × 941 canonical Editorial Exploded View artboard: a 153 px editorial rail, dominant coordinate-safe source image in a clipped presentation shell, spatially matched irregular extraction fragments, responsive SVG traces, source-to-destination crop motion, completed-rest bbox concealment with focus/tap trace-back, reduced-motion behavior, downloads, Edit Results navigation, in-context New Analysis, quota handling, and a source-preserving failure state. Responsive layouts derive from the canonical desktop composition. Fixture status remains visibly disclosed; uploaded images and quota changes remain prototype behavior rather than live inference or backend enforcement.

## Do Not Revisit Without Explicit Reason

- React Three Fiber is the production 3D approach.
- Konva is the approved editor canvas.
- Motion is the default React animation library.
- There is no permanent Layers sidebar in Edit Results.
- Heavy scroll-jacking / cinematic scroll architecture is intentionally avoided.

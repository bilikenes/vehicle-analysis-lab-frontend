# Current Project State

Last updated: 2026-09-01

## Current Phase

Phase 1 — Application Foundation is complete. Phase 3 — Home Experience is in progress while Phase 2 live-integration inputs remain pending.

## Product Definition Status

Completed and approved:
- Home Page design specification
- Analysis / Results Page design specification
- Edit Results Page design specification
- Frontend Technology Contract

## Current Objective

Complete the integration-independent Home experience with the return-to-upload CTA and compact footer.

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

Complete the remaining Home sections and replace the isolated interim 3D vehicle when the approved production GLB becomes available.

## Active Work

The general execution plan is active at `docs/plans/active/frontend-implementation-plan.md`.

The Home Hero is implemented with a lazy client-loaded React Three Fiber scene, a one-time scanner sequence, restrained pointer response, reduced-motion behavior, an accessible file picker, drag/drop feedback, and controlled MIME validation. It currently uses an isolated project-owned interim 3D vehicle because the production GLB is pending.

The Model View section is implemented with an original real-world vehicle photograph, a direct draggable comparison divider, vehicle and plate overlays, OCR/body-type interpretation, and pointer, touch, and keyboard support.

The Human in the Loop demo is implemented with an intentionally imperfect plate box and OCR value, direct move/resize interaction, keyboard adjustments, a live plate crop, reset behavior, validation, and restrained feedback confirmation.

## Do Not Revisit Without Explicit Reason

- React Three Fiber is the production 3D approach.
- Konva is the approved editor canvas.
- Motion is the default React animation library.
- There is no permanent Layers sidebar in Edit Results.
- Heavy scroll-jacking / cinematic scroll architecture is intentionally avoided.

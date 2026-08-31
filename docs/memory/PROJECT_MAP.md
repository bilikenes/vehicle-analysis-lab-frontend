# Project Map

## Product Routes

### `/`

Home experience.

Source of truth:
`docs/specs/home-page.md`

### `/analysis/[analysisId]`

Analysis / Results experience.

Source of truth:
`docs/specs/analysis-results-page.md`

### `/edit/[analysisId]`

Correction workspace.

Source of truth:
`docs/specs/edit-results-page.md`

## Architecture Contract

Frontend technology and responsibility rules:

`docs/contracts/frontend-technology-contract.md`

## Active Memory

Current status:
`docs/memory/NOW.md`

Decision history:
`docs/memory/DECISIONS.md`

Unresolved problems:
`docs/memory/KNOWN_ISSUES.md`

## Active Plan

General frontend delivery plan:
`docs/plans/active/frontend-implementation-plan.md`

## Important Implementation Areas

No application implementation exists yet. The approved structure anticipates:

```text
src/app/                 Routes and application shell
src/components/home/     Home-specific visual components
src/components/analysis/ Analysis / Results components
src/components/editor/   Edit Results components
src/features/upload/     Upload feature logic
src/features/analysis/   Analysis feature logic
src/features/editor/     Editor feature logic
src/lib/api/             API clients
src/lib/schemas/         Zod schemas
src/lib/geometry/        Bounding-box and canvas geometry utilities
src/stores/editor-store.ts Editor working state and history
src/assets/vehicle-3d/   3D vehicle assets
src/assets/body-type-silhouettes/ Project-owned body type SVG silhouettes
```

## Rule

This file is a navigation map, not a design specification.

Keep explanations short.

Do not copy large sections from the source-of-truth documents.

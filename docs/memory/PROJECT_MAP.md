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

Foundation paths now in place:

```text
src/app/                 App Router layout, routes, and client providers
src/app/providers.tsx    TanStack Query provider
src/components/ui/       Shared project-owned primitives
src/styles/globals.css   Tailwind import and semantic design tokens
```

Home Hero implementation:

```text
src/components/home/hero-vehicle-scanner.tsx    Hero composition, scanner, and upload interaction
src/components/home/three-d-vehicle-scene.tsx   Lazy WebGL scene and isolated interim vehicle
src/components/home/scene-fallback.tsx          Non-WebGL/loading fallback
src/components/home/model-vision-comparison.tsx Reality / Model View comparison interaction
src/components/home/vehicle-inference-overlay.tsx Wireframe mesh overlay and inference scan animation
src/components/home/human-in-loop-demo.tsx      Plate-box and OCR correction demo
src/features/upload/vehicle-image.ts            Client-side supported MIME boundary
public/images/model-vision-vehicle.png          Project-owned real-world comparison photo
public/images/vehicle-analysis-logo.png         Primary brand mark used in the Home header
public/models/bmw-m5-hero.glb                   Optimized BMW M5 Hero WebGL asset
public/og.png                                   Home social preview
```

Reserved implementation boundaries:

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

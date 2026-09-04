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
public/images/human-in-loop-vehicle.png         Project-owned Human in the Loop correction photo
public/images/vehicle-analysis-logo.png         Primary brand mark used in the Home header
public/models/bmw-m5-hero.glb                   Optimized BMW M5 Hero WebGL asset
public/og.png                                   Home social preview
```

Analysis / Results implementation:

```text
src/app/analysis/[analysisId]/page.tsx                  Route boundary and fixture scenario selection
src/components/analysis/analysis-page-client.tsx        Reveal orchestration and page states
src/components/analysis/analysis-utility-bar.tsx        Status, quota, downloads, and New Analysis action
src/components/analysis/editorial-analysis-workspace.tsx Editorial header, composition, and inspection footer
src/components/analysis/editorial-side-rail.tsx         Canonical desktop artboard rail and prototype marker
src/components/analysis/original-image-stage.tsx        Coordinate-safe source image and quiet bounding boxes
src/components/analysis/extraction-sequence.tsx         Numbered vehicle/plate extraction modules
src/components/analysis/extraction-frame-variants.ts    Shared clipped vehicle/plate fragment geometry
src/components/analysis/trace-connector-layer.tsx       Responsive source-to-result SVG traces
src/components/analysis/extraction-animation-layer.tsx  Responsive source-to-result crop motion
src/components/analysis/new-analysis-upload-state.tsx   In-context repeat-upload state
src/features/analysis/analysis-view-model.ts             UI-facing temporary analysis model
src/features/analysis/analysis-fixture.ts                Explicit non-authoritative fixture provider
src/features/analysis/project-bounding-box.ts            Normalized geometry and crop presentation helpers
src/features/analysis/reveal-state.ts                    Ordered reveal state model
e2e/analysis.spec.ts                                     Analysis, quota, failure, and mobile flow coverage
```

Reserved implementation boundaries:

```text
src/app/                 Routes and application shell
src/components/home/     Home-specific visual components
src/components/analysis/ Analysis / Results components
src/components/editor/   Edit Results components
src/features/upload/     Upload feature logic
src/features/analysis/   Analysis presentation model, fixture, reveal, and geometry logic
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

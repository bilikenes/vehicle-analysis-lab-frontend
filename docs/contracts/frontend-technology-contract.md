# Frontend Technology Contract
## Vehicle Analysis Experience Platform

**Version 1.0**  
Architecture and implementation baseline

---

## 1. Purpose and Authority

This document is the frontend technology contract for the Vehicle Analysis Experience Platform. It is the source of truth for framework selection, library responsibilities, architectural boundaries, implementation rules, dependency policy, and frontend engineering conventions.

Its purpose is not to freeze the codebase forever. Its purpose is to prevent accidental stack drift. A new library must solve a problem that the existing stack cannot solve cleanly, and its responsibility must be explicitly defined before adoption.

When an implementation decision conflicts with this contract, the contract wins unless the contract is intentionally revised.

## 2. Product Context

The frontend supports three primary product experiences: Home, Analysis / Results, and Edit Results.

Home is an interactive product experience with a 3D vehicle hero, a one-time scanner sequence, image upload, a Reality / Model View comparison, and a Human-in-the-Loop demo.

Analysis / Results turns the uploaded image into a structured visual extraction experience. The original image remains the main focus while vehicle and plate crops are visually extracted into result modules. The page later settles into a calm inspection state.

Edit Results is a precision workspace. Users can modify the vehicle and plate bounding boxes, correct OCR, select the vehicle body type, compare model and edited states, undo/redo changes, and save corrections as feedback.

## 3. Approved Technology Stack

| Area | Approved choice | Responsibility |
|---|---|---|
| Application framework | **Next.js 16.x** | Routing, rendering, app structure, metadata, image/font integration |
| UI runtime | **React** | Component model and interactive UI |
| Language | **TypeScript** | Static typing and contract safety |
| Styling | **Tailwind CSS 4** | Design-token driven styling and responsive layout |
| UI primitives | **shadcn/ui + Base UI** | Accessible, composable primitives whose styling is owned by the project |
| Animation | **Motion for React** | UI motion, layout transitions, reveal choreography, micro-interactions |
| 3D | **Three.js + React Three Fiber + Drei** | Production 3D vehicle hero and related WebGL scene logic |
| Editor canvas | **Konva + react-konva** | Bounding boxes, drag, resize, pan, zoom, transforms |
| Server state | **TanStack Query** | API fetching, mutations, caching, invalidation |
| Client/editor state | **Zustand** | Selected object, editor history, compare state, zoom/pan, dirty state |
| Runtime validation | **Zod** | Validate API payloads at the frontend boundary |
| Icons | **Lucide React** | Consistent functional iconography |
| 3D asset format | **GLB / glTF** | Optimized production 3D delivery |
| Unit/component tests | **Vitest + React Testing Library** | Frontend behavior and component testing |
| E2E tests | **Playwright** | Critical user-flow verification |

## 4. Core Architectural Principle: One Tool, One Responsibility

Libraries must not overlap without a strong reason. Motion owns regular React UI animation. React Three Fiber owns WebGL and the 3D scene. Konva owns the image annotation canvas. TanStack Query owns server state. Zustand owns local editor and interaction state.

Avoid introducing a second library that solves the same problem merely because a copied component depends on it. External examples must be adapted to the approved stack rather than expanding the stack by default.

## 5. Next.js Contract

Use Next.js App Router. The project must be structured as an application, not as a single monolithic client component.

Default to Server Components for static or server-renderable composition. Add 'use client' only where browser state, event handling, Canvas/WebGL, Motion, file input, or other client-only behavior is required.

The Home page may server-render its static shell while loading the 3D hero on the client. Analysis and Edit routes may use client boundaries for interactive workspaces without turning the complete application into a client-only SPA.

Do not use Next.js server functionality to duplicate backend business logic. The ML/API backend remains authoritative for analysis, quota, feedback persistence, and rate limiting.

## 6. TypeScript Contract

All production frontend code must be TypeScript. Avoid 'any' in domain models and API boundaries. If a third-party type is incomplete, isolate the escape hatch and document it.

Shared domain types must model AnalysisResult, bounding boxes, crop assets, body type, quota state, model baseline, current edit state, saved state, and feedback payloads.

Types do not replace runtime validation. API payloads are validated with Zod before entering application state.

## 7. Styling and Design-System Contract

Tailwind CSS 4 is the primary styling layer. The project must use semantic design tokens rather than scattered hard-coded colors.

Core token roles include background, surface, elevated surface, border, primary text, secondary text, accent, success, and future light-theme equivalents.

The approved dark visual language is Automotive × Technical × Editorial. Avoid generic AI gradients, neon glows, rainbow borders, excessive glassmorphism, and decorative effects that are unrelated to the product.

Geist is the primary interface typeface and Geist Mono is reserved for restrained technical labels where it improves the visual language.

Light theme is not part of the initial release, but token naming must make a future light theme possible without rewriting components.

## 8. shadcn/ui + Base UI Contract

shadcn/ui is used as a source of accessible primitives and implementation patterns, not as the visual identity of the application.

New shadcn components must be brought into the codebase and restyled using project tokens. Their default appearance is never considered final.

Base UI is the preferred primitive layer for new shadcn-based components. Do not mix Base UI and alternative primitive systems inside the same feature without a concrete compatibility need.

Suitable uses include dialogs, popovers, tooltips, buttons, inputs, sheets, dropdowns, tabs, toggles, and other conventional interface controls.

## 9. External Component Sources

External component galleries may be used as implementation references. Preferred sources include shadcn/ui, Aceternity UI, Magic UI, and other high-quality React component collections.

The rule is: copy the interaction idea, not the site identity. Strip original colors, typography, gradients, glow effects, radii, spacing, and branding. Rebuild the component with the project design tokens.

Examples that fit the product especially well include comparison sliders, upload interactions, lens/magnifier patterns, progressive blur, and subtle loader concepts.

Do not combine many unrelated showcase components on one page. The result must never feel like a component-gallery template.

## 10. Motion Contract

Motion for React is the default JavaScript animation library. Use CSS transitions for very small state changes when CSS is sufficient.

Home uses Motion for scanner labels, UI reveals, upload state changes, comparison interactions, and the Human-in-the-Loop demo.

Analysis uses Motion for the vehicle and plate extraction choreography, OCR resolution, result assembly, and the transition from active analysis to calm inspection.

Edit Results uses motion sparingly: inspector transitions, selection states, compare transitions, save feedback, and other short contextual responses.

Do not add GSAP initially. It may be introduced only if a future animation requires timeline capabilities that are demonstrably awkward with Motion. Heavy scroll-jacking and scroll-driven cinematic timelines are specifically out of scope.

## 11. 3D Hero Contract

The production 3D hero uses Three.js through React Three Fiber, with Drei helpers where appropriate.

The hero contains a brand-neutral matte graphite / dark studio vehicle. It must not resemble a vehicle sales configurator. The 3D object exists to communicate analysis, not to provide decorative customization.

The initial scanner sequence runs once when the hero first becomes ready, then the scene settles into a calm interactive state. Continuous scanning loops are not allowed.

Mouse or pointer interaction may create restrained parallax, camera response, vehicle response, or hotspot emphasis. Interaction must remain subtle and must not make the vehicle difficult to inspect.

Use GLB/glTF assets. Production assets must be optimized for web delivery using appropriate mesh and texture compression. The 3D scene must be lazy-loaded and have a graceful static fallback.

Spline may be used for quick visual prototyping only. Production implementation should remain in React Three Fiber unless the contract is deliberately revised.

## 12. Analysis / Results Animation Contract

The original uploaded image remains the visual anchor. Result cards must not simply fade in as unrelated dashboard widgets.

The intended sequence is: original image → vehicle bounding box → vehicle extraction → plate bounding box → plate extraction → OCR resolution → body-type result → Analysis Complete → calm inspection mode.

The extraction visual must make it clear that each result originates from a region of the user's image. Hover/focus interactions must combine source highlighting and trace-back behavior.

Premium does not mean instant. The experience may breathe. However, intentional pacing must never become artificial blocking after the backend result is ready. Animation exists to reveal meaning, not to waste time.

## 13. Editor Canvas Contract

The Edit Results page uses Konva through react-konva. Do not build the core bounding-box editor from absolutely positioned HTML divs.

The canvas supports the original image, vehicle bounding box, plate bounding box, selection, drag, resize, zoom, pan, fit-to-view, and future precision helpers.

There is no full-height Layers sidebar. The canvas itself is the primary navigation surface. Users select Vehicle or Plate directly from the bounding box or from a compact object switcher in the Inspector.

Bounding-box manipulation must feel direct. During pointer drag or resize, do not add easing or delayed animation between the cursor and the geometry.

Crop previews update live while geometry changes. There is no Apply Crop step.

## 14. Editor State Model

The editor must explicitly distinguish three state concepts: Model Baseline, Current Edit, and Last Saved.

Model Baseline is immutable for the current analysis and powers Model vs Edited comparison. Current Edit is the live working state. Last Saved represents the latest correction state accepted by the backend.

Undo and Redo operate on meaningful editing actions. Dirty-state tracking must identify which domain fields changed, such as vehicle region, plate region, OCR, or body type.

Leaving the page with unsaved changes must trigger a protection dialog. Saving corrections must not automatically navigate away from the editor.

## 15. Body-Type Selector Contract

Body type is not presented as a generic dropdown in the primary desktop editing experience.

Use a purpose-built silhouette selector with a consistent family of vehicle silhouettes. Each body type icon must share the same visual angle, line weight, scale logic, and visual language.

The silhouettes should be project-owned SVG assets rather than a random mix from a generic icon library. If high-quality silhouettes are not ready, use a clean text selector temporarily rather than shipping inconsistent icons.

## 16. Data and State Ownership

TanStack Query owns API-backed data: analysis results, remaining quota, save-correction mutations, and any server-sourced status that should survive component boundaries.

Zustand owns local interaction state: selected object, zoom, pan, current bounding boxes, current OCR text, selected body type, compare state, history, redo stack, and local dirty-state metadata.

Do not mirror the same server state into Zustand unless a specific editor workflow requires a local working copy. When a working copy is required, the server result remains the baseline and Zustand contains the mutable draft.

React local state is preferred for trivial component-local concerns that do not need cross-component coordination.

## 17. API Boundary and Validation

Zod validates backend payloads before they are used by the UI. Invalid payloads must fail into a controlled application state instead of silently propagating malformed data.

The frontend may derive presentation data from validated API responses, but it must not invent authoritative analysis values.

The backend remains authoritative for the five-analysis quota, abuse prevention, analysis IDs, persisted corrections, and downloadable JSON result content.

Quota must never be enforced only through localStorage or client-side counters. The frontend displays the remaining count returned by the backend.

## 18. File Upload Contract

Use the browser's file input and drag-and-drop APIs unless a future requirement justifies a dedicated upload library.

The Home hero is the primary first-analysis upload entry point. The hero itself may act as a drag-and-drop surface.

The Analysis page includes New Analysis so repeat users do not return to Home and replay the full 3D introduction.

Upload UI must validate allowed MIME types and configured size limits before starting a request, but backend validation remains mandatory.

## 19. Routing and Suggested Project Structure

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ analysis/
│  │  └─ [analysisId]/
│  │     └─ page.tsx
│  ├─ edit/
│  │  └─ [analysisId]/
│  │     └─ page.tsx
│  └─ layout.tsx
├─ components/
│  ├─ ui/
│  ├─ home/
│  ├─ analysis/
│  └─ editor/
├─ features/
│  ├─ upload/
│  ├─ analysis/
│  └─ editor/
├─ lib/
│  ├─ api/
│  ├─ schemas/
│  ├─ geometry/
│  └─ utils/
├─ stores/
│  └─ editor-store.ts
├─ styles/
└─ assets/
   ├─ vehicle-3d/
   └─ body-type-silhouettes/
```

The exact folder boundaries may evolve, but route, feature, UI primitive, editor, schema, and asset concerns should remain visibly separated.

## 20. Testing Contract

Vitest and React Testing Library cover component behavior, utility logic, domain transformations, Zustand store behavior, and other deterministic frontend logic.

Playwright covers the critical product journeys: upload → analysis → result inspection; new analysis and quota display; edit bbox/OCR/body type; undo/redo; unsaved-change protection; save corrections; and return to updated results.

High-value animation flows should be tested for state completion rather than brittle pixel-perfect timing.

Canvas logic should have unit-testable geometry utilities separate from Konva rendering wherever practical.

## 21. Performance Contract

Performance is an experience requirement, not a reason to remove all motion. The goal is smooth, controlled pacing.

The 3D hero must not block the page shell. Lazy-load the WebGL scene and provide a lightweight fallback. Optimize GLB assets, textures, environment maps, and device pixel ratio.

Avoid unnecessary rerenders in Konva and 3D trees. Keep rapidly changing canvas/editor state narrowly subscribed in Zustand.

Use Next.js image/font facilities where useful, but do not force analysis images through transformations that break bounding-box coordinate consistency.

Respect prefers-reduced-motion. Reduced-motion users must receive the same information without choreography that is required to understand the result.

## 22. Dependency Governance

Do not install a package because an example component imports it. First determine whether the same behavior can be expressed with the approved stack.

A new dependency is acceptable only when it provides material value, has a clear owner/responsibility, is actively maintained, and does not substantially overlap an existing dependency.

Prefer direct, well-maintained packages over wrapper chains. Avoid large UI frameworks such as Material UI, Ant Design, or Bootstrap for the primary application interface because they conflict with the custom design-system strategy.

Package versions should be pinned through the lockfile. Major-version upgrades must be intentional and reviewed against this contract.

## 23. Explicit Non-Choices

The initial frontend will not use a heavy scroll-animation architecture, GSAP by default, a full UI framework such as Material UI, a general-purpose image editor, a full layer-management system, or client-only quota enforcement.

Spline is not the default production 3D runtime. Fabric.js is not the default editor canvas. These choices may be revisited only if a demonstrated requirement makes the approved tool unsuitable.

## 24. Agent / Codex Implementation Rules

Agents must read this technology contract and the page design specifications before making architectural changes.

Agents must not add a new framework, state library, animation library, canvas library, primitive system, or CSS methodology without explicitly identifying the missing capability and documenting the proposed change.

When using copied UI examples, agents must remove source-specific styling and apply project tokens before considering the task complete.

Agents should create reusable primitives only when reuse is real. Do not abstract one-off visual choreography prematurely.

Page-specific logic must stay close to the feature until a genuine cross-page abstraction appears.

The design specifications remain authoritative for UX behavior; this contract remains authoritative for implementation technology and responsibility boundaries.

## 25. Page-to-Technology Map

| Page | Primary technologies |
|---|---|
| Home | Next.js, Tailwind, shadcn/Base UI, Motion, React Three Fiber, Drei |
| Analysis / Results | Next.js, Motion, TanStack Query, shadcn/Base UI |
| Edit Results | react-konva/Konva, Zustand, Motion, TanStack Query, shadcn/Base UI |

## 26. Definition of Done for Frontend Technology Compliance

A feature is compliant when it uses the approved library for its responsibility, follows semantic design tokens, does not duplicate server authority in client state, validates external data at the boundary, and does not introduce overlapping dependencies without approval.

A page is not considered complete merely because it visually resembles the design. It must also preserve accessibility, reduced-motion behavior, responsive operation, editor state correctness, and API/state ownership rules defined by this contract.

## 27. Revision Policy

This contract is versioned. Technology changes are allowed, but they must be deliberate. When a major library is replaced or a new architectural responsibility is introduced, update this document in the same change.

Minor implementation details may evolve without a contract revision when they remain inside the responsibility boundaries defined here.

---

## Official Reference Set

- Next.js — https://nextjs.org/docs
- React — https://react.dev/
- TypeScript — https://www.typescriptlang.org/docs/
- Tailwind CSS — https://tailwindcss.com/docs
- shadcn/ui — https://ui.shadcn.com/docs
- Base UI — https://base-ui.com/
- Motion — https://motion.dev/docs/react
- Three.js — https://threejs.org/docs/
- React Three Fiber — https://r3f.docs.pmnd.rs/
- Drei — https://drei.docs.pmnd.rs/
- Konva — https://konvajs.org/docs/
- TanStack Query — https://tanstack.com/query/latest
- Zustand — https://zustand.docs.pmnd.rs/
- Zod — https://zod.dev/
- Lucide — https://lucide.dev/
- Playwright — https://playwright.dev/docs/intro
- Vitest — https://vitest.dev/
- React Testing Library — https://testing-library.com/docs/react-testing-library/intro/

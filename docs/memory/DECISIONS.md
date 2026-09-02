# Product & Architecture Decisions

## ADR-001 — Next.js as the frontend application framework

Status: Accepted

Decision:
Use Next.js App Router with React and TypeScript.

Reason:
The product combines a public product experience with multiple application routes, 3D/client-heavy sections, metadata requirements, and future extensibility.

---

## ADR-002 — Production 3D uses React Three Fiber

Status: Accepted

Decision:
Use Three.js through React Three Fiber with Drei helpers for the production 3D hero.

Prototype option:
Spline may be used for quick visual experimentation.

Reason:
The hero requires close integration with React state, custom scanning behavior, and controlled interaction.

---

## ADR-003 — Motion is the default UI animation system

Status: Accepted

Decision:
Use Motion for React plus CSS transitions.

Rejected as default:
GSAP.

Reason:
The approved experience does not rely on heavy scroll-driven cinematic timelines.

---

## ADR-004 — Konva owns the Edit Results canvas

Status: Accepted

Decision:
Use Konva / react-konva for image rendering, bounding boxes, drag, resize, pan, and zoom.

Reason:
The editor is a focused bounding-box correction tool rather than a general-purpose graphics editor.

---

## ADR-005 — No permanent Layers sidebar

Status: Accepted

Decision:
The Edit Results workspace uses Canvas + Right Inspector.

Vehicle and Plate are selected directly from the canvas or through a compact object switcher.

Reason:
Only two primary editable objects exist. A full-height Layers panel would waste workspace and add unnecessary complexity.

---

## ADR-006 — Server state and editor state are separated

Status: Accepted

Decision:
TanStack Query owns server-backed state.
Zustand owns local editor and interaction state.

Reason:
Server cache and local draft/editor behavior have different lifecycle requirements.

---

## ADR-007 — Anonymous analysis quota is backend-authoritative

Status: Accepted

Decision:
The frontend displays remaining analyses but does not enforce quota using local-only state.

Reason:
Client-side counters are trivial to bypass.

---

## ADR-008 — Home avoids heavy scroll choreography

Status: Accepted

Decision:
Do not build the Home page around scroll-jacking or long scroll-synchronized animation timelines.

Reason:
The experience should remain smooth, premium, and reliable across devices.

---

## ADR-009 — Component libraries provide primitives, not visual identity

Status: Accepted

Decision:
shadcn/ui, Aceternity UI, Magic UI, and similar sources may provide primitives or interaction references.

Their default visual identity must not define the product.

Reason:
The project has an approved custom Automotive × Technical × Editorial design language.

---

## ADR-010 — The Hero uses the user-provided BMW M5 asset

Status: Accepted

Decision:
Use the user-provided black BMW M5 GLB in the Home Hero, retaining its manufacturer badges and styling. Do not show plate or OCR Hero indications until a plate mesh is available.

Reason:
The user explicitly selected their own vehicle model for the product identity. The Hero remains an analysis demonstration, without configurator controls.

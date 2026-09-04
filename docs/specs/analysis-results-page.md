# Analysis / Results Page Design Specification

**Project role:** Core analysis experience and result-inspection workspace  
**Document status:** Source of truth for the Analysis / Results Page  
**Product language:** English  
**Initial theme:** Dark  
**Design direction:** Editorial Exploded View structured-extraction experience

---

## 1. Purpose of this document

This document defines the agreed experience, layout, animation, states, interactions, actions, quota behavior, and technical presentation rules for the Analysis / Results Page.

This page is not a generic dashboard. It is the product's second major “wow” moment after the 3D Home Page Hero.

The central design idea is:

> **The image does not disappear when analysis finishes. The results are visually extracted from it.**

The page should make the analysis process feel tangible: vehicle and plate crops appear to originate from the exact bounding boxes in the user's original image, then settle into a calm inspection workspace.

---

## 2. Product assumptions — Locked

- The page is designed for **one vehicle result**.
- The backend may detect multiple vehicles internally, but it will return/use the highest-confidence vehicle for this first version.
- The user's **original uploaded image is the primary visual focus**.
- Vehicle and plate bounding boxes are visible during extraction and on trace-back focus/tap. They are hidden in the completed resting state.
- Bounding boxes must be thin and premium, not thick debug rectangles.
- The user cannot edit results directly on this page.
- All actual editing occurs on the separate Edit Results page.
- The user is not shown confidence values, model names, processing time, or low-level inference details in the primary UI.
- Detailed machine-readable results can be downloaded in JSON.
- Users have a total anonymous analysis allowance of **5 analyses** under the initial product model.
- Users must be able to start another analysis directly from this page without returning to the Home Page Hero.

---

## 3. Page philosophy

### Core experience

The page has two phases:

1. **Reveal / extraction phase** — visually active
2. **Inspection phase** — calm and stable

The product is intentionally experience-oriented. The reveal does not need to be hyper-fast. It can breathe and feel premium, as long as it does not become unresponsive or arbitrary.

The design should create a feeling of “the system understood this image and extracted structured information from it.”

### Avoid

- Static image + four generic cards appearing instantly
- Progress spinner as the primary experience
- Dense analytics/dashboard presentation
- Model debug panels
- Endless looping motion after completion
- Editing controls mixed into result inspection

---

# 4. Overall layout

## 4.1 Primary composition

The original image remains the largest element.

The 1672 × 941 reference artboard is the canonical completed desktop composition. At that viewport, its spatial relationships are authoritative rather than general inspiration:

- A 153 px editorial rail anchors the left edge below and within the utility shell.
- The headline, supporting copy, source image, `01–04` modules, overview copy, dot matrix, guidance, and Edit Results action follow the reference artboard positions and hierarchy.
- The source image remains the dominant element and uses an asymmetrically clipped outer presentation shell.
- The image element and bbox coordinate plane remain flat, rectangular, and undistorted inside that shell.

Responsive layouts are derived from this canonical composition rather than independently redesigned. The editorial header must not push the source image below the fold at the 1366 × 768 target.

## 4.2 Result modules

Result modules form one asymmetrical Editorial Exploded View sequence and must not feel like heavy dashboard cards. The primary asymmetry comes from the geometry of the extracted panels themselves, not only from staggered placement.

Use one coherent three-variant frame system:

- Vehicle Crop: dominant clipped fragment with a cut corner and restrained slanted edge
- Plate Crop: compact chamfered strip
- OCR Result: open, segmented corner frame

Body Type remains a lightweight typographic node and may use one restrained ghost character. Do not use random polygons, plain rectangular crop cards, or heavy HUD-style edges. The true source image and bbox plane remain rectangular and coordinate-safe.

Locked sequence:

1. `01 VEHICLE CROP`
2. `02 PLATE CROP`
3. `03 BODY TYPE`
4. `04 OCR RESULT`

Vehicle Crop and Body Type form the vehicle family. Plate Crop and OCR Result form the plate family. Thin responsive SVG connectors trace each module to the correct source bbox. Connectors remain quiet at rest and strengthen on hover, focus, or tap.

---

# 5. Signature extraction animation — Locked concept

The signature interaction is a choreographed extraction sequence from the original image.

## 5.1 Phase 1 — Original image arrives

The user's uploaded image appears as the main visual.

Initial copy may be concise:

- `Analyzing image...`
- or a quiet analysis state in the utility bar

Avoid large indeterminate spinner overlays that hide the image.

## 5.2 Phase 2 — Vehicle detection

A thin vehicle bounding box draws itself around the detected vehicle.

Preferred drawing style:

- Start with corner segments or partial strokes
- Resolve into a complete refined rectangle
- Neutral/silver line rather than accent amber

The bbox should feel like a design element, not an OpenCV debug screenshot.

## 5.3 Phase 3 — Vehicle extraction

A visual clone of the pixels inside the vehicle bbox appears to detach from the original image.

Important behavior:

- The original image remains unchanged.
- The crop is a visual duplicate/clone.
- The clone moves from the source bbox to the Vehicle result position.
- Motion should include restrained scale/position easing.
- The destination should feel like the natural place where that extracted object now belongs.

This creates the key “pixels → structured result” moment.

## 5.4 Phase 4 — Body classification

Body type appears in direct relationship with the settled vehicle crop.

Example:

- Label: `BODY TYPE`
- Value: `Sedan`

The body result should feel derived from the vehicle crop rather than appearing as an unrelated card.

## 5.5 Phase 5 — Plate detection

After vehicle extraction, the plate bbox becomes the active focus.

Recommended:

- Vehicle bbox becomes quieter but remains visible.
- Plate bbox appears using Amber Accent.
- Background/other overlays can subtly reduce emphasis.

## 5.6 Phase 6 — Plate extraction

The plate crop visually detaches from the plate bbox and travels to its result location.

Again:

- The original image remains intact.
- The plate crop is a clone/extraction animation.

The motion language should match Vehicle extraction but can be slightly quicker because the element is smaller.

## 5.7 Phase 7 — OCR resolve

OCR result appears in direct relationship with the plate crop.

Preferred animation is a brief character-resolution effect rather than a generic fade.

Example concept:

`34 A8C 1?3`  
→ `34 ABC 123`

This must remain subtle. Do not turn it into a hacker/terminal scramble effect.

## 5.8 Phase 8 — Analysis complete

After all outputs have settled:

- Show a restrained `Analysis complete` status.
- Activate/fully reveal utility actions if they were intentionally delayed.
- Transition to calm inspection mode.
- Bounding boxes disappear in the completed resting state and return for relevant focus/tap trace-back.
- No scanner loops.
- No repeated result animations.

---

# 6. Motion pacing

## 6.1 Product stance — Locked

This page is an experience center, so transitions do not need to be aggressively optimized for perceived speed.

A premium reveal may intentionally take a few seconds.

Recommended feel:

- Confident
- Smooth
- Deliberate
- Cinematic in restraint, not spectacle

Suggested total reveal range after sufficient backend data is available: approximately **2.5–4.5 seconds**. This is a recommendation, not a hard SLA.

Do not intentionally stall a completed operation for a very long decorative sequence, but it is acceptable for visual extraction to take longer than a typical SaaS micro-animation.

## 6.2 Backend synchronization

The visual sequence does not have to imply that each model literally executes at the exact moment its animation plays.

Two valid implementation approaches:

### If backend exposes meaningful stages
- Reflect those stages when possible.
- Hold gracefully at the current visual state if the next stage is not ready.

### If backend returns a complete result object
- Start a choreographed reveal once results are available.
- Do not fabricate misleading progress percentages.

---

# 7. Calm inspection mode — Locked

Once the reveal sequence completes, the page becomes intentionally calm.

In this mode:

- Original image remains dominant.
- Vehicle and plate bboxes are hidden at rest.
- The relevant bbox reappears when its result family receives hover, keyboard focus, or tap focus.
- Crops remain in final result positions.
- OCR and body type are stable.
- No looping extraction motion.
- No repeating scanner.

The user should be able to stop and inspect the output comfortably.

This follows the site-wide rule:

> **Motion introduces the result; stillness lets the user understand it.**

---

# 8. Focus + trace-back interaction — Locked

The previously discussed “focus” and “trace-back” concepts are merged into one unified interaction.

## 8.1 Purpose

When the user hovers/focuses a result module, they should immediately understand where it came from in the original image.

## 8.2 Plate example

When hovering/focusing:

- Plate crop
- OCR result
- Plate result group

Then:

- Original image may dim slightly outside the relevant region.
- Plate bbox becomes more prominent.
- Plate region remains at full emphasis.
- A subtle relationship line/path may become visible if it improves clarity.
- Other result groups reduce emphasis.

## 8.3 Vehicle example

When hovering/focusing:

- Vehicle crop
- Body type

Then:

- Vehicle bbox becomes prominent.
- Relevant vehicle region stays visually emphasized.
- Plate-specific elements can reduce emphasis.

## 8.4 Trace-back principle

The user should be able to answer:

> “Where did this crop/result come from?”

without opening another page or reading metadata.

## 8.5 Visual restraint

Connection lines, dimming, and highlights should not be permanently bright.

At rest:

- Relationship lines can be hidden or very low opacity.

On interaction:

- Relationship becomes clearer.

This prevents the screen from becoming a diagram when the user is simply inspecting results.

---

# 9. Bounding-box visual language

## Vehicle bbox

- Thin neutral/silver line
- Low visual aggression
- Refined corners
- No thick debug labels

## Plate bbox

- Amber Accent `#FFB547`
- Slightly more prominent than the vehicle bbox
- Still thin and premium

## Interaction states

- Rest: quiet
- Hover/focus: stronger opacity/emphasis
- Edit-page preview affordance: handles may be hinted only through the `Edit Results` action, not permanently shown here

---

# 10. Edit Results action — Locked

The Analysis Page is read-only from the user's perspective.

The primary correction action is:

> `Edit Results`

## 10.1 Behavior

- Navigates to the dedicated Edit Results page.
- No inline OCR editing.
- No draggable bbox handles in normal Analysis Page mode.

## 10.2 Hover affordance

A small creative detail is allowed:

When the user hovers `Edit Results`, bbox corner handles can briefly appear or become visually hinted on the original image.

Purpose:

- Preview what “editing” means.
- Reinforce that the next page edits boxes/results.

Do not make the current page accidentally feel editable.

---

# 11. Download Results — Locked

The primary UI does not expose low-level technical detail. Users who need detail can download it.

## 11.1 Download action

Use a `Download Results` / `Download` action, preferably in the utility area.

Possible popover:

- Original image
- Vehicle crop
- Plate crop
- Result JSON
- `Download all`

Exact packaging can be finalized during implementation.

## 11.2 JSON output

The JSON may contain significantly more technical detail than the visible UI.

Recommended categories:

- OCR result
- Body type
- Vehicle bbox coordinates
- Plate bbox coordinates
- Detection confidence values
- OCR confidence if available
- Body-class confidence if available
- Model/version identifiers if operationally useful
- Image dimensions
- Processing metadata/timestamps if useful

Illustrative schema:

```json
{
  "plate": "34ABC123",
  "body_type": "sedan",
  "vehicle_bbox": [x1, y1, x2, y2],
  "plate_bbox": [x1, y1, x2, y2],
  "confidence": {
    "vehicle": 0.99,
    "plate": 0.98,
    "ocr": 0.96,
    "body_type": 0.94
  }
}
```

This schema is illustrative; backend contract is authoritative.

---

# 12. Technical-detail visibility — Locked

Do **not** display the following as normal UI content:

- Confidence percentages
- Model names
- Model versions
- Raw coordinates
- Processing time
- Tensor/input sizes
- Infrastructure details

Reason:

The primary user goal is to understand the result, not inspect inference diagnostics.

If a result later requires a low-confidence warning, that can be introduced as a separate product rule. It is not part of the current locked Analysis Page UI.

---

# 13. Editorial extraction sequence — Locked

The extracted outputs behave as one numbered editorial sequence rather than a stack of cards.

Semantic families:

### VEHICLE
- Vehicle crop
- Body type

### PLATE
- Plate crop
- OCR

The extraction animation visually builds this sequence from the original image.

The completed canonical header uses the eyebrow `VISION TO DATA` and the two-line headline `Editorial` / `Exploded View`. The utility bar carries the functional `Analysis complete` status. The supporting copy reads `We don't just detect. We deconstruct for clarity.`

---

# 14. New Analysis workflow — Locked

## 14.1 Why it exists

Users have 5 analyses available. After viewing a result, they should not need to return to the Home Page and replay the 3D Hero experience just to analyze another image.

The Analysis Page therefore becomes a lightweight repeat-use workspace.

## 14.2 Utility action

Provide a clear action:

> `+ New Analysis`

Recommended placement: top utility area, alongside remaining quota and Download.

Example utility layout:

`Analysis complete`  ·  `3 of 5 analyses remaining`  ·  `Download`  ·  `+ New Analysis`

Exact spacing/order can adapt to screen size.

## 14.3 Remaining quota — Locked

Show remaining analysis allowance in a restrained way.

Preferred language:

- `3 of 5 analyses remaining`
- or `3 analyses remaining`

Avoid gamified meter visuals unless later design testing proves useful.

## 14.4 New Analysis interaction

Clicking `+ New Analysis` must **not** route the user back to the Home Page.

Preferred flow:

1. Existing result remains visible in the background or transitions into a subdued state.
2. A dedicated upload state appears in the current page context.
3. User selects/drops another image.
4. Current page returns to analysis/reveal mode.
5. New original image becomes the active image.
6. Signature extraction animation runs for the new result.
7. Remaining quota updates.

## 14.5 Upload presentation

Avoid a generic browser modal-looking experience.

Preferred options:

- Full-content-area upload state
- Premium overlay integrated with the workspace
- Existing result slightly dims/recedes

Suggested content:

> **New Analysis**  
> Drop another vehicle image here  
> `Choose Image`

## 14.6 Cancel behavior

Until a new file has been accepted, the current result remains recoverable.

If the user cancels the New Analysis state, return to the existing result without confirmation prompts.

Do not ask “Are you sure?” merely for opening the upload state.

---

# 15. Quota-exhausted state

When the user has used all 5 analyses:

- Show `0 analyses remaining` or a similarly clear status.
- Disable or replace `+ New Analysis`.
- Explain concisely:

> You've used all 5 analyses available for this session.

Do not convert the entire result page into an error screen. Existing results should remain inspectable and downloadable.

The actual abuse-prevention implementation (e.g. signed cookie + IP + server-side rate limiting) belongs to backend/security documentation, not this visual specification.

---

# 16. Suggested top utility bar

Conceptual hierarchy:

- Navigation back to Home if needed
- Analysis status
- Remaining analyses
- Download
- New Analysis

Example:

`← Home`  |  `Analysis complete`                              `3 analyses remaining`  `Download`  `+ New Analysis`

Do not make this look like a full SaaS application navigation shell unless the project later expands.

---

# 17. Analysis states

The page should explicitly support the following states.

## 17.1 Initial analyzing

- Original image visible
- Active extraction/reveal sequence
- Utility actions may be partially unavailable until meaningful data exists

## 17.2 Complete

- Calm inspection mode
- Bounding boxes hidden at rest and revealed for trace-back focus/tap
- Results settled
- Download active
- Edit Results active
- New Analysis active if quota remains

## 17.3 New Analysis upload state

- Existing result preserved until a new file is accepted
- Clear upload target
- Cancel returns to previous result

## 17.4 Quota exhausted

- Existing result remains usable
- New Analysis unavailable
- Clear concise explanation

## 17.5 Invalid new file

- Keep current result
- Show inline error in upload state
- Allow immediate retry

## 17.6 Analysis failure

If backend analysis fails:

- Do not show a blank page.
- Keep the uploaded image if safe/available.
- Explain that analysis could not complete.
- Offer retry if quota semantics allow it.
- Do not consume an analysis credit for server-side failure unless product policy explicitly chooses that behavior.

The exact quota-consumption policy on failed requests should be documented separately in backend/product rules.

---

# 18. Visual system

The Analysis Page uses the same canonical palette as the Home Page.

Reference: `vehicle_analysis_color_palette.png`

- Deep Background — `#0B0D0F`
- Primary Surface — `#111417`
- Elevated Surface — `#171B1F`
- Border / Divider — `#2A3036`
- Primary Text — `#F3F4F1`
- Secondary Text — `#969CA3`
- Amber Accent — `#FFB547`
- Success — `#6ED6A0`

## Role-specific usage

- Original-image frame: neutral dark surface
- Vehicle bbox: neutral/silver
- Plate bbox: Amber Accent
- OCR value: Primary Text
- Body type: Primary Text
- Supporting labels: Secondary Text
- Completion: Success
- Active upload/drop state: Amber Accent used sparingly

---

# 19. Typography and data presentation

- Main result values should be highly legible.
- OCR plate string may use a mono or semi-mono presentation to reinforce structured data.
- `VEHICLE`, `PLATE`, `BODY TYPE` labels can use small uppercase tracking.
- Avoid tiny diagnostic typography.
- Body type should be presented as a normal human-readable label (`Sedan`), not raw model class syntax if backend class names differ.

---

# 20. Responsive behavior

## 20.1 Desktop

At 1672 × 941:

- Match the canonical reference artboard spatially, including the 153 px rail, source-image placement, headline hierarchy, extraction fragment positions, overview, dot matrix, and lower actions.
- Keep the original image large on the left and the editorial extraction sequence on the right.
- Utility actions remain visible
- Extraction animations can travel spatially from image to results

## 20.2 Tablet

- Original image remains dominant
- Extraction sequence moves below the source image and can use two columns
- Extraction paths should be recalculated based on actual DOM positions
- Avoid hard-coded animation coordinates

## 20.3 Mobile

Mobile requires a different motion composition.

Recommended:

- Original image first
- Numbered extraction sequence below
- Vehicle/plate crop extraction can move downward rather than sideways
- Focus/trace-back can use tap/focus instead of hover
- Utility actions may collapse into a compact toolbar/menu
- Remaining quota must still be visible
- `+ New Analysis` remains easy to reach

Do not disable the conceptual extraction just because layout stacks vertically; adapt its direction.

---

# 21. Interaction accessibility

- Hover interactions must have focus/tap equivalents.
- Result modules should be keyboard focusable if focus triggers trace-back.
- Dimmed image state must retain enough visibility to preserve context.
- Do not use amber alone to convey the plate result; labels/bbox semantics also matter.
- Download menu must be keyboard operable.
- New Analysis upload must support button selection in addition to drag-and-drop.
- Respect `prefers-reduced-motion`.

### Reduced-motion behavior

When reduced motion is requested:

- Bounding boxes can appear without animated drawing.
- Crops can fade/settle rather than fly from source to destination.
- OCR can appear directly rather than character-resolve.
- Focus/trace-back remains fully functional.

---

# 22. Implementation notes for extraction animation

Recommended technical strategy:

1. Render original image and result destination containers.
2. Compute source bbox rectangle in screen coordinates.
3. Create a temporary visual clone/crop layer.
4. Animate that layer using transforms to the destination container.
5. Reveal the permanent destination crop near animation completion.
6. Remove temporary animation layer.

Benefits:

- Original image never needs to be mutated.
- Animations adapt to responsive layouts.
- Same conceptual animation can be reused for new analyses.

Avoid fixed pixel trajectories tied to one desktop resolution.

---

# 23. Performance approach

The page prioritizes visual quality and smoothness over raw animation speed.

Performance goal is **stable motion**, not minimum-duration motion.

Recommended:

- Prefer transform/opacity animations.
- Avoid repeated canvas re-renders if DOM overlays are sufficient.
- Pre-decode result crops before animation when possible.
- Do not animate expensive filters continuously.
- Stop all non-essential motion after completion.

The calm inspection state should be computationally inexpensive.

---

# 24. Explicit non-goals / things to avoid

- No inline editing on Analysis Page
- No multi-vehicle selector in v1
- No technical model/debug dashboard
- No visible confidence percentages by default
- No giant spinner hiding the image
- No instant generic four-card reveal
- No return-to-Home requirement for repeated analyses
- No replay of 3D Hero for every file
- No looping extraction animation after completion
- No quota gamification requirement
- No confirmation modal just for opening New Analysis

---

# 25. Recommended component map

Potential frontend structure:

- `AnalysisPage`
  - `AnalysisUtilityBar`
    - `AnalysisStatus`
    - `QuotaIndicator`
    - `DownloadResultsMenu`
    - `NewAnalysisAction`
  - `EditorialAnalysisWorkspace`
    - `EditorialSideRail`
    - `OriginalImageStage`
      - `VehicleBBox`
      - `PlateBBox`
      - `FocusOverlay`
    - `TraceConnectorLayer`
    - `ExtractionSequence`
      - `VehicleCropModule`
      - `PlateCropModule`
      - `BodyTypeModule`
      - `OCRResultModule`
  - `ExtractionAnimationLayer`
  - `EditResultsAction`
  - `NewAnalysisUploadState`

State-machine names are implementation choices, but the UI should be designed as explicit states rather than ad-hoc booleans scattered across components.

---

# 26. Acceptance criteria

The Analysis / Results Page can be considered aligned with this specification when:

- The original uploaded image is the dominant visual.
- Exactly one primary vehicle result is presented.
- Vehicle and plate bboxes are hidden in completed/resting state and revealed during extraction or relevant trace-back focus/tap.
- Bboxes use the agreed thin premium visual language.
- Vehicle crop visually extracts from the vehicle bbox.
- Plate crop visually extracts from the plate bbox.
- Vehicle and plate crops use the approved non-rectangular fragment geometry.
- OCR uses an open segmented frame rather than a full rectangular card.
- OCR appears in relationship with the plate crop.
- Body type appears in relationship with the vehicle crop.
- The initial sequence transitions into a calm inspection state.
- Hover/focus/tap on results clearly traces back to the corresponding region in the original image.
- Analysis Page itself contains no editing controls.
- `Edit Results` navigates to the editor and may preview edit affordances on hover.
- Technical detail is omitted from normal UI.
- Download provides access to images and detailed JSON.
- Remaining analysis allowance is visible.
- Users can start `+ New Analysis` directly from this page.
- Starting a new analysis does not replay the Home Page Hero.
- New Analysis preserves the current result until a new file is accepted.
- Quota-exhausted state preserves result inspection/download.
- English is used for product UI/copy.
- Reduced-motion users retain full functionality.
- At 1672 × 941, the finished composition is recognizably the same spatial design as the approved reference artboard rather than a loose reinterpretation.

---

# 27. Final design statement

The Analysis Page should feel like a **structured extraction workspace** rather than a dashboard:

**Original Image → Detect → Extract → Resolve → Settle → Inspect → Download / Edit / Analyze Again**

The signature experience is the visual relationship between source pixels and structured results. Motion explains the transformation; stillness supports inspection.

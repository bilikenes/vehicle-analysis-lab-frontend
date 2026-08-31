# Edit Results Page Design Specification

**Project role:** Dedicated correction workspace for model-generated vehicle analysis results  
**Document status:** Source of truth for the Edit Results Page  
**Product language:** English  
**Initial theme:** Dark  
**Design direction:** Automotive × Technical × Editorial  
**Primary experience principle:** Precision over spectacle

---

## 1. Purpose of this document

This document defines the agreed product, interaction, visual, animation, content, state-management, and implementation direction for the **Edit Results Page**.

It is intended to be the primary reference for product design and frontend implementation. Decisions marked as **Locked** represent explicit decisions made during product definition and should not be changed casually during implementation. Any deviation should be treated as an intentional product/design change rather than a local UI adjustment.

The Edit Results Page is the third major page in the product journey:

1. Home Page — discover and try the experience
2. Analysis / Results Page — watch the result emerge and inspect it
3. **Edit Results Page — take control and correct the model**

The Edit Results Page must feel like a real working tool, but it must not become a general-purpose image editor or a complex annotation platform. The user is not here to edit pixels freely; the user is here to correct a small, clearly defined set of model outputs.

> **Core principle:** The model proposes the result. The user has final control.

---

## 2. Product context

The analysis flow returns one primary vehicle and the following user-facing outputs:

- Vehicle bounding box
- Vehicle crop
- Plate bounding box
- Plate crop
- OCR / license plate text
- Vehicle body type

The Edit Results Page allows the user to correct those outputs when necessary.

For the initial product version, the system is designed around **one selected vehicle per analysis**. The backend returns the single vehicle selected by its own ranking logic, and the editing experience is therefore intentionally single-vehicle rather than multi-object annotation.

The correction workflow is also part of the feedback loop. When the user changes a model-generated value and saves the correction, the product should retain the relationship between:

- Original model prediction
- Corrected user value

This allows the correction to function both as a better user-facing result and as useful feedback data for future model evaluation or training workflows.

The UI should communicate user control without turning the page into a machine-learning dashboard. Confidence scores, model names, tensors, raw coordinates, and similar technical metadata should not be shown in the normal editor interface.

---

## 3. Core Edit Page philosophy

### Locked principles

- The page is a **focused correction workspace**, not a Photoshop/Figma clone.
- There is **no traditional Layers sidebar**.
- The image canvas is the primary interaction surface.
- The user selects what they want to edit by clicking the relevant object directly in the image or by using a compact object switcher.
- Only product-relevant model outputs are editable.
- Vehicle and plate bounding boxes must be directly draggable and resizable.
- Crops update live as bounding boxes change.
- The right-side Inspector changes context depending on the selected object.
- Vehicle body type is selected through a visual silhouette picker rather than a generic dropdown.
- OCR is edited as text while the plate crop remains visible for visual reference.
- Users can compare the original model prediction with their edited result.
- Undo / Redo is part of the core editor, not an optional enhancement.
- Changes must be recoverable through object-level reset and full reset.
- Leaving with unsaved changes must be protected.
- Saving a correction also creates the product feedback record.
- Motion should support clarity and state transitions, not provide spectacle.
- The editing experience should feel immediate, precise, calm, and premium.

---

## 4. Experience role within the full product

The three core pages should have distinct emotional roles:

- **Home — Discover:** Showcase / interactive introduction
- **Analysis / Results — Understand:** Reveal / extraction choreography
- **Edit Results — Take control:** Precise / restrained / responsive

The Edit Results Page should intentionally feel calmer than the Home and Analysis pages.

The user has already seen the product demonstrate itself. At this point, the interface should get out of the way and allow accurate corrections.

---

# 5. Final page architecture

## 5.1 Locked desktop structure

The desktop page should use four functional regions:

1. **Top Toolbar**
2. **Main Image Canvas**
3. **Context-Sensitive Right Inspector**
4. **Compact Canvas Controls**

There is no full-height left Layers panel.

Conceptual layout:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ← Back to Results       Edit Results       Undo   Redo    Save Changes  │
├───────────────────────────────────────────────┬──────────────────────────┤
│                                               │                          │
│                                               │      INSPECTOR           │
│                                               │                          │
│                MAIN IMAGE CANVAS              │      Selected object     │
│                                               │      Crop preview        │
│       Vehicle + Plate editable bboxes         │      Related fields      │
│                                               │      Reset action        │
│                                               │                          │
├───────────────────────────────────────────────┴──────────────────────────┤
│  −   100%   +   Fit        Compare / model result controls              │
└──────────────────────────────────────────────────────────────────────────┘
```

The central image must remain the largest visual element on the page.

---

# 6. Top Toolbar

## 6.1 Purpose

The Top Toolbar contains **global editor actions** rather than object-specific actions.

Recommended structure:

```text
← Back to Results        Edit Results             Undo   Redo   Save Changes
```

Possible secondary status near Save:

```text
Saved ✓
```

or an unsaved-state indicator when changes exist.

## 6.2 Back to Results — Locked

`Back to Results` returns the user to the Analysis / Results Page.

Behavior:

- If there are no unsaved changes → navigate immediately.
- If there are unsaved changes → show an unsaved changes dialog.

Do not silently discard user corrections.

## 6.3 Undo / Redo — Locked

Undo and Redo are core editor actions.

They should support at minimum:

- Vehicle bbox move
- Vehicle bbox resize
- Plate bbox move
- Plate bbox resize
- OCR text change
- Body-type change
- Object-level reset

Recommended shortcuts:

- `Ctrl/Cmd + Z` → Undo
- `Ctrl/Cmd + Shift + Z` → Redo

Optional platform-standard alternative:

- `Ctrl/Cmd + Y` → Redo where appropriate

Disabled Undo/Redo states should remain visible but visually muted so the toolbar layout does not shift.

## 6.4 Save Changes / Save Corrections — Locked intent

The primary save action should be clearly visible without becoming visually aggressive.

Preferred naming direction:

- `Save Corrections`

`Save Changes` is acceptable, but `Save Corrections` better communicates the product loop.

Save should only be emphasized when there are unsaved changes.

---

# 7. Main Image Canvas

## 7.1 Purpose

The canvas is the primary workspace and should occupy the largest possible portion of the viewport.

It contains:

- Original uploaded image
- Editable vehicle bounding box
- Editable plate bounding box
- Selection handles
- Focus/dimming states

The image itself should never be destructively changed by editing the boxes. The editor updates coordinate metadata and derived crops.

## 7.2 Image display

The uploaded image should:

- Preserve aspect ratio
- Fit within the available canvas by default
- Remain centered when possible
- Never be visually stretched
- Use a subtle neutral background around letterboxed areas

The initial view should typically use `Fit` behavior so the user immediately sees the entire image.

## 7.3 Canvas is the navigation — Locked

The primary selection behavior is direct manipulation:

> **The user clicks the thing they want to edit.**

If the user clicks the Plate bbox:

- Plate becomes selected.
- Plate bbox receives active styling.
- Vehicle bbox becomes visually quieter.
- Right Inspector transitions to Plate editing controls.

If the user clicks the Vehicle bbox:

- Vehicle becomes selected.
- Vehicle bbox receives active styling.
- Plate bbox becomes quieter.
- Right Inspector transitions to Vehicle editing controls.

This replaces the need for a permanent Layers panel.

---

# 8. Object selection model

## 8.1 Editable objects — Locked

The initial editor has only two selectable geometric objects:

- `Vehicle`
- `Plate`

This simplicity should be reflected in the interface.

## 8.2 Secondary selection method

Direct canvas selection must be supported by a second, compact selection mechanism for accessibility and situations where bounding boxes overlap.

Preferred location:

**Inside the top area of the Right Inspector.**

Example:

```text
OBJECT

[ Vehicle ]   [ Plate ]
```

The selected option should be visually obvious.

This switcher is not a layer panel. It is a compact object selector.

## 8.3 Initial selection state

Recommended first-load behavior:

- No object is aggressively selected.
- Right Inspector begins in an **Edit Summary / Overview** state.
- Both bounding boxes remain visible in their calm default form.

Suggested Inspector copy:

```text
EDIT SUMMARY

Vehicle
Sedan

Plate
34 ABC 123

No corrections yet.

Select an area in the image to edit it.
```

As soon as the user selects Vehicle or Plate, the Inspector becomes object-specific.

This overview state prevents the page from feeling as though the user has been dropped into an editor without instructions.

---

# 9. Bounding box visual language

## 9.1 General style — Locked

Bounding boxes should feel precise and premium rather than like default annotation-tool rectangles.

Avoid:

- Thick neon rectangles
- Large opaque labels
- Oversized square resize handles
- Constant pulsing/glowing
- Multiple bright colors competing for attention

Use:

- Thin lines
- Restrained opacity
- Small corner handles
- Clear selected vs unselected states

## 9.2 Vehicle bbox

Recommended visual role:

- Soft neutral / light-grey line
- Lower visual emphasis than Plate
- Clear enough to remain visible over varying imagery

## 9.3 Plate bbox

Recommended visual role:

- Canonical Amber Accent (`#FFB547`)
- Thin line in idle state
- More visible when selected

This aligns with the wider product language where amber is associated with scanning / plate emphasis.

## 9.4 Resize handles

Handles should only become clearly visible when an object is selected or hovered with editing intent.

Recommended form:

- Small circular or subtly rounded corner points
- Four primary corner handles
- Edge handles may be added if implementation remains visually clean

They must remain usable without appearing bulky.

## 9.5 Selected state

When selected:

- Selected bbox line becomes slightly stronger.
- Handles appear.
- Relevant object receives focus.
- Non-selected bbox opacity decreases.
- Inspector updates.

## 9.6 Hover state

When hovering over an editable bbox:

- Slight increase in line visibility
- Cursor communicates move/select intent
- No dramatic glow

---

# 10. Bounding box manipulation

## 10.1 Move behavior — Locked

Dragging inside a selected bounding box moves the entire box.

Movement should be direct and 1:1 with the pointer.

Do **not** apply easing while the user is dragging.

## 10.2 Resize behavior — Locked

Dragging a resize handle changes the corresponding bbox boundary.

During resize:

- Crop preview updates live.
- The pointer should remain visually connected to the handle.
- No delayed animation should be introduced.

## 10.3 Image boundaries

Bounding boxes should remain constrained to the actual image area.

The user should not be able to drag a bbox outside the image coordinate system.

## 10.4 Minimum dimensions

Both bbox types should have sensible minimum width/height constraints to prevent accidental collapse into an unusable line or point.

Exact thresholds can be implementation-level constants and may account for image scaling.

## 10.5 Vehicle / Plate relationship

The Plate bbox will normally exist within the Vehicle bbox, but the editor should avoid silently rewriting one box when the other is changed.

For initial implementation:

- Editing Vehicle should not automatically distort Plate.
- Editing Plate should not automatically resize Vehicle.

If future product logic requires relational validation, it should be introduced explicitly rather than hidden in drag behavior.

---

# 11. Live crop preview — Locked

One of the signature interactions of this page is **immediate crop feedback**.

There must be no separate `Apply Crop` button.

Workflow:

```text
User moves/resizes bbox
        ↓
Coordinates update
        ↓
Derived crop preview updates immediately
```

This applies to:

- Vehicle crop
- Plate crop

The user should be able to understand the effect of a geometric correction without leaving the current interaction.

The preview should update smoothly but must prioritize responsiveness over decorative animation.

---

# 12. Right Inspector — overall behavior

## 12.1 Purpose

The Inspector contains all controls that are **semantically related to the currently selected object**.

It should never show every editable field at the same time simply because those fields exist.

This keeps the interface calm and makes the user's current editing context obvious.

## 12.2 Inspector states

The Inspector has three primary states:

1. **Overview / Edit Summary**
2. **Plate selected**
3. **Vehicle selected**

Transitions between these states should use subtle 150–250 ms motion.

---

# 13. Inspector — Overview / Edit Summary

## 13.1 Purpose

The Overview state is used before an object is selected and optionally when the user deliberately returns to overview.

Recommended content:

- Vehicle summary
- Plate summary
- Number / presence of edits
- Guidance to select an area

Example:

```text
EDIT SUMMARY

Vehicle
Sedan

Plate
34 ABC 123

No corrections yet.

Select an area in the image to edit it.
```

If changes exist:

```text
2 corrections

• Plate region adjusted
• Plate text corrected
```

The Overview state must remain compact. It is not a dashboard.

---

# 14. Inspector — Plate selected

## 14.1 Locked content order

Recommended Plate Inspector hierarchy:

1. Object switcher / `Plate` heading
2. Plate crop preview
3. OCR / plate text editor
4. Edit status
5. Reset Plate

Example:

```text
PLATE

[ Vehicle ] [ Plate ]

Crop Preview
┌─────────────────────┐
│     34 ABC 123      │
└─────────────────────┘

Plate Text
[ 34ABC123          ]

Edited •

Reset Plate
```

## 14.2 Plate crop preview

The Plate preview is a highly important aid for OCR correction.

Requirements:

- Shows the crop generated from the current editable Plate bbox
- Updates continuously as the bbox changes
- Preserves image detail as much as practical
- Can expand slightly when OCR input receives focus

The preview is not decorative; it is the visual evidence the user uses to correct the text.

## 14.3 OCR editing — Locked

OCR result should be editable through a clear text input.

The user must be able to:

- Place caret
- Select characters
- Delete
- Replace
- Paste text
- Use standard keyboard shortcuts

The UI should not attempt to behave like a complex OCR-character annotation tool.

The input should remain visually close to the Plate crop so comparison is easy.

## 14.4 OCR input focus interaction

When the OCR field receives focus:

- Plate crop may expand slightly.
- Plate bbox remains clearly highlighted in the canvas.
- Other visual elements should remain quiet.

This makes character comparison easier without opening a separate modal.

## 14.5 Plate text normalization

The frontend may apply light input rules only if they are product requirements.

Avoid silently changing meaningful user input.

If uppercase normalization, whitespace removal, or character restrictions are required by the backend, the behavior should be explicit and consistent.

---

# 15. Inspector — Vehicle selected

## 15.1 Locked content order

Recommended Vehicle Inspector hierarchy:

1. Object switcher / `Vehicle` heading
2. Vehicle crop preview
3. Body Type selector
4. Edit status
5. Reset Vehicle

Example:

```text
VEHICLE

[ Vehicle ] [ Plate ]

Crop Preview
┌─────────────────────┐
│                     │
│       VEHICLE       │
│                     │
└─────────────────────┘

Body Type
[ visual silhouette selector ]

Reset Vehicle
```

---

# 16. Body Type visual silhouette selector — Locked

## 16.1 Core decision

Vehicle body type should **not** use a generic dropdown in the primary design.

Instead, the editor should present the supported vehicle classes as a consistent set of **custom vehicle silhouette cards**.

This is an important visual identity feature of the Edit Page.

Concept:

```text
BODY TYPE

┌────────────┐  ┌────────────┐  ┌────────────┐
│ silhouette │  │ silhouette │  │ silhouette │
│   Sedan    │  │    SUV     │  │ Hatchback  │
└────────────┘  └────────────┘  └────────────┘

┌────────────┐  ┌────────────┐  ┌────────────┐
│ silhouette │  │ silhouette │  │ silhouette │
│   Pickup   │  │  Minivan   │  │    ...     │
└────────────┘  └────────────┘  └────────────┘
```

The final selector must render **all body classes actually supported by the backend**, rather than hard-coding only the example classes shown in this document.

## 16.2 Silhouette art direction

All vehicle silhouettes must be designed as one coherent icon family.

They should share:

- Same view angle
- Same visual scale
- Same line/fill treatment
- Same stroke weight
- Same baseline
- Same bounding dimensions
- Similar optical density

Do not mix icons from unrelated icon libraries.

Do not use photorealistic thumbnails for this selector.

Preferred direction:

- Custom SVG silhouettes
- Side or clean three-quarter silhouette
- Minimal technical appearance
- Recognizable body proportions

## 16.3 Selected state

Selected body type should be clear through restrained emphasis:

- Amber outline or accent
- Small check indicator
- Slight surface lift

Avoid turning the selector into a colorful icon grid.

## 16.4 Changed state

If the user changes the body type from the original model prediction, the Vehicle object becomes marked as edited.

---

# 17. Focus and source-context behavior

## 17.1 Locked interaction

When an object is selected, the canvas should visually help the user understand the relationship between the object and the source image.

### Plate selected

- Plate bbox becomes primary.
- Vehicle bbox becomes lower opacity.
- Optional subtle dimming reduces unrelated image emphasis.
- Plate crop preview is visually tied to the selected region.

### Vehicle selected

- Vehicle bbox becomes primary.
- Plate bbox remains visible but subdued.
- Vehicle crop preview is tied to the selected region.

This continues the product-wide philosophy established on the Results Page: **results should be traceable back to their source pixels**.

---

# 18. Model result vs Edited result comparison — Locked

## 18.1 Purpose

The user must be able to answer:

> “What exactly did I change compared with the model?”

The editor therefore needs a before/after comparison between:

- Original model state
- Current edited state

## 18.2 Preferred interaction — Hold to compare

Preferred desktop interaction:

`Hold to view model result`

While pressed:

- Bounding boxes temporarily move back to original model coordinates.
- OCR temporarily shows original model text.
- Body type temporarily shows original model class.

When released:

- Current edited state immediately returns.

This interaction should feel instant and should not modify history.

## 18.3 Accessibility / touch fallback

A hold interaction cannot be the only way to compare.

Provide a toggle or explicit control such as:

```text
Model Result  ⇄  Edited Result
```

for:

- Touch devices
- Keyboard users
- Accessibility needs

## 18.4 Comparison must be non-destructive

Viewing the original result must never:

- Write values into the editor state
- Add Undo history entries
- Reset corrections
- Mark the document as changed

It is purely a visual comparison mode.

---

# 19. Edited-state indicators

## 19.1 Purpose

The user should be able to see which parts of the model output they have changed without introducing large badges everywhere.

Preferred pattern:

- Small amber dot
- Small `Edited` label where useful

Examples:

```text
Vehicle  •
Plate    •
```

or within Inspector:

```text
Plate Text                         Edited
```

## 19.2 Object-level edited state

An object is considered edited when any associated value differs from the original model state.

### Plate edited if:

- Plate bbox changed, and/or
- OCR changed

### Vehicle edited if:

- Vehicle bbox changed, and/or
- Body type changed

If the user changes a value and then restores it exactly to the original model value, the edited indicator should disappear.

---

# 20. Change history — Undo / Redo model

## 20.1 History behavior

The editor should maintain a client-side action history for meaningful changes.

Do not create hundreds of history entries for every pixel of a drag.

Recommended behavior:

- Drag start → capture previous state
- Drag interaction → live updates
- Drag end → commit one history entry

Similarly, OCR typing should use sensible grouping/debouncing rather than storing every keystroke as a separate impossible-to-use history item.

## 20.2 History scope

At minimum, history should cover:

- Vehicle bbox
- Plate bbox
- OCR text
- Body type
- Object reset
- Reset All

## 20.3 New save baseline

After a successful save, the product must decide whether saved corrections become the new local baseline for unsaved-state detection.

Recommended behavior:

- Successful save clears the `unsaved` flag.
- User may continue editing after save.
- New changes after that save create a new unsaved state.

The original **model prediction** must still remain separately available for Model vs Edited comparison.

---

# 21. Reset behavior — Locked

## 21.1 Object-level reset

When Plate is selected:

- `Reset Plate` restores original model Plate bbox and OCR value.

When Vehicle is selected:

- `Reset Vehicle` restores original model Vehicle bbox and body type.

Object reset should be undoable.

## 21.2 Reset All

A global `Reset All` may be placed in a secondary menu or low-emphasis toolbar action.

It restores all editable values to the original model prediction.

Because Reset All can discard multiple minutes of correction work, it should request confirmation when meaningful changes exist.

Suggested dialog:

```text
Reset all corrections?

This will restore the original model result.

[ Cancel ]   [ Reset All ]
```

Reset All should also be undoable after confirmation if technically practical.

---

# 22. Canvas controls

## 22.1 Required controls — Locked

The canvas should support:

- Zoom out
- Zoom percentage
- Zoom in
- Fit
- Pan

Example compact toolbar:

```text
−   100%   +   Fit
```

## 22.2 Zoom behavior

Recommended interactions:

- Mouse wheel / trackpad gesture → zoom
- `+` / `−` controls → stepped zoom
- Fit → returns entire image to visible canvas bounds

Zoom should preferably center around pointer location when using wheel/trackpad behavior.

## 22.3 Pan behavior

Recommended:

- Space + drag → pan
- Middle mouse drag may optionally pan
- Touch drag behavior should be designed carefully to avoid conflicting with bbox movement

## 22.4 Fit

`Fit` returns the canvas to a clean full-image view.

This is the primary escape hatch after close-up bbox editing.

---

# 23. Optional precision enhancements

The following ideas are approved as **future-friendly enhancements**, but they are not required for the initial release unless implementation cost is low.

## 23.1 Double-click focus

Double-clicking the Plate bbox may zoom the canvas automatically to the plate region.

`Esc` or `Fit` returns to the full image.

## 23.2 Focus Plate control

A `Focus Plate` action in the Plate Inspector may zoom the canvas to the plate while preserving Inspector context.

## 23.3 Magnifier during bbox resize

When resizing a small Plate bbox, a small magnified region near the pointer may help the user align plate edges accurately.

If implemented:

- It should appear only during resize.
- It should not obstruct the edge being adjusted.
- It should remain visually minimal.

These features must not delay the core editor release.

---

# 24. Save Corrections and feedback behavior

## 24.1 Locked product behavior

Saving corrections has two meanings:

1. Save the corrected result for the user's analysis.
2. Create a feedback record comparing model output to user-corrected output.

The frontend should treat this as one coherent action.

## 24.2 Save payload concept

The implementation should preserve both original and corrected values.

Conceptually:

```json
{
  "original": {
    "vehicle_bbox": ["..."],
    "plate_bbox": ["..."],
    "plate_text": "MODEL_VALUE",
    "body_type": "MODEL_VALUE"
  },
  "corrected": {
    "vehicle_bbox": ["..."],
    "plate_bbox": ["..."],
    "plate_text": "USER_VALUE",
    "body_type": "USER_VALUE"
  },
  "changes": {
    "vehicle_bbox": false,
    "plate_bbox": true,
    "plate_text": true,
    "body_type": false
  }
}
```

The exact API contract is a backend decision; this structure illustrates the required semantic relationship.

## 24.3 Save confirmation

After a successful save:

```text
✓ Corrections saved
Thanks for improving the result.
```

Alternative smaller status:

```text
Feedback added
```

The UI should avoid exaggerated celebration. This is a professional workflow.

## 24.4 Stay on page after save — Locked

Do **not** automatically redirect the user away from the editor after saving.

After save:

- User remains on Edit Results Page.
- Saved status becomes visible.
- User may inspect the final state.
- User may continue editing.
- User may choose `Back to Results` manually.

## 24.5 Returning to Results

After corrections have been saved, the Results Page should use the latest saved/corrected values for its user-facing result display.

The original model prediction remains available internally and for comparison/history purposes.

---

# 25. Save summary / Correction Map

## 25.1 Approved interaction

Before saving, the product may show a compact summary of what changed.

Example:

```text
Save corrections

2 changes

• Plate region adjusted
• OCR corrected

[ Cancel ]   [ Save ]
```

This is especially useful when multiple fields have been modified.

The summary should describe meaningful changes rather than exposing coordinates.

Recommended labels:

- `Vehicle region adjusted`
- `Plate region adjusted`
- `OCR corrected`
- `Body type changed`

## 25.2 When to show

Two acceptable implementations:

**Option A — direct save**

Save immediately and show a small success confirmation.

**Option B — save summary popover/dialog**

Show the change summary first, then save.

For the premium experience, Option B is recommended when there is more than one meaningful correction; it gives the user confidence about what they are submitting.

---

# 26. Unsaved changes protection — Locked

If the user has unsaved edits and attempts to leave the page through `Back to Results`, browser navigation, or another in-product route, the app should protect the work where technically possible.

Suggested dialog:

```text
You have unsaved changes.

Your corrections will be lost if you leave now.

[ Keep Editing ]   [ Discard Changes ]
```

Do not show this dialog when:

- Nothing has changed
- All current changes have been successfully saved

The dialog is justified here because the user has performed explicit manual work.

---

# 27. Loading and initialization states

## 27.1 Editor loading

When opening Edit Results from the Results Page, the editor may need to load:

- Original image
- Existing model result
- Latest saved corrections if present
- Derived crop previews

Use a restrained skeleton / loading state.

Do not replay the Analysis Page extraction animation.

The Edit Page should enter a ready workspace rather than another showpiece sequence.

## 27.2 Existing corrections

If the user previously saved corrections and reopens Edit Results:

- Load the latest corrected state.
- Preserve original model state for comparison.
- Edited indicators should reflect the difference between model and latest corrected state.
- Do not mark the page as `unsaved` immediately after loading a saved correction.

---

# 28. Save errors and recovery

## 28.1 Failed save

If Save fails:

- Keep all local corrections intact.
- Keep the user in the editor.
- Clearly indicate failure.
- Allow retry.

Suggested copy:

```text
Couldn't save corrections.
Your edits are still here.

[ Try Again ]
```

Never reset the editor because a network/API call failed.

## 28.2 Stale / expired analysis

If the backend no longer has the associated analysis or image:

- Explain that the result can no longer be edited.
- Do not show a broken editor.
- Offer return to the Results/Home flow where appropriate.

Exact copy can be finalized with backend retention behavior.

---

# 29. Keyboard behavior

## 29.1 Recommended shortcuts

- **Undo:** `Ctrl/Cmd + Z`
- **Redo:** `Ctrl/Cmd + Shift + Z`
- **Save:** `Ctrl/Cmd + S`
- **Fit image:** optional `0` or dedicated UI control
- **Cancel focused interaction:** `Esc`

## 29.2 Text-field priority

When OCR input is focused, normal text-editing behavior takes priority.

Global shortcuts must not interfere with expected text editing.

For example, `Ctrl/Cmd + Z` inside OCR input may still route through the application history if implemented carefully, but the behavior must feel predictable.

---

# 30. Pointer and cursor behavior

Use cursor changes to make editing discoverable:

- Bbox interior → move cursor when draggable
- Corner handle → appropriate resize cursor
- Inspector cards → pointer where clickable
- Canvas background during pan mode → grab/grabbing

Cursor behavior should reflect the action available at the exact location.

---

# 31. Motion system

## 31.1 Locked philosophy

The Edit Page is not another animation showcase.

Use motion for:

- Inspector state transition
- Object selection emphasis
- Crop preview resizing
- Compare transition
- Success/error feedback

Do not use motion for:

- Continuous bbox effects
- Looping scanner effects
- Decorative particles
- Automatic camera movement while the user is manipulating a bbox

## 31.2 Suggested timings

- Inspector state change: ~180–240 ms
- Button/surface hover: ~120–180 ms
- Crop preview expansion: ~180–220 ms
- Compare state: immediate to ~150 ms
- Success acknowledgement: subtle ~200 ms entry

## 31.3 Dragging exception

While the user moves or resizes a bbox:

> **No easing. No delayed interpolation.**

The box must follow the pointer directly.

---

# 32. Visual design system

The Edit Page uses the canonical dark theme defined for the overall product.

## 32.1 Core palette

- **Deep Background:** `#0B0D0F`
- **Primary Surface:** `#111417`
- **Elevated Surface:** `#171B1F`
- **Border / Divider:** `#2A3036`
- **Primary Text:** `#F3F4F1`
- **Secondary Text:** `#969CA3`
- **Amber Accent:** `#FFB547`
- **Success:** `#6ED6A0`

## 32.2 Usage rules

- Amber is an emphasis color, not a page-fill color.
- Use amber primarily for Plate selection, editable focus, and meaningful accents.
- Vehicle bbox should remain neutral to preserve visual hierarchy.
- Success green should appear only for completed/saved states.
- Most surfaces should be separated by spacing and subtle borders rather than large contrast shifts.

## 32.3 Typography

Maintain the typography direction established across the product:

- Clean grotesk/sans for UI and headings
- Optional monospace only for small technical micro-labels where useful

The editor should not overuse monospace simply because it is a technical product.

---

# 33. Right Inspector visual treatment

The Inspector should feel integrated with the canvas rather than like a separate admin panel.

Recommended characteristics:

- Moderate fixed/max width on desktop
- Subtle left divider
- Same dark surface family as page
- Generous spacing
- Clear section grouping
- Very limited nested card use

Avoid stacking every field inside a bordered card.

Prefer:

```text
PLATE

Crop Preview
[ image ]

Plate Text
[ input ]

Reset Plate
```

rather than:

```text
[ CARD ]
[ CARD ]
[ CARD ]
```

---

# 34. Responsive behavior

## 34.1 Desktop — primary experience

Desktop is the reference experience.

Recommended structure:

- Large canvas left/center
- Inspector right
- Toolbar top
- Canvas controls bottom or floating near canvas edge

The canvas should receive the majority of horizontal space.

## 34.2 Tablet

Possible layout:

- Canvas remains top/primary
- Inspector becomes narrower or moves below canvas
- Object switcher remains easily accessible
- Touch handle hit areas increase without making visible handles visually huge

## 34.3 Mobile

The mobile editor should prioritize usability over preserving desktop layout.

Recommended structure:

```text
Top Toolbar

Image Canvas

Object Switcher

Context Inspector / Bottom Sheet
```

The Inspector can become:

- Expandable bottom sheet, or
- Full-width section below canvas

The page must not shrink the desktop Inspector into an unusably narrow column.

## 34.4 Touch bbox editing

Touch devices require larger invisible hit targets around handles.

Visible handles can remain small while interaction hitboxes are larger.

Support:

- One-finger bbox move when object selected
- Drag handles for resize
- Pinch zoom if it does not conflict with bbox interaction
- Clear pan mode / gesture behavior

---

# 35. Accessibility requirements

## 35.1 Object selection

Vehicle and Plate must be selectable without relying only on precise pointer interaction.

The Inspector object switcher provides a keyboard/touch-accessible alternative.

## 35.2 Color independence

Do not use amber vs grey as the only indication of selection.

Selected states should also use:

- Handle visibility
- Line weight/opacity difference
- Labels or focus state

## 35.3 Keyboard access

Interactive controls must be keyboard reachable.

OCR input must have a visible focus state.

## 35.4 Compare control

`Hold to compare` must have a non-hold alternative.

## 35.5 Motion preferences

Respect `prefers-reduced-motion`:

- Reduce Inspector animation
- Remove nonessential transitions
- Keep bbox direct manipulation unchanged

---

# 36. Data and state model

The frontend should conceptually maintain three distinct states:

## 36.1 Model baseline

Immutable during the editing session:

- Original vehicle bbox
- Original plate bbox
- Original OCR
- Original body type

Used for:

- Compare
- Reset
- Feedback difference calculation

## 36.2 Current editor state

Mutable:

- Current vehicle bbox
- Current plate bbox
- Current OCR
- Current body type

## 36.3 Last saved state

Used for:

- Unsaved changes calculation
- Saved status
- Re-entry behavior

This distinction prevents ambiguity between:

- “Original model result”
- “What the user currently has on screen”
- “What has actually been saved”

---

# 37. Dirty-state calculation

`hasUnsavedChanges` should compare **current editor state** against **last saved state**, not necessarily against the original model state.

Example:

1. Model OCR = `34ABC128`
2. User changes → `34ABC123`
3. User saves
4. Current result remains different from model
5. But page is **not unsaved**
6. User changes → `34ABC124`
7. Page becomes unsaved again

The edited indicator may still remain visible because the result differs from the original model.

This is a critical distinction.

---

# 38. Feedback semantics

When Save Corrections succeeds, the backend should be able to determine:

- Which fields differ from model output
- Which fields were untouched
- Current corrected values
- Original prediction values

The UI should not force users to separately submit a thumbs-up/down feedback form after they have already made a correction.

The correction itself **is the feedback**.

A later optional qualitative feedback mechanism can exist independently, but it is not part of this core page specification.

---

# 39. Page microcopy direction

The product UI is currently English.

Recommended language should be concise and functional.

### Toolbar

- `Back to Results`
- `Edit Results`
- `Undo`
- `Redo`
- `Save Corrections`

### Inspector

- `Edit Summary`
- `Vehicle`
- `Plate`
- `Crop Preview`
- `Plate Text`
- `Body Type`
- `Reset Plate`
- `Reset Vehicle`

### Compare

- `Hold to view model result`
- `Model Result`
- `Edited Result`

### Save

- `Corrections saved`
- `Feedback added`

### Guidance

- `Select an area in the image to edit it.`

Avoid marketing copy inside the editor.

---

# 40. What must NOT be added

Unless the product scope changes explicitly, do not add:

- Full Photoshop-style Layers sidebar
- Freehand drawing
- Polygon annotation
- Arbitrary text boxes
- Filters
- Brightness/contrast tools
- Image rotation as a creative editing feature
- Color correction
- Generic crop tool unrelated to model bboxes
- Multiple overlapping inspector panels
- Timeline/history panel
- Model confidence dashboards
- Raw bbox coordinates in normal UI
- Model names or inference timing in the normal editor
- Decorative scanner loops
- Excessive sci-fi/HUD styling

These features would increase complexity without supporting the core correction workflow.

---

# 41. Performance and responsiveness principles

The overall product allows premium-paced transitions, but **direct editing must be instant**.

Critical interactions that should feel immediate:

- Bbox drag
- Bbox resize
- Crop preview update
- OCR typing
- Body-type selection
- Undo / Redo

Potentially asynchronous operations:

- Saving corrections
- Loading high-resolution image assets
- Server-side feedback submission

Local editor state should not wait for a server round-trip after every drag.

---

# 42. Image resolution and coordinate mapping

The implementation must keep a reliable mapping between:

- Natural image dimensions
- Displayed canvas dimensions
- Zoom/pan transformation
- Stored bbox coordinates

Bounding box metadata should be stored in a coordinate system independent from the current CSS display size.

Recommended options include:

- Natural-image pixel coordinates, or
- Normalized `[0..1]` coordinates

The frontend implementation must avoid accumulating rounding errors when the user zooms, pans, and edits repeatedly.

The exact storage convention should be agreed with the backend API and used consistently.

---

# 43. Crop generation behavior

Crop previews should always derive from:

- Original full-resolution image where practical
- Current bbox coordinates

Do not repeatedly crop an already cropped preview because this can degrade quality and introduce coordinate drift.

The displayed crop may be downscaled for UI performance, but the logical crop definition must remain based on the original image.

---

# 44. Error prevention

The editor should prevent clearly invalid states when possible without becoming obstructive.

Examples:

- Bbox cannot collapse to zero area
- Bbox cannot leave image bounds
- OCR field should respect maximum practical length if backend requires one
- Body type must always resolve to one backend-supported class

Avoid constant modal warnings during normal manipulation.

Prefer direct constraints and inline validation.

---

# 45. Interaction sequence — typical Plate correction

Example user journey:

1. User arrives from Results Page.
2. Editor shows full image and calm bounding boxes.
3. Overview Inspector says `Select an area in the image to edit it.`
4. User clicks Plate bbox.
5. Plate bbox becomes active; Vehicle bbox fades slightly.
6. Inspector shows Plate crop and OCR.
7. User drags Plate bbox edge to correct crop.
8. Plate crop preview updates live.
9. User focuses OCR field.
10. Crop preview gains slight emphasis.
11. User changes `34ABC128` → `34ABC123`.
12. Plate receives small edited indicator.
13. User holds `View model result` to compare.
14. User releases compare and sees corrected state again.
15. User clicks `Save Corrections`.
16. Save summary shows Plate region + OCR changed.
17. Save succeeds.
18. UI displays `Corrections saved`.
19. User remains in the editor.
20. User chooses `Back to Results` when finished.
21. Results Page displays corrected values.

---

# 46. Interaction sequence — typical Vehicle correction

1. User selects Vehicle bbox.
2. Inspector switches to Vehicle state.
3. Vehicle crop preview appears.
4. User corrects Vehicle bbox if necessary.
5. Crop updates live.
6. User selects a body type using silhouette cards.
7. Selected silhouette receives amber emphasis/check.
8. Vehicle receives edited indicator.
9. User compares against model result if desired.
10. User saves corrections.

---

# 47. Acceptance criteria — page structure

The page is considered structurally correct when:

- [ ] There is no permanent left Layers sidebar.
- [ ] Original image is the dominant workspace element.
- [ ] Vehicle and Plate bboxes are visible on load.
- [ ] Top Toolbar contains global actions.
- [ ] Right Inspector is context-sensitive.
- [ ] Canvas controls are compact and separate from global actions.
- [ ] User can return to Results Page.

---

# 48. Acceptance criteria — editing

- [ ] Vehicle bbox can be selected, moved, and resized.
- [ ] Plate bbox can be selected, moved, and resized.
- [ ] Bounding boxes remain inside image bounds.
- [ ] Crop previews update live.
- [ ] OCR can be edited.
- [ ] Body type can be changed through visual silhouette cards.
- [ ] Vehicle / Plate can be selected from canvas.
- [ ] Vehicle / Plate can also be selected through an accessible compact switcher.
- [ ] Selection focus visually suppresses the non-selected object without hiding it completely.

---

# 49. Acceptance criteria — state management

- [ ] Original model state is preserved separately.
- [ ] Current editor state is separate from model state.
- [ ] Last saved state is tracked.
- [ ] Edited indicators compare against original model result.
- [ ] Unsaved-state detection compares against last saved state.
- [ ] Undo / Redo works across bbox and semantic edits.
- [ ] Object resets work.
- [ ] Reset All is protected.
- [ ] Save failure does not destroy local edits.

---

# 50. Acceptance criteria — compare and feedback

- [ ] User can view original model result without destroying edits.
- [ ] Hold-to-compare exists on suitable pointer devices or an equivalent premium interaction is provided.
- [ ] A toggle/accessibility fallback exists.
- [ ] Save preserves original + corrected values semantically.
- [ ] Save creates the correction/feedback record.
- [ ] User remains on the editor after successful save.
- [ ] Results Page can display latest corrected values after return.

---

# 51. Acceptance criteria — body type silhouettes

- [ ] Selector uses one coherent custom silhouette family.
- [ ] All backend-supported classes are represented.
- [ ] Icons use consistent perspective, scale, stroke/fill, and baseline.
- [ ] Selected class is visually clear without relying only on color.
- [ ] Selector remains usable on smaller screens.

---

# 52. Acceptance criteria — responsive and accessibility

- [ ] Desktop keeps Canvas + Right Inspector structure.
- [ ] Mobile does not compress the Inspector into an unusable side column.
- [ ] Touch handles use adequate hit areas.
- [ ] Keyboard users can reach Inspector controls and object switcher.
- [ ] Compare has a non-hold fallback.
- [ ] Reduced-motion preference is respected.
- [ ] Selection is not communicated by color alone.

---

# 53. QA scenarios

The implementation should be explicitly tested against the following scenarios.

## Scenario A — no corrections

- Open editor
- Select Plate
- Select Vehicle
- Make no changes
- Back to Results

Expected: no unsaved warning.

## Scenario B — Plate bbox only

- Resize Plate bbox
- Do not change OCR
- Save

Expected: Plate region marked changed; OCR not marked changed.

## Scenario C — OCR only

- Change OCR
- Save

Expected: bbox stays original; OCR feedback captured.

## Scenario D — change and revert

- Change OCR
- Manually restore exact original value

Expected: edited indicator disappears if all Plate values match original.

## Scenario E — save then edit again

- Make correction
- Save
- Make another correction
- Leave page

Expected: unsaved warning appears only for changes after last successful save.

## Scenario F — compare after save

- Save corrected state
- Hold Model Result

Expected: original model prediction still appears; releasing returns to saved corrected state.

## Scenario G — save failure

- Make corrections
- Simulate API failure

Expected: edits remain intact and retry is possible.

## Scenario H — high zoom

- Zoom into Plate
- Move bbox
- Fit image

Expected: coordinates remain accurate and crop remains correct.

## Scenario I — mobile/touch

- Select Plate using object switcher
- Resize with touch handle
- Edit OCR
- Compare using toggle

Expected: no pointer-only dependency.

---

# 54. Implementation priority

## Phase 1 — Core editor

Must ship:

- Canvas
- Vehicle bbox edit
- Plate bbox edit
- Live crops
- OCR edit
- Body-type silhouette selector
- Context Inspector
- Object switcher
- Undo / Redo
- Zoom / Pan / Fit
- Edited indicators
- Reset Plate / Vehicle
- Save Corrections
- Unsaved changes protection
- Model vs Edited comparison

## Phase 2 — Precision polish

May follow after core experience is stable:

- Magnifier during Plate resize
- Double-click/focus Plate zoom
- Advanced keyboard shortcuts
- Additional micro-interactions
- Further mobile gesture refinement

Phase 2 must not delay the primary correction workflow.

---

# 55. Final design summary

The Edit Results Page should feel like a **purpose-built correction instrument**.

Its visual hierarchy is intentionally simple:

```text
GLOBAL ACTIONS
      ↓
ORIGINAL IMAGE + DIRECT MANIPULATION
      ↔
CONTEXT-SENSITIVE INSPECTOR
      ↓
COMPARE / SAVE / RETURN
```

The page does not need a large Layers panel because the editable object model is intentionally small. Instead:

> **Canvas is the navigation.**

The user selects Vehicle or Plate directly in the image, makes a precise geometric correction, sees derived crops update instantly, adjusts OCR or body type through purpose-built controls, compares the result with the model prediction, and saves the correction as both a better result and useful feedback.

The experience should be powerful enough to feel like a real professional tool while remaining narrow enough that a first-time user understands it immediately.

> **Final product character:** precise, calm, premium, transparent, and human-in-the-loop.

# Home Page Design Specification

**Project role:** Primary product landing and first-use experience  
**Document status:** Source of truth for the Home Page  
**Product language:** English  
**Initial theme:** Dark  
**Design direction:** Automotive × Technical × Editorial

---

## 1. Purpose of this document

This document defines the agreed product, interaction, visual, animation, content, and implementation direction for the website Home Page. It is intended to be the primary reference for design and frontend implementation. Decisions marked as **Locked** should not be changed casually during implementation; any deviation should be treated as an explicit product/design change.

The Home Page is not intended to behave like a long corporate landing page. It should feel like a compact **interactive vehicle-analysis experience** that explains the product by letting the visitor see and manipulate the concepts behind it.

The page should avoid generic AI landing-page patterns such as excessive purple/blue gradients, decorative glowing orbs, endless feature-card grids, long corporate storytelling, and heavy scroll-jacking.

---

## 2. Product context

The product accepts a vehicle image and analyzes it to produce four core outputs:

1. Vehicle crop
2. Plate crop
3. OCR / license plate text
4. Vehicle body type

After analysis, users can inspect the outputs and later correct inaccurate results on a dedicated editing page. User feedback is therefore not a secondary survey mechanism; it is part of the product loop.

The Home Page must communicate this workflow visually without overwhelming users with model names, confidence percentages, infrastructure details, or long technical explanations.

---

## 3. Core Home Page philosophy

### Locked principles

- The page should be short and intentional rather than artificially long.
- The visitor should understand the product by **experiencing it**, not by reading multiple marketing paragraphs.
- Every major visual element must explain a real part of the product.
- The 3D vehicle is functional storytelling, not decoration.
- Animations should create a premium first impression, then become calm.
- Normal page scrolling must remain native and smooth.
- Do not use sticky scroll narratives, scroll-jacking, or large animation timelines that require the user to scroll through multiple frames.
- The interface should feel technical and premium without becoming a developer dashboard or a sci-fi HUD.
- The product should not resemble a car configurator or dealership website.

---

## 4. Final page architecture

The agreed Home Page structure is:

1. **Vehicle Scanner Hero + primary upload entry point**
2. **See What the Model Sees**
3. **Human in the Loop**
4. **Small final CTA that returns the user to the Hero upload area**
5. **Footer**

No additional large marketing sections are required for the initial version.

---

# 5. Section 01 — Vehicle Scanner Hero

## 5.1 Purpose

The Hero is the primary visual identity of the website and the main entry point into the analysis flow. It must answer three questions immediately:

- What does this product analyze?
- What kinds of information does it extract?
- How do I try it with my own image?

The Hero should create the first “wow” moment of the product.

## 5.2 3D vehicle direction — Locked

The Hero will use a **3D vehicle**, not a flat 2D vehicle image.

Recommended visual character:

- User-provided black BMW M5 sedan; manufacturer badges and distinctive styling are intentionally visible
- Matte graphite or dark neutral material
- Dark studio environment
- Soft controlled key light
- Subtle ground reflection if performance allows
- No configurator-like controls for paint, wheels, doors, etc.

The 3D vehicle exists to visualize analysis. It must not imply that the site is selling or configuring cars.

The first production asset intentionally has no plate mesh. Until a plate is added, the Hero omits plate and OCR scan indications; the 2D Model View and Human-in-the-Loop sections continue to demonstrate plate analysis.

## 5.3 Initial scanner sequence — Locked

When the page first loads, a scanner animation runs **once**. It should not loop continuously.

Suggested visual sequence:

1. Vehicle is already present in the dark studio scene.
2. Scanner line or scanning plane passes across the vehicle.
3. Vehicle detection indication appears.
4. Body-type result appears.
5. The scanner finishes.
6. The Hero transitions into a calm interactive state.

The goal is to demonstrate the analysis concept without creating constant motion.

### After the sequence

After the first run:

- Scanner stops.
- Labels settle into a low-visual-noise state.
- Vehicle can react subtly to pointer position.
- Minor hover interactions may remain available.
- No looping scan animation.
- No repeated attention-seeking pulses.

This “show first, calm later” behavior is a core visual principle used across the site.

## 5.4 Hero interaction

The 3D vehicle may respond subtly to mouse movement:

- Slight yaw/rotation toward pointer position
- Very small parallax response
- Optional gentle camera emphasis when hovering relevant regions

The movement must remain restrained. The user should never feel that they are controlling a 3D configurator.

Potential interactive labels:

- Vehicle / body area → body classification concept
- Plate area → plate detection / OCR concept

These labels should be small, technical, and editorial rather than large floating cards.

## 5.5 Primary Hero copy

The site language is currently **English**.

Preferred headline direction:

> **See what the model sees.**

Supporting copy should be one short sentence, for example:

> Upload a vehicle image and turn it into structured data.

The final copy can be tuned later, but the Home Page should avoid overly promotional language such as “revolutionary”, “next-generation”, or generic “AI-powered” slogans.

## 5.6 Primary upload interaction — Locked

The primary upload entry point lives in the Hero.

Do **not** place a giant traditional dashed upload box in the middle of the Hero, because it would compete with the 3D scene.

Preferred pattern:

- Primary CTA button: `Analyze a vehicle` or `Upload an image`
- File picker opens on click.
- Entire Hero area can optionally accept drag-and-drop.

When the user drags a valid file over the page/Hero:

- Scene darkens slightly.
- A clear `DROP TO ANALYZE` state appears.
- 3D vehicle remains part of the composition rather than disappearing behind a generic upload modal.

Suggested helper text near the CTA:

- `JPG · PNG · WEBP`
- File-size limit when finalized
- Short privacy note when the backend retention policy is finalized

## 5.7 Transition from Home to real analysis

Once a user selects an image:

- Do not force them to replay a marketing journey.
- The upload action begins the real analysis flow.
- A short transition can visually replace the demo state with the user's image or move directly into the Analysis Page experience.
- The dedicated Analysis Page owns the detailed extraction sequence.

The Hero is the first-use entry point, not the workspace for repeated analyses.

---

# 6. Section 02 — See What the Model Sees

## 6.1 Status — Locked

This section is a required Home Page section.

## 6.2 Purpose

The user should instantly understand the difference between a normal image and the structured interpretation produced by the model.

The conceptual message is:

> **You see a car. The model sees data.**

This section should create a remove.bg-like comparison interaction, adapted to computer vision rather than background removal.

## 6.3 Image source — Locked

Use a **real vehicle photograph**, not the Hero 3D vehicle.

Reason:

- It grounds the product in real-world input.
- It demonstrates that the system works on photographs, not only stylized renders.
- It creates visual contrast with the 3D Hero.

## 6.4 Main interaction — Locked

Use a draggable before/after-style divider:

- One side = normal vehicle photograph
- Other side = “Model View”

The divider should be directly draggable horizontally.

### Normal side

Show the photograph with no model overlays.

### Model View side

Show relevant analysis overlays, primarily:

- Vehicle bounding box
- Plate bounding box
- OCR label/result
- Body-type label

The overlays should remain clean and premium. Avoid dense coordinate text, debug output, FPS counters, or military-HUD styling.

## 6.5 Visual treatment

Recommended:

- Vehicle bbox: thin soft neutral/silver line
- Plate bbox: Amber Accent
- Labels: compact uppercase or mono-style supporting labels
- Low-opacity technical lines only where useful

The interaction should be immediately understandable without instructional paragraphs.

## 6.6 Content hierarchy

Suggested section copy:

**Headline:**
> You see a car. The model sees data.

Optional one-line support:
> Drag to reveal the detections behind the image.

Keep copy minimal; the slider itself should tell the story.

---

# 7. Section 03 — Human in the Loop

## 7.1 Status — Locked

This section is required and combines the previously discussed “user correction” and “intentionally imperfect prediction” concepts.

## 7.2 Purpose

This section communicates two product values simultaneously:

1. Users remain in control when the model is imperfect.
2. User corrections can contribute useful feedback to the system.

It should make the visitor feel that they can **do something**, not merely watch a product demo.

## 7.3 Scope — Locked

Because this is a Home Page demo, only two editing interactions are included:

- **Plate bounding-box correction**
- **OCR text correction**

Do not include body-type editing or vehicle-box editing in the Home Page demo. Those belong to the dedicated Edit Results page.

## 7.4 Intentionally imperfect demo — Locked

The section should begin with a deliberately imperfect but believable result.

Example:

- Plate bounding box is slightly misaligned.
- OCR reads `34 ABC 128` when the image actually shows `34 ABC 123`.

The error should look realistic. It should not be absurd or obviously fabricated.

## 7.5 User interaction

### Bounding box

- Show plate bbox with draggable corner/edge handles.
- User adjusts it slightly.
- Plate crop preview updates if used in the mini demo.

### OCR

- OCR result is editable.
- User changes the incorrect character(s).

After a valid correction, show a restrained success state such as:

- `Correction saved`
- `+1 feedback`
- `Feedback added`

Avoid gamifying this heavily.

## 7.6 Messaging

Possible headline direction:

> **AI got it almost right.**

Supporting line:

> Fix the result. Improve the model.

Alternative tone:

> Models are not always right. That's why you're in control.

Copy should be concise and honest rather than defensive.

## 7.7 Visual behavior

This section should feel like a tiny functional editor, not a screenshot of an editor.

Important:

- Interactions must genuinely work in the demo.
- Handles should be obvious enough to discover, but visually restrained.
- The section should not expose the full complexity of the real editing page.

---

# 8. Final CTA

## 8.1 Status — Locked

The Home Page should **not** repeat a second large upload area at the bottom.

Instead, use a small final CTA.

Suggested copy:

> Ready to try your own vehicle?

Button options:

- `Try your own vehicle ↑`
- `Analyze a vehicle ↑`
- `Upload your image ↑`

## 8.2 Behavior — Locked

On click:

1. Smooth-scroll the user back to the Hero upload area.
2. Briefly highlight/focus the primary upload CTA so the destination is obvious.

Recommended highlight duration: roughly 400–600 ms, subtle border/glow/focus treatment.

Do not open a duplicate uploader at the bottom.

---

# 9. Footer

Footer should remain compact.

Possible items:

- Product/project name
- Privacy / image retention link when available
- Terms if required
- Optional GitHub/project link if the project will expose one

Do not turn the footer into another marketing section.

---

# 10. Visual system

## 10.1 Theme — Locked

Initial release: **Dark theme only**.

Light theme can be considered later. The implementation should avoid unnecessary hard-coding that would make a future light theme impossible, but the first release does not need a theme switcher.

## 10.2 Palette

Canonical palette reference: `vehicle_analysis_color_palette.png`

Core colors:

- Deep Background — `#0B0D0F`
- Primary Surface — `#111417`
- Elevated Surface — `#171B1F`
- Border / Divider — `#2A3036`
- Primary Text — `#F3F4F1`
- Secondary Text — `#969CA3`
- Amber Accent — `#FFB547`
- Success — `#6ED6A0`

### Role rules

- Amber is the primary emphasis color.
- Amber should be used for scanner elements, plate bbox, active interaction, and limited CTA emphasis.
- Vehicle bbox should generally use a soft neutral/silver tone rather than competing with the plate bbox.
- Success green is reserved for completion/saved feedback.
- Do not introduce purple/blue AI gradients as a competing brand language.

## 10.3 Typography

Preferred direction:

- Main UI/headlines: Geist, Manrope, or similarly modern grotesk sans-serif
- Supporting UI: Geist / Inter-like sans-serif
- Technical labels/values: Geist Mono or IBM Plex Mono-style font

Monospace should be used sparingly for technical micro-labels, OCR values, and detection tags. Do not set entire paragraphs in monospace.

## 10.4 Surfaces

- Minimal elevation
- Thin borders
- Very restrained shadows
- Prefer subtle contrast between `#111417` and `#171B1F`
- Avoid glossy glassmorphism across the whole UI
- Transparency may be used locally for overlays only

---

# 11. Motion language

## 11.1 General rule

Motion should feel deliberate and premium, not frantic.

The project does **not** need to optimize every transition for minimum duration. It is an experience-driven interface. However, motion must remain responsive and must not feel like artificial waiting.

## 11.2 Home Page rules

- Hero scanner: once only
- Small pointer response: allowed
- Model View slider: direct/manual interaction
- Human in the Loop: direct/manual interaction
- Final CTA smooth scroll: allowed
- Continuous pulsing/glowing: avoid
- Scroll-jacking: prohibited
- Sticky multi-frame story sections: prohibited in initial version

## 11.3 Reduced motion

Respect `prefers-reduced-motion`:

- Skip or significantly shorten scanner sequence
- Remove non-essential parallax
- Preserve all functionality
- Slider and editor interactions remain usable

---

# 12. Responsive behavior

## 12.1 Desktop

Primary target for the premium experience.

Hero:

- 3D vehicle can occupy a large visual area.
- Copy and upload CTA should not cover important parts of the vehicle.

Model View:

- Large horizontal comparison area.

Human in the Loop:

- Image/editor area and OCR controls can appear side by side.

## 12.2 Tablet

- Reduce 3D scene complexity if needed.
- Keep scanner readable.
- Model View remains draggable.
- Human in the Loop may stack controls below the image.

## 12.3 Mobile

Do not simply shrink the desktop layout.

Recommended:

- Simplify 3D camera movement.
- Keep vehicle centered and preserve the scanner concept.
- Use a large, thumb-friendly upload CTA.
- Model View slider remains touch draggable.
- Human in the Loop bbox handles must meet touch target requirements.
- Final CTA scrolls to the mobile Hero upload CTA.

If device performance is insufficient, reduce post-processing, reflections, and 3D complexity before removing the conceptual interaction.

---

# 13. Upload-state details

Valid upload state should feel integrated into the Hero.

Recommended states:

### Idle
- 3D Hero active/calm
- Upload CTA available

### Drag over
- Background/scene dims slightly
- `DROP TO ANALYZE`
- Drop target becomes visually obvious

### Invalid format
- Short inline message
- Do not navigate away

### File accepted
- Begin transition into analysis workflow

Final file limits and retention details should be driven by backend configuration and surfaced in concise helper text.

---

# 14. Usage-limit implications on the Home Page

The product will provide a limited number of analyses per anonymous visitor/session. The detailed repeat-analysis workspace belongs to the Analysis Page.

The Home Page should remain first-use focused. It should not become a quota dashboard.

If a quota indicator is later added to the Hero, it should be a small supporting element and should use the same backend quota state as the Analysis Page. The exact Home Page quota placement is not currently a locked visual decision.

---

# 15. Accessibility requirements

- All upload actions accessible by keyboard.
- Drag-and-drop must have a button alternative.
- Model View slider needs keyboard and touch support.
- Bbox editing demo requires keyboard-accessible alternative if feasible; at minimum OCR text input must be fully accessible.
- Maintain adequate text/background contrast.
- Do not communicate state only through color.
- Success feedback should include text/icon, not green alone.
- 3D content must not block page navigation.
- Decorative animation should not trap focus.

---

# 16. Performance priorities

The Hero is visually important, so quality should not be sacrificed prematurely. Still, the 3D experience must remain stable.

Recommended optimization order if performance is poor:

1. Reduce texture resolution
2. Reduce reflection/post-processing complexity
3. Reduce polygon count / use LOD
4. Reduce real-time light/shadow complexity
5. Reduce pointer-based camera movement
6. Provide a static but visually consistent fallback for unsupported devices

Do not replace the 3D Hero with a generic upload box as the first optimization response.

---

# 17. Explicit non-goals / things to avoid

- No giant corporate About section
- No long “Why choose us?” section
- No 12-card feature grid
- No generic AI glowing sphere
- No purple/blue gradient as primary identity
- No scroll-jacked storytelling sequence
- No car configurator behavior
- No looping scanner forever
- No technical confidence/model names on the Home Page
- No duplicate large uploader at the bottom
- No fake social-proof numbers unless real data exists

---

# 18. Recommended component map

Potential frontend component structure:

- `HomePage`
  - `HeroVehicleScanner`
    - `ThreeDVehicleScene`
    - `ScannerOverlay`
    - `HeroCopy`
    - `PrimaryUploadAction`
    - `DragDropOverlay`
  - `ModelVisionComparison`
    - `RealityImage`
    - `ModelOverlay`
    - `ComparisonSlider`
  - `HumanInLoopDemo`
    - `PlateBBoxEditorDemo`
    - `PlateCropPreview`
    - `OCRCorrectionInput`
    - `FeedbackSuccessState`
  - `ReturnToUploadCTA`
  - `Footer`

Exact framework/component names are implementation details, but the separation of responsibilities is recommended.

---

# 19. Acceptance criteria

The Home Page can be considered aligned with this specification when:

- A 3D unbranded vehicle is the Hero centerpiece.
- The scanner plays once on initial entry and then stops.
- The Hero remains subtly interactive after scanning.
- The primary upload action exists in the Hero and supports a clear drag/drop state.
- The page uses a dark theme and the agreed palette roles.
- The Model View section uses a real vehicle photo and a draggable comparison divider.
- The Model View clearly shows vehicle + plate + OCR + body interpretation without debug clutter.
- The Human in the Loop demo allows OCR and plate-bbox correction only.
- The correction demo begins with a believable intentional error.
- The final CTA scrolls back to the Hero instead of opening a second uploader.
- The page uses native scrolling and no scroll-jacking.
- The page remains usable with reduced motion.
- English is used for product UI/copy in the initial version.

---

# 20. Final design statement

The Home Page should feel like a compact **interactive vehicle-analysis exhibit**:

**3D Scanner → Model Vision → Human Correction → Try It Yourself**

The page earns its premium feel from the quality of interaction and restraint, not from the amount of content or animation.

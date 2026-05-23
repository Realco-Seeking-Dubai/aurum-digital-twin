---
name: floorplan-to-3d-twin
description: Turn an architectural floor plan (villa, apartment, office, townhouse, or any multi-storey building — given as PDF or image) into a self-contained, interactive HOLOGRAPHIC 3D digital sales-twin web app. The output is one HTML file (Three.js) with a refined neon-architectural look, floor explode, floor/unit selection, unit drill-down (specs + PSF pricing + EMI + rental ROI), a printable branded sales offer, a 2D floor-plan viewer, lift cores + lobby with a lift-rises-to-floor animation, courtyards/voids, roof features, surrounding plots and a location map. Use this whenever the user supplies a floor plan / architectural drawing / unit schedule and asks for a 3D walkthrough, holographic render, digital twin, "movable/animated" building, or a property sales visualization generated from it.
---

# Floor Plan → Holographic 3D Digital Twin

Produce a premium, interactive 3D web app from architectural floor plans. The proven result is the
**Aurum by Meteora** app — a full working copy is in `assets/example-aurum.html`; treat it as the
reference template and adapt it to the new building. Read `references/build-blueprint.md` for the
scene architecture and `references/geometry-extraction.md` for how to read drawings before coding.

## Golden rule
**Get the real geometry from the source drawings first. Never substitute generic rectangular slabs.**
Read/zoom the plans, extract the true footprint, atrium/voids, structural grid, cores and unit
footprints, and map everything to **real metres (1 scene unit = 1 m)**. A correct shape in plain neon
beats a flashy wrong box. Be honest that it is an interpreted trace, not a CAD/DWG import.

## Inputs to gather
- Floor plan(s) — PDF or image (one per level, or a typical-floor + variations).
- Optional: a unit/price schedule (xlsx/csv/json) → real areas, types, prices.
- Optional: renders/elevations (facade, roof crown, balconies) and a map location.
- Ask the user for: building type, number of floors + floor-to-floor heights, pricing rule
  (e.g. AED/sqft), rent assumption for ROI, brand palette, and the front/entrance/road orientation.
  Do NOT guess orientation or entrances — confirm them (these are the things most often "wrong").

## Workflow

### 1 — Read the drawings (see references/geometry-extraction.md)
- Render PDF pages to PNG if needed; if a renderer returns blank pages, open the served file in a
  browser (Chrome PDFium) or re-extract — do not trust blank thumbnails.
- Use `scripts/crop_plans.py` to crop the building region and to overlay a % grid for **measuring**
  the footprint, atrium, cores and unit positions in metres.
- Extract: footprint polygon (e.g. chamfered square/octagon, L-shape, bar), atrium/light-well voids,
  structural column grid + bays, lift/stair cores, per-floor unit footprints, overall dimensions.

### 2 — Build the data model
- Compact embedded JSON: `units[{u,f,type,size,...}]` and `floors{n:{units,types,price...}}`.
- Pricing: `price = size × PSF` (let the user set PSF tiers). EMI + rental ROI helpers.
- Use `scripts/extract_units.py` to compact a schedule into the embedded blob.

### 3 — Crop plan plates
- `scripts/crop_plans.py` makes two sets from each plan: **readable** crops (for the 2D Floor Plans
  viewer) and **inverted/holographic** crops (additive glowing line-work textured onto the 3D slab).

### 4 — Generate the app (see references/build-blueprint.md)
Copy `assets/example-aurum.html`, then replace the geometry helpers, floor stack, unit data, palette
and labels for the new building. Keep the proven structure:
- Three.js via importmap + OrbitControls + EffectComposer/UnrealBloomPass (low bloom).
- Footprint as a parametric polygon at metric scale; floor slabs with voids; perimeter + interior
  structural columns; facade glass + louvers; balconies; cores + lobby; roof features.
- Reveal driven by **wall-clock** (`performance.now()`), not accumulated dt (robust to throttling).
- Refined palette (see references/palette.md): champagne lines, slate structure, ONE gold accent on
  deep teal, restrained labels.

### 5 — Features (port from the example)
floor rail + explode · click-floor selection (does NOT move the camera) · area-proportional unit
plates · unit modal (real plan + specs + PSF price + editable EMI + rental ROI + Generate Offer) ·
printable branded **sales offer** · **2D Floor Plans viewer** (tabs + readable plan + clickable units) ·
**lift cores + lobby + reception** with a **lift-rises-to-selected-floor** animation · courtyards
highlight→render · roof crowns/pool · surrounding plots + satellite **location** map · hide-UI toggle ·
controllable animations (auto-spin OFF by default; motion only on user action).

### 6 — Verify in a browser
Serve the folder and open the HTML. Check the console for errors, and confirm the **footprint/massing
matches the plans** and controls work. Note: live-preview reloads on every file save — that is normal,
not an app bug. Report honestly what is an interpreted trace vs. measured.

## Quality bar (sophisticated, not prototype)
One disciplined palette; low bloom; crisp lines; calm labels; readable floor plans as a first-class
viewer; correct orientation/entrances/lifts (measured from the plan, confirmed with the user).

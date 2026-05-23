# Build Blueprint — the Three.js holographic app

`assets/example-aurum.html` is a complete, working implementation. Read it, then adapt. This file
lists the structure, the reusable patterns, and the bugs already solved (don't repeat them).

## Stack & boot
- Single self-contained `.html`. Three.js via importmap (`three@0.164.1`), `OrbitControls`,
  `EffectComposer` + `RenderPass` + `UnrealBloomPass`.
- Serve the folder over http (e.g. `python3 -m http.server`) and open in a browser — module imports
  and textures need http, not `file://`.
- Embed data inline (`const DATA = {...}`) so the file is self-contained. Embed via a
  `/*__DATA__*/` placeholder then string-replace with the compact JSON.

## Scene
- `1 scene unit = 1 metre`. Renderer clear + fog = deep teal-charcoal. Bloom kept LOW
  (strength ~0.34, threshold ~0.3) so lines stay crisp.
- OrbitControls (damping, sensible min/max distance, `maxPolarAngle ≈ π*0.49`).
- Helpers: `octShape/octPts` (parametric footprint) → swap for the building's real polygon;
  `lineMat(color,opacity,additive)`, `glassMat(...)`, `ringLine(...)`.

## Geometry build (per the extracted data)
- **Floor slabs**: ExtrudeGeometry of the footprint Shape with void Path(s) (atrium/light-wells);
  thin depth; `EdgesGeometry` for the glowing outline; one group per floor at its `BASE_Y`.
- **Structure**: perimeter columns at grid bays (full height) + interior columns (around atrium /
  intermediate ring) + per-storey beam rings. Distinct colour so the frame reads (`STRUCTURE` toggle).
- **Facade**: per face, translucent glass panel + mullion lines; timber/louvre fins on long faces;
  balcony bands; curved corner balconies on chamfer faces.
- **Cores**: holographic glass shafts with a scan-grid + per-floor markers; **lift cars** that animate
  to the selected floor; **lobby** lit floor + grid + reception desk + walk-in arrows; serve the
  entrances. Position cores from the plan measurement (often flanking the atrium).
- **Roof / amenities**: signature crowns/arches, lift overruns, rooftop pool, etc. — reflect any
  signature design element into the structure (e.g. arches → curved sail-ribs down the facade).
- **Units**: tile the floor ring into annular sectors whose **area ∝ real sq-ft** (clickable). Plus a
  faint floor-plan texture on the slab (inverted/holographic crop).
- **Site**: ground grid + plot boundary + parking bays + roads (label major road) + neighbour plots
  scaled to the map + a location pin.

## State & animation (controllable!)
- `S = {explode, explodeT, reveal, spin:false, selected, columns, courts, ...}`. **auto-spin OFF by
  default**; motion only on user action.
- **Reveal** from wall-clock: `S.reveal = min(1,(now - T0)/2200)` — robust to throttled tabs (do NOT
  accumulate dt; a backgrounded tab will stall a dt-based reveal).
- **Floor select must NOT move the camera/building** (users read camera-fly as "the building moved").
  Selecting a floor: dim others, show its units + plan plate, raise the lift — camera stays put.
- **Camera tweens**: a simple `camTween` lerp with easing; chain a `camQueue` for multi-segment
  walk-ins (entrance → lobby → lift). When walking inside, temporarily lower `controls.minDistance`
  and restore it in `flyTo` (NOT at queue end, or it snaps the camera back out).
- Lift cars: `liftCars.forEach(c => c.position.y += ((liftTargetY+1.5)-c.position.y)*min(1,dt*2.2))`.

## UI / pages (Realco-style, themed)
floor rail · bottom dock (SITE/ORBIT/ENTRANCE/PARKING/ROOF/COURTYARDS/EXPLODE/STRUCTURE/AUTO-SPIN/
RESET/PLANS/PRICES/LOCATION) · floor detail card + amenity strip · **unit modal** (real plan image +
specs + `price = size×PSF` + editable EMI calc + rental ROI from rent/sqft + "Generate Offer") ·
**printable sales offer** (`@media print` shows only `#offer`; window.print()) · **2D Floor Plans
viewer** (floor tabs + readable plan crop + clickable unit grid) · **inventory/prices** table ·
**location** modal (`maps?q=lat,lng&t=k&output=embed` satellite iframe) · lightbox · hide-UI eye.

## Pricing / finance helpers
- `priceOf(u) = round(u.size * psf(u))`; PSF tiers from the user (e.g. larger vs smaller sqft).
- `emi(P,downPct,ratePct,years)` standard amortisation; `annualRent = size*rentPSF`,
  `grossYield = annualRent/price` (range from a low/high rent/sqft).

## Bugs already solved (avoid re-introducing)
- **TDZ**: declare module-scope `let` vars (e.g. `pinRings`, `liftCars`, `roofGroup`) BEFORE the IIFEs
  that assign them.
- **Reveal/animation stalls** in background/preview tabs → use wall-clock, not dt accumulation.
- **Bloom blow-out** on white plan textures → invert plan crops + additive blending (glowing lines on
  transparent) instead of a white plane; keep bloom low.
- **Camera snap-back** after a walk-in → only restore `minDistance` on the next `flyTo`, not when the
  walk queue empties.
- **Live-preview "auto-refresh"** is the editor reloading on each save — it is NOT app code; there is
  no reload logic in the page. Batch edits to reduce churn.

## Generalising to building types
Drive everything from the extracted data: footprint polygon, floor table (heights/insets), void
shapes, core positions, unit list. Villas/townhouses → few large duplex plates + private entries;
apartments → repeating typical floor + balconies; offices → core + open plates + curtain wall;
podium+tower → wide podium then setback tower. Label units residential/commercial per the user.

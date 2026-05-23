# Geometry Extraction — reading the drawings

The single most important phase. The whole result depends on tracing the real geometry.

## 1. Get readable images
- PDF plans: render pages to PNG. If your text/PDF reader returns **blank/white pages** (some PDFs use
  JPEG2000/exotic encodings), do NOT trust them — open the file in Chrome (PDFium renders them) or use
  a different rasteriser. The example project's split brochure rendered blank; the architectural plan
  PNGs rendered fine — always sanity-check.
- Keep the highest-resolution plan you have; you will zoom/crop heavily.

## 2. Identify, per plan, the elements
- **Footprint polygon** — the slab outline. Common shapes: chamfered square / octagon, rectangle/bar,
  L-shape, courtyard ring, podium+tower. Trace it as an explicit list of [x,z] points.
- **Atrium / light-wells / voids** — central courtyard or internal voids (holes in the slab).
- **Structural column grid** — the circled grid bubbles (A,B,C… / 1,2,3…) and the dimension strings
  between them give bay spacing and overall size.
- **Lift + stair cores** — the hatched black blocks (small squares = lift shafts, zig-zag = stairs).
  Note their position relative to the atrium and which faces they serve.
- **Per-unit footprints** — the colour-filled regions with unit numbers/areas.
- **Entrances, ramps, parking, services** — ramps + substation = back-of-house; pedestrian lobby =
  front. Find the **North arrow** to orient.

## 3. Measure with a grid overlay (scripts/crop_plans.py --grid)
1. Crop the building footprint region from the sheet.
2. Overlay a 0–100% grid; you know the real footprint width (from the dimension string, e.g.
   "61000 [200'-1½"]" = 61 m), so **each 10% = width/10 metres**.
3. Read off, in metres relative to footprint centre (= scene origin):
   - footprint half-size and chamfer/edge lengths,
   - atrium half-size and offset,
   - each core's centre (x,z) and size,
   - approximate per-unit angular/positional layout.

## 4. Map to the scene (1 unit = 1 m)
- Footprint centre → origin (0,0). +Y up.
- Decide orientation explicitly and **confirm with the user**: which face is the street/front, where
  the main road is, where the entrances are. Orientation + entrances + lift position are the details
  most often flagged as "wrong" — measure them, then verify.
- Floor stack: list each level with floor-to-floor height (ground/duplex levels are often double
  height) and any setbacks (upper floors step back → terraces).

## 5. Output of this phase
- A parametric footprint function (e.g. `chamferedSquare(half, chamfer)` or a points array).
- Atrium/void shapes. Core positions + sizes. Column-grid bay spacing.
- Floor table: `{floor, height, insetRatio, units}`.
- A compact unit dataset (see scripts/extract_units.py).
- A short note of what is measured vs. interpreted (be honest in the final report).

## Building-type cues
- **Villa / townhouse**: G+1 duplex footprints, private entrances/gardens at front, fewer larger units.
- **Apartments**: a repeating typical floor, double-loaded corridor or atrium ring, balconies.
- **Offices**: central core(s) + open floor plates, curtain-wall facade, larger floor depths.
- **Mixed/podium**: retail/parking podium + tower setback above.
Use the cues to label units commercially/residentially as the user intends (don't assume residential).

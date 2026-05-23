# Handoff — Muhammad Saleh

**Project:** AURUM by Meteora — interactive holographic 3D digital sales twin (Al Sufouh 1, Dubai).

## 1. The deliverable

**`index.html`** is THE app — a single self-contained HTML file (Three.js, no build step).
Open this one. (The files in `archive/` are earlier prototypes — ignore them.)

## 2. Run it

```bash
cd "Aurum Building"
python3 -m http.server 8787
# open http://localhost:8787/index.html
```

Must be served over HTTP (not opened as a `file://`) because it loads JS modules + image textures.
Internet is needed once to fetch Three.js from the CDN (unpkg). Works in any modern browser.

## 3. What it does

- **3D**: orbit/zoom; **EXPLODE** floors; **STRUCTURE**, **COURTYARDS**, **AUTO-SPIN** (off by default), **RESET**.
- **Views**: SITE, ORBIT, ENTRANCE (walk-in), PARKING, ROOF.
- **Floor rail** (right): click a floor → it isolates, the **lift rises** to it, and its units appear
  (the camera deliberately does NOT move).
- **Unit drill-down**: click a unit → modal with the real floor plan, specs, **price = size × PSF**,
  an editable **EMI calculator**, **rental yield (ROI)**, and **Generate Sales Offer**.
- **Sales Offer**: branded, printable (Print / Save as PDF) — buyer fields, payment plan, EMI, yield.
- **PLANS**: a 2D Floor Plans viewer (floor tabs + readable plan + clickable unit grid).
- **PRICES**: full inventory table. **LOCATION**: satellite map of the plot.

## 4. The numbers (where to change them)

All in the `<script type="module">` near the top of `index.html`:

- **Pricing** — `PSF_LARGE = 2350`, `PSF_SMALL = 2500`, `LARGE_AT = 1500` (sqft threshold).
  `priceOf(u) = size × psf`.
- **Rental ROI** — `RENT_LOW = 280`, `RENT_HIGH = 350` (AED/sqft/yr).
- **EMI** defaults — 20% down · 6.5% · 25 yrs (editable live in the unit modal).
- **Payment plan** — `PAYMENT_PLAN` (20% / 40% / 40%).
- **Unit data** — embedded `const DATA = {...}` (units + per-floor summary). To regenerate from a new
  schedule, use `skill/floorplan-to-3d-twin/scripts/extract_units.py` and paste the output blob.
- **Floor heights / setbacks** — `FH`, `INSET`. **Brand colours/fonts** — the `:root` CSS variables
  and the `STRUCT` / palette hexes.

## 5. Assets it loads (`aurum_assets/`)

- `plans/architecture_page_*.pdf.png` — architectural plans (unit modal).
- `plan_view/floor_*.png` — readable plan crops (2D Floor Plans viewer).
- `plan_crops/floor_*.png` — inverted holographic crops (3D floor-slab texture).
- `render_candidates/3D_revised_render/page_*.pdf.png`, `building_render_front.jpg` — renders.
- `pricing_data.json` — source unit/area/price schedule.

## 6. Honest caveats

- The 3D geometry is an **interpreted trace** from the PDF plans (correct footprint, atrium, floor
  stack, cores, setbacks, crowns) — **not** a CAD/DWG import. For millimetre accuracy, import DWG/DXF.
- Orientation/entrances/lift positions were measured off the plan grid and confirmed with the client;
  re-verify against the latest CAD if it changes.
- Amenity render slots (reception/corridor/courtyard) reuse the available exterior/terrace renders —
  swap in real interior shots when available.

## 7. Regenerate this for any other building

Install the bundled Claude skill and give it a floor plan:

```bash
cp -r skill/floorplan-to-3d-twin ~/.claude/skills/
```

Then in Claude Code: provide a floor plan (villa / apartment / office / townhouse / building) and ask
for a "3D digital twin / holographic walkthrough". The skill encodes this whole workflow (read plans →
trace geometry → build the Three.js app with all the features above). See its `SKILL.md` + `references/`.

## 8. Suggested next steps

- Wire unit **status** (available / reserved / sold) + live booking data from CRM/sheet.
- Admin mode to toggle unit status from a touch screen; idle attract-loop for a showroom TV.
- Arabic/English toggle for walk-in clients.
- Replace interpreted footprint with exact CAD-derived boundaries; add real interior renders.
- **Host it:** This has been pre-configured for **Vercel deployment** with the new `vercel.json` file for zero-config deployments, clean URLs, and ultra-fast asset caching headers.
- **Local Development:** Run locally using `npm run dev` with modern Vite, or fallback to the traditional Python `http.server`.

Questions: the code is heavily commented and organised top-to-bottom (data → scene → geometry →
features → camera → loop). Search the section banners (`/* ===== ... ===== */`).


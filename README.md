# AURUM by Meteora — Digital Sales Twin

An interactive **holographic 3D digital sales twin** of the AURUM commercial building (G+7) in
Al Sufouh 1, Dubai. Built as a single self-contained HTML file using Three.js. Designed for sales:
explore the building in 3D, drill into any unit, see pricing / EMI / yield, view the real floor
plans, and generate a branded sales offer.

## Run locally

From this folder:

```bash
python3 -m http.server 8787
```

Then open **the current app**:

```text
http://localhost:8787/aurum_walkthrough.html
```

> Use a local server (not `file://`) — the page loads JS modules and image textures over HTTP.

## The building

- **Commercial**, **G+7**, ~**61 × 61 m** chamfered-octagon footprint with a central courtyard/atrium.
- **114 units** · ground floor = G+1 duplex units (front entrances) · upper floors = office suites ·
  twin arched roof crowns · 6th-floor sky bridge across the courtyard · rooftop pool.
- Pricing model: **price = area (sqft) × PSF**, **2,350 AED/sqft** for larger units (≥1,500 sqft),
  **2,500** for smaller. Rental ROI from **280–350 AED/sqft/yr**. (All editable — see HANDOFF.)

## Features

- Movable 3D (orbit / zoom), floor **explode**, **floor selection** (camera stays put), area-true unit plates
- **Unit drill-down**: real floor plan + specs + PSF price + editable **EMI calculator** + **rental yield**
- **Printable, branded Sales Offer** (payment plan, EMI, yield) → Print / Save as PDF
- **2D Floor Plans viewer** (floor tabs + readable plan + clickable unit grid)
- **Lift cores + lobby** with a **lift-rises-to-floor** animation
- Courtyards highlight → render, roof crowns/pool, surrounding plots + **satellite location** map
- **Sheikh Zayed Road** context, two side **entrances**, villa parking, plot boundary
- Realco brand theme (deep teal · champagne lines · gold accent · serif), low-bloom "sophisticated" look

## Files

- **`aurum_walkthrough.html`** — THE app (current). Open this one.
- `aurum_assets/` — `plans/` (architectural PNGs), `plan_view/` (readable plan crops for the 2D viewer),
  `plan_crops/` (inverted holographic crops for the 3D slab), `render_candidates/3D_revised_render/`
  (renders), `building_render_front.jpg`, `pricing_data.json`.
- `skill/floorplan-to-3d-twin/` — the reusable Claude skill that generates a twin like this from any floor plan.
- `archive/` — earlier prototypes (not used; kept for reference).

See **HANDOFF_MUHAMMAD_SALEH.md** for the full handoff.

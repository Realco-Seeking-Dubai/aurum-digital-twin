# AURUM by Meteora — Digital Sales Twin

An interactive **holographic 3D digital sales twin** of the AURUM commercial building (G+7) in
Al Sufouh 1, Dubai. Built as a single self-contained HTML file using Three.js. Designed for sales:
explore the building in 3D, drill into any unit, see pricing / EMI / yield, view the real floor
plans, and generate a branded sales offer.

## Run locally

### Option A: Modern Node.js Dev Server (Recommended)
This uses a lightning-fast local development server with Vite:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the browser:
   ```text
   http://localhost:5173/
   ```

### Option B: Quick Python Server (No Node.js required)
From this folder:

```bash
python3 -m http.server 8787
```

Then open the app:
```text
http://localhost:8787/index.html
```

> **Note:** Serving over HTTP/HTTPS is required (do not open via `file://` directly) because the page dynamically loads JavaScript modules and high-resolution image textures.


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

- **`index.html`** — THE app (current). Open this one.
- `aurum_assets/` — `plans/` (architectural PNGs), `plan_view/` (readable plan crops for the 2D viewer),
  `plan_crops/` (inverted holographic crops for the 3D slab), `render_candidates/3D_revised_render/`
  (renders), `building_render_front.jpg`, `pricing_data.json`.
- `skill/floorplan-to-3d-twin/` — the reusable Claude skill that generates a twin like this from any floor plan.
- `archive/` — earlier prototypes (not used; kept for reference).

See **HANDOFF_MUHAMMAD_SALEH.md** for the full handoff.

---

## Vercel Deployment

This project is configured for one-click, zero-config production deployment to Vercel.

### Deploy Button
Click the button below to instantly deploy this interactive 3D digital sales twin to your own Vercel account:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Firfanrealco%2Faurum-digital-twin)

### Manual Deployment
You can easily deploy manually using either the Vercel CLI or Vercel Web Dashboard:

#### Method 1: Using the Vercel Web Dashboard (No CLI required)
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/).
3. Click **"Add New"** > **"Project"** and import your repository.
4. Vercel will automatically read the pre-configured [vercel.json](file:///Users/apple/Desktop/aurum-digital-twin/vercel.json) file:
   - **Framework Preset** is set to `Other` (pure static site)
   - **Build Command** is empty (no build step)
   - **Output Directory** is set to root `.`
5. Click **"Deploy"** and your site will be live on HTTPS with clean URLs!

#### Method 2: Using Vercel CLI
If you have Vercel CLI installed locally:
```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy instantly
vercel --prod
```

### Production Optimizations in [vercel.json](file:///Users/apple/Desktop/aurum-digital-twin/vercel.json)
- **Clean URLs:** Auto-resolves URL paths without the `.html` extension (e.g., `/` instead of `/index.html` or `/plans` instead of `/plans.html`).
- **Trailing Slashes:** Standardized to false for SEO and duplicate content avoidance.
- **Static Delivery:** Serves the HTML, CSS, JavaScript, and Three.js 3D engine natively, bypassing any redundant build pipelines.
- **Ultra-Fast Asset Caching:** All digital twin architectural drawings, high-resolution renders, and 3D slab textures (`aurum_assets/...`) are configured with permanent caching headers (`public, max-age=31536000, immutable`) for instantaneous subsequent loads.


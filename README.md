# Aurum Commercial Building Sales Kiosk

Touch-TV ready interactive walkthrough for the Aurum Commercial Building in Al Sufouh 1, Dubai.

## Open Locally

Run a local server from this folder:

```bash
python3 -m http.server 8787
```

Then open:

```text
http://localhost:8787/aurum_full_3d_holographic_walkthrough.html
```

## Current Experience

- Touch-TV optimized sales availability explorer
- Contained 3D canvas with orbit-only rotation
- Road and parking context around the building
- Floor-by-floor animated walkthrough
- Floor hover/tap pricing card
- AED 2,300 PSF pricing logic
- Available / booked / sold display states
- Office boundaries, balconies, pillars, lifts, entrances, AC/service zones

## Main Files

- `aurum_full_3d_holographic_walkthrough.html` - primary kiosk experience
- `aurum_assets/` - plan thumbnails, render candidates, extracted pricing JSON and supporting assets
- `aurum_holographic_walkthrough.html` - earlier/reference version


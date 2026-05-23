# Handoff: Muhammad Saleh

## Project

Aurum Commercial Building interactive sales kiosk / digital footprint.

## What Is Ready

The main working file is:

```text
aurum_full_3d_holographic_walkthrough.html
```

It is designed for a large office touch TV and includes:

- contained 3D canvas so the full building stays visible
- touch-sized sales controls
- floor-by-floor walkthrough animation
- floor selector rail
- available / booked / sold legend
- AED 2,300 PSF pricing calculation
- unit status preview
- road and parking context
- building structure: floors, envelope, pillars, lifts, entrances, AC/service areas, office boundaries, balcony zones and sixth-floor courtyard walkway

## How To Run

From the project folder:

```bash
python3 -m http.server 8787
```

Open:

```text
http://localhost:8787/aurum_full_3d_holographic_walkthrough.html
```

## Notes

- Pricing data is extracted into `aurum_assets/pricing_data.json`.
- The current pricing rule is fixed at `AED 2,300 / sqft`.
- The 3D geometry is a traced/interpreted web model based on the PDF plans, not a CAD/DWG import.
- The next quality jump would be importing actual DWG/DXF linework or rebuilding the model in Blender/Three.js from exact CAD geometry.

## Suggested Next Improvements

- Replace interpreted footprint paths with exact CAD-derived boundaries.
- Add actual unit booking data from CRM or spreadsheet.
- Add admin mode to update unit status from touch TV.
- Add a branded idle animation loop for office display.
- Add Arabic/English toggle if this will face walk-in clients.


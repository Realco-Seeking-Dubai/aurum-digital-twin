# Palette & Style — sophisticated, not prototype

Discipline beats colour count. Use ONE restrained palette + ONE accent. Avoid the "rainbow neon"
look (electric cyan + magenta + lime + amber everywhere). The default below reads as premium
real-estate; swap the accent to the client's brand.

## Default scene palette (deep teal · champagne · single gold accent)
- Background / fog: `#070f0e` clear, `#081513` fog (deep teal-charcoal).
- Floor edges & primary lines: **champagne** `#d8cdb4`.
- Structure (columns/beams): **slate-teal** `#6f9b96` (distinct but calm).
- Single accent (atrium, entrances, cores, crowns, selected, lift): **gold** `#c9a878` /
  soft `#d8c08a` / bright frame `#efdcae`.
- Secondary lines / metro / misc: muted slate `#5c7a74`, `#9ab4ad`.
- Greenery / planters / arrows: sage `#8aab9e`.
- Glass: deep teal, low opacity (additive).
- Pool / water: calm aqua `#86b6bd`.

## Bloom & atmosphere
- `UnrealBloomPass(strength≈0.34, radius≈0.5, threshold≈0.3)` — subtle glow, crisp edges.
- Subtle ground grid; gentle fog; optional vignette. No constant motion (auto-spin OFF).

## UI theme (panels/pages)
- Glass panels tinted teal `rgba(16,46,40,.72)`; hairlines in gold `rgba(201,168,120,.26)`.
- **Serif** headings/wordmark (Georgia/Times stack), Inter for body/labels.
- Modals: deep-teal sheet `linear-gradient(160deg,#163f38,#0b211c)`, gold accents, serif `<h2>`.
- Sales offer (print): teal header band + serif wordmark + ivory body + gold rules + green totals.
- Floating 3D labels: small, low opacity (~0.34), accent or champagne — never shouty.

## To rebrand
Change the accent hex (gold → brand colour) and the serif/sans fonts; keep the deep-teal base and the
champagne/slate line discipline. Apply the same palette to the 3D lines, the UI panels, and the offer.

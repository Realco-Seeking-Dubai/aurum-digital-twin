#!/usr/bin/env python3
"""
crop_plans.py — prepare floor-plan images for the holographic twin.

Modes (use as needed):
  grid      : overlay a 0-100% measuring grid on the building region (read footprint/atrium/cores in m)
  readable  : crop the building region -> clean readable plan (for the 2D Floor Plans viewer)
  holo      : crop + INVERT -> glowing line-work for the 3D slab texture (additive blending)
  sheet     : contact sheet of many images (survey renders/plans quickly)

Examples:
  python3 crop_plans.py grid     --src plan.png --box 366,126,1066,826 --out /tmp/grid.png
  python3 crop_plans.py readable --src plan.png --box 150,70,1090,860  --out plan_view/floor_2.png
  python3 crop_plans.py holo     --src plan.png --box 366,126,1066,826 --out plan_crops/floor_2.png
  python3 crop_plans.py sheet    --glob 'renders/*.png' --out /tmp/sheet.png

Notes:
- --box is x0,y0,x1,y1 in source pixels. Find it by eye or via the grid mode (start with the whole
  sheet, then tighten to the building footprint). The footprint should be roughly centred & square.
- If a PDF page renders BLANK in your reader, rasterise it another way (Chrome/PDFium) first.
"""
import argparse, glob, os
from PIL import Image, ImageDraw, ImageOps

def parse_box(s):
    return tuple(int(v) for v in s.split(","))

def grid(a):
    im = Image.open(a.src).convert("RGB")
    c = im.crop(parse_box(a.box)) if a.box else im
    c = c.resize((a.size, a.size), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for i in range(0, 11):
        p = int(a.size * i / 10)
        d.line([(p, 0), (p, a.size)], fill=(255, 0, 255), width=1)
        d.line([(0, p), (a.size, p)], fill=(255, 0, 255), width=1)
        d.text((p + 2, 2), str(i * 10), fill=(255, 0, 255))
        d.text((2, p + 2), str(i * 10), fill=(0, 160, 255))
    c.save(a.out)
    print(f"grid -> {a.out}  (each 10% = footprint_width/10 metres)")

def readable(a):
    im = Image.open(a.src).convert("RGB")
    c = im.crop(parse_box(a.box)) if a.box else im
    c.thumbnail((a.size, a.size), Image.LANCZOS)
    c.save(a.out); print(f"readable -> {a.out} {c.size}")

def holo(a):
    im = Image.open(a.src).convert("RGB")
    c = im.crop(parse_box(a.box)) if a.box else im
    c = c.resize((a.size, a.size), Image.LANCZOS)
    c = ImageOps.autocontrast(ImageOps.invert(c), 2)  # white bg -> black (transparent under additive)
    c.save(a.out); print(f"holo -> {a.out} (use AdditiveBlending; black reads as transparent)")

def sheet(a):
    files = sorted(glob.glob(a.glob))
    if not files: print("no files match", a.glob); return
    cols = a.cols; cell = a.cell; rows = (len(files) + cols - 1) // cols
    out = Image.new("RGB", (cols * cell, rows * cell), (12, 16, 26)); d = ImageDraw.Draw(out)
    for i, f in enumerate(files):
        try: im = Image.open(f).convert("RGB")
        except Exception: continue
        im.thumbnail((cell - 12, cell - 28), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * cell
        out.paste(im, (x + 6, y + 6)); d.text((x + 6, y + cell - 20), os.path.basename(f), fill=(255, 210, 120))
    out.save(a.out); print(f"sheet -> {a.out} ({len(files)} imgs)")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="mode", required=True)
    for name in ("grid", "readable", "holo"):
        s = sub.add_parser(name)
        s.add_argument("--src", required=True); s.add_argument("--box", default=None)
        s.add_argument("--out", required=True); s.add_argument("--size", type=int, default=820)
    s = sub.add_parser("sheet")
    s.add_argument("--glob", required=True); s.add_argument("--out", required=True)
    s.add_argument("--cols", type=int, default=6); s.add_argument("--cell", type=int, default=300)
    a = ap.parse_args()
    {"grid": grid, "readable": readable, "holo": holo, "sheet": sheet}[a.mode](a)

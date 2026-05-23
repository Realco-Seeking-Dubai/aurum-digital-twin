#!/usr/bin/env python3
"""
extract_units.py — compact a unit/price schedule into the embedded data blob for the app.

Input: CSV or JSON (or XLSX if pandas/openpyxl available) with at least: unit id, floor, area(sqft).
Optional columns: type, balcony area, price. Map your column names with the flags.

Output (stdout or --out): compact JSON
  {"units":[{"u":101,"f":1,"t":"...","s":3979,"p":7280000}], "floors":{"1":{...}}, "unitCount":N}

Pricing: if no price column, pass --psf-large/--psf-small/--large-at to compute price = area*PSF.

Examples:
  python3 extract_units.py --src schedule.csv --col-unit Unit --col-floor Floor --col-area Size \
      --col-type Type --col-price SellingPrice --out data.json
  python3 extract_units.py --src schedule.csv --col-unit unit --col-floor floor --col-area size \
      --psf-large 2350 --psf-small 2500 --large-at 1500 --out data.json
"""
import argparse, csv, json, os

def load_rows(src):
    ext = os.path.splitext(src)[1].lower()
    if ext == ".json":
        d = json.load(open(src)); return d["units"] if isinstance(d, dict) and "units" in d else d
    if ext in (".csv", ".tsv"):
        with open(src, newline="") as f:
            return list(csv.DictReader(f, delimiter="\t" if ext == ".tsv" else ","))
    try:
        import pandas as pd
        return pd.read_excel(src).to_dict("records")
    except Exception as e:
        raise SystemExit(f"Cannot read {src} ({e}). Convert XLSX to CSV first.")

def num(v):
    try: return float(str(v).replace(",", "").strip())
    except Exception: return 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--col-unit", default="unit"); ap.add_argument("--col-floor", default="floor")
    ap.add_argument("--col-area", default="size"); ap.add_argument("--col-type", default=None)
    ap.add_argument("--col-price", default=None)
    ap.add_argument("--psf-large", type=float, default=None); ap.add_argument("--psf-small", type=float, default=None)
    ap.add_argument("--large-at", type=float, default=1500)
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    rows = load_rows(a.src); units = []
    for r in rows:
        s = round(num(r.get(a.col_area)))
        if s <= 0: continue
        if a.col_price and r.get(a.col_price) not in (None, ""):
            p = round(num(r.get(a.col_price)))
        elif a.psf_large and a.psf_small:
            p = round(s * (a.psf_large if s >= a.large_at else a.psf_small))
        else:
            p = 0
        units.append({"u": (str(r.get(a.col_unit)) or "").strip(),
                      "f": int(num(r.get(a.col_floor))),
                      "t": (str(r.get(a.col_type)).strip() if a.col_type and r.get(a.col_type) else ""),
                      "s": s, "p": p})
    floors = {}
    for u in units:
        f = floors.setdefault(str(u["f"]), {"units": 0, "min": 1e18, "max": 0, "total": 0, "suite": 0, "types": {}})
        f["units"] += 1; f["total"] += u["p"]; f["suite"] += u["s"]
        if u["p"]: f["min"] = min(f["min"], u["p"]); f["max"] = max(f["max"], u["p"])
        if u["t"]: f["types"][u["t"]] = f["types"].get(u["t"], 0) + 1
    for f in floors.values():
        if f["min"] == 1e18: f["min"] = 0
        f["types"] = [{"name": k, "count": v} for k, v in f["types"].items()]
    out = {"units": units, "floors": floors, "unitCount": len(units)}
    blob = json.dumps(out, separators=(",", ":"))
    (open(a.out, "w").write(blob) if a.out else print(blob))
    print(f"\n# {len(units)} units across {len(floors)} floors"
          + (f" -> {a.out}" if a.out else ""), flush=True)

if __name__ == "__main__":
    main()

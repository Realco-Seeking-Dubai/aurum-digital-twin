# Deploy — Vercel → www.aurum.realco.ai

This repo is Vercel-ready. `vercel.json` serves the app at the site root and `index.html` is a
fallback redirect, so the deployed root URL shows `aurum_walkthrough.html`. The repo can stay
**private** — Vercel deploys a private GitHub repo to a public URL.

## A. One-time: connect the repo to Vercel (you do this, needs your Vercel login)
1. Go to **https://vercel.com/new** and log in (GitHub).
2. **Import** `irfanrealco/aurum-digital-twin` (authorise Vercel for the repo if asked).
3. Framework preset: **Other** · Build command: **none** · Output dir: **leave empty (root)**.
4. **Deploy**. You get a `*.vercel.app` URL — open it to confirm the twin loads.
   (No build step — it's a static site; `vercel.json` handles the root rewrite.)

After this, **every push to `master` auto-deploys** (production). No further action needed from us.

## B. Custom domain — www.aurum.realco.ai
1. In the Vercel project → **Settings → Domains → Add** → `www.aurum.realco.ai` (and optionally
   `aurum.realco.ai`, set to redirect to the www).
2. Vercel shows a DNS record to add. At your **realco.ai DNS** (where realco.ai is managed), add:
   - **CNAME** · host `www.aurum` (or `aurum.www` depending on your DNS UI) → `cname.vercel-dns.com`
   - For the apex `aurum.realco.ai`, use the **A / ALIAS** record Vercel specifies.
3. Wait for DNS to propagate; Vercel issues HTTPS automatically. The site goes live at
   **https://www.aurum.realco.ai** (http→https is automatic).

## C. Alternative: deploy from this machine via CLI
```bash
npm i -g vercel      # if not installed
vercel login         # your account (interactive — you do this)
vercel --prod        # from this folder; first run links/creates the project
```
Then add the domain as in section B.

## Notes
- Static-only: no server, no env vars, no secrets in the repo.
- The app fetches Three.js from the unpkg CDN and embeds the Google Maps location iframe — both work
  over HTTPS on the live domain.
- To change pricing/units/brand before going live, edit `aurum_walkthrough.html` (see
  HANDOFF_MUHAMMAD_SALEH.md §4) and push — Vercel redeploys automatically.

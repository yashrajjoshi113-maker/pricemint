# PriceMint

India's price comparison site — Amazon.in, Flipkart, Croma, Reliance Digital,
Tata CLiQ & Myntra in one place. Static frontend + Supabase.

## Architecture

- **Frontend**: plain HTML + Tailwind (via CDN) + vanilla JS. No build step.
- **Database / Auth**: [Supabase](https://supabase.com) — Postgres table for
  the product catalog, built-in email/password auth, and Row Level Security
  for price alerts.
- **`server.js`**: an earlier Express prototype, **not used by the live
  site**. Kept only as a starting point if you later build a real
  scraping/price-refresh pipeline.

Every page (`index.html`, `search.html`, `product.html`, `deals.html`,
`wishlist.html`, `admin.html`) reads and writes through the single data layer
in `js/products.js`, so there's one source of truth for the catalog.

## One-time setup

### 1. Create the database

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase-schema.sql` and click **Run**.
   This creates the `products`, `admins`, and `price_alerts` tables (with
   Row Level Security policies) and seeds 30 demo products.

### 2. Make yourself an admin (optional, for `admin.html`)

1. Sign up on the live site once (so your account exists in
   `auth.users`).
2. In Supabase → **Authentication → Users**, copy your user UUID.
3. Back in the SQL editor, run:
   ```sql
   insert into public.admins (user_id) values ('YOUR-USER-UUID-HERE');
   ```
4. You can now add/edit/hide products from `admin.html`.

### 3. Security note on `.env`

`.env` is already in `.gitignore`, but an older commit added it to this
repo's history. The key in it is a Supabase **anon** key, which is safe to
expose (that's how Supabase client apps work — real protection comes from
the RLS policies in `supabase-schema.sql`, not from hiding this key). Even
so, it's best practice to stop tracking it:

```bash
git rm --cached .env
git commit -m "Stop tracking .env (already in .gitignore)"
```

If you ever add a real secret (e.g. a `service_role` key) to `.env`, rotate
it in the Supabase dashboard first, then keep it out of git entirely.

## Local development

This is a static site — any local server works:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or whatever port it prints).

## Deploying (Vercel)

This repo includes a minimal `vercel.json` for a pure static deployment —
just import the repo in Vercel, no build command needed.

## Project structure

```
index.html          Homepage
search.html          Search & category browsing
product.html         Product detail + price history + price alerts
deals.html            Biggest live discounts
wishlist.html         Your price alerts (requires login)
login.html            Sign in / sign up
admin.html            Catalog management (requires admins table entry)
js/
  auth.js             Supabase client, session helpers, header auth UI
  products.js          Product catalog + price alert data layer (single source of truth)
  admin.js              Admin-only product CRUD helpers
  data.js               Marketing content (testimonials, FAQs, etc.) + loads live products
  app.js                Homepage interactions (rendering, search autocomplete, animations)
supabase-schema.sql    Run once in Supabase SQL editor: tables, RLS, seed data
server.js               Legacy prototype backend — not used by the live site
```

## Known limitations / good next steps

- **Prices are demo data**, seeded from `supabase-schema.sql`. There's no
  live scraper — `admin.html` lets you update prices by hand for now.
- **Price alert notifications aren't sent yet** — the alert is saved to
  Supabase, but nothing emails you when the target price is hit. A
  Supabase Edge Function (scheduled) comparing `price_alerts.target_price`
  against `products.lowest_price` would be the natural next step.
- **Product images** are generated gradient placeholders, not real product
  photos, to avoid relying on hotlinked third-party image URLs that can
  break.

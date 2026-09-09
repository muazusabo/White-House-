# White House Eatry — Frontend (Next.js)

STEP 8–10 of the build plan: the customer ordering flow (menu, cart, checkout,
confirmation, tracking) and the admin dashboard (login, orders, products,
categories, settings).

## Design

A "menu board" visual language rather than generic SaaS cards — item rows with
dotted price leaders (like a printed canteen menu), an order confirmation styled
as a ticket stub, warm paper background with forest green and marigold accents.
Fraunces for headings, Inter for body/UI text. Prices are shown in ₦ by default —
change the symbol in `lib/format.ts` if your currency differs.

## Pages

**Customer-facing:**
- `/` — landing page with hero, today's picks, how-it-works, and business info
- `/menu` — full menu with category tabs, search, add-to-cart
- `/cart` — review and adjust quantities
- `/checkout` — customer details, collection date/time, note, places the order
- `/order/[id]` — confirmation ticket after ordering
- `/track` — look up an order by order number + phone

**Admin (all protected, redirect to `/admin/login` if not signed in):**
- `/admin/login`
- `/admin` — dashboard summary (orders today, pending/preparing/ready/completed, sales, product availability)
- `/admin/orders` — filter by status, expand an order, change its status
- `/admin/products` — add/edit/delete products, toggle availability, add categories
- `/admin/settings` — restaurant name, hours, location, contact, logo

## Getting started

1. Make sure the backend (in `../server`) is running at `http://localhost:4000/api`.

2. Copy the env file:
   ```
   cp .env.local.example .env.local
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the dev server:
   ```
   npm run dev
   ```

Visit `http://localhost:3000`. Sign in to `/admin/login` with the admin email/password
you set in the backend's `.env` and seeded with `npm run seed`.

## How it talks to the backend

- Public reads (menu, categories, settings, order tracking) call the API with no
  auth header.
- Order creation sends only `productId` + `quantity` per line — the backend looks
  up the current price and availability and calculates the total itself; nothing
  price-related is trusted from the browser.
- Admin actions attach the JWT from `/auth/login` (stored in `localStorage`) as a
  Bearer token. If a token is missing/expired, protected API calls will fail —
  the admin UI doesn't yet auto-detect an expired token and bounce you to login on
  a 401, so if something in `/admin` starts failing after a while, just log out and
  back in.

## What's next

- Test the full flow end to end: place a real order from `/menu` through to
  `/order/[id]`, then confirm it shows up and can be moved through statuses in
  `/admin/orders`.
- Optional polish once the flow works: product images (currently just a URL field,
  no upload), toast notifications instead of the plain error text, and auto-logout
  on an expired token.

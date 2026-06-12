# Silly Planet — Amazon Clone

An Amazon-style storefront built with Next.js 16, React 19, Prisma + SQLite, and NextAuth v5. The look mimics Amazon's; the brand is "Silly Planet" so it's clearly a demo and not affiliated.

## Stack

- Next.js 16 App Router (Turbopack), React 19, TypeScript
- Tailwind CSS v4
- Prisma 6 + SQLite (`prisma/dev.db`)
- NextAuth v5 (Credentials provider, JWT sessions)
- Radix UI for menu / dialog primitives, lucide-react icons
- Server Actions for mutations (cart, checkout, reviews, addresses, wishlist)

## Run locally

```bash
git clone https://github.com/chakanevaibhav/silly-planet.git
cd silly-planet
npm install                 # installs deps and regenerates package-lock.json
cp .env.example .env        # set AUTH_SECRET to a random value
npx prisma migrate dev      # creates SQLite DB
npm run db:seed             # 8 categories, 27 products, demo user
npm run dev                 # http://localhost:3000
```

Demo login (created by seed):

- Email: `demo@silly.planet`
- Password: `password123`

A default address ("Galaxy Way") is preloaded so checkout works out of the box.

## .env

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3000"
```

## Features

- Home page with hero band, category tiles, and product rails
- Category pages and full-text search (`/s?k=...&category=...`)
- Product detail page: image gallery, buy box (Add to Cart / Buy Now), wishlist, reviews dialog
- Cart with cookie-backed guest session, merged into the user's DB cart on sign in
- Three-step checkout (address → mock payment → review) with order placement in a Prisma transaction
- Orders list + detail, with snapshotted line items
- Account hub: addresses CRUD, wishlist, sign-out
- Sign in / register with bcrypt + Credentials provider

## Routes

- `/` — home
- `/category/[slug]`, `/s` — browse and search
- `/product/[id]` — PDP
- `/cart` — cart review
- `/checkout` — protected, redirects to `/signin` if needed
- `/orders`, `/orders/[id]` — protected
- `/account`, `/account/addresses`, `/account/wishlist` — protected
- `/signin`, `/register` — auth

Protected routes are guarded by `src/proxy.ts` (Next.js 16's renamed middleware).

## Code layout

- `prisma/` — schema and seed
- `src/app/` — App Router pages
- `src/components/` — UI: header, footer, product, pdp, cart, checkout
- `src/lib/` — `db`, `auth`, `cart`, `money`, `validators`, `utils`
- `src/actions/` — Server Actions: `cart`, `checkout`, `auth`, `addresses`, `wishlist`, `reviews`

## Notes

This is a demo storefront. No real payment is processed; the checkout form accepts any "card" number. SQLite stores `images`/`bullets` as JSON-encoded strings (parsed by `lib/utils.ts:parseStringArray`).

Not affiliated with Amazon.com, Inc.

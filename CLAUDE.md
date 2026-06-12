@AGENTS.md

# Silly Planet — Amazon Clone

A Next.js 16 storefront that mimics Amazon's look and core flows. The brand is "Silly Planet" so it's clearly a demo and not affiliated with Amazon.

## Run / verify

```bash
npm install
npx prisma migrate dev      # creates SQLite DB at prisma/dev.db
npm run db:seed             # 8 categories, 27 products, demo user
npm run dev                 # http://localhost:3000
npm run build               # production build (TS check + Turbopack)
```

Demo account (created by seed): `demo@silly.planet` / `password123`. Has one preloaded address so checkout works out of the box.

## Stack

- **Next.js 16** App Router, Turbopack, React 19. Note this is Next 16 — APIs differ from Next 14/15 training data. See `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` before editing routing/middleware/config.
- **Prisma 6** + SQLite. Pinned to v6 deliberately — Prisma 7 moves the datasource URL into a separate `prisma.config.ts`; we use the v6 schema-embedded form.
- **NextAuth v5 beta** with Credentials provider, JWT sessions, bcrypt for password hashing.
- **Tailwind v4** (CSS-first config in `globals.css` via `@theme inline`).
- **Radix UI** for `Dialog` and `DropdownMenu`. **lucide-react** icons.
- **Server Actions** for all mutations — no REST endpoints beyond NextAuth's.

## Conventions specific to this repo

- **Async request APIs**: `params`, `searchParams`, and `cookies()` are all Promises. Always `await` them. Page signature: `export default async function Page({ params }: { params: Promise<{ id: string }> })`.
- **`proxy.ts`, not `middleware.ts`**: Next.js 16 renamed it. Auth-protected routes (`/checkout`, `/orders`, `/account`) live in `src/proxy.ts` with a named `proxy` export.
- **JSON arrays in SQLite**: SQLite has no array type. `Product.images` and `Product.bullets` are stored as JSON-encoded strings. Parse with `parseStringArray()` from `src/lib/utils.ts`. Same pattern for `OrderItem.imageSnapshot` and `Order.shippingAddress`.
- **Prices in cents**: All prices are integer cents. Use `formatUSD()` and `splitPrice()` from `src/lib/money.ts`. Shipping is free over $35 (`calcShipping`); tax is 8.75% flat (`calcTax`).
- **Cart dual-mode**: Guests use a JSON cookie (`sp_cart`); signed-in users use the `CartItem` table. `lib/cart.ts:getCartLines` / `addToCart` / `setCartQty` / `removeFromCart` all handle both. On sign-in, NextAuth's `events.signIn` calls `mergeGuestCartIntoUser`.
- **Server actions live in `src/actions/`**, one file per domain (`cart`, `checkout`, `auth`, `addresses`, `wishlist`, `reviews`). They `'use server'` and call `revalidatePath` after mutating.
- **Image domains**: Remote images (currently `picsum.photos`) must be allowlisted in `next.config.ts` under `images.remotePatterns`.

## Layout

```
prisma/
  schema.prisma            User, Address, Category, Product, Review, CartItem,
                           WishlistItem, Order, OrderItem
  seed.ts                  tsx-runnable; idempotent (deletes then reseeds)
src/
  app/
    layout.tsx             Header + Footer + AuthProvider
    page.tsx               Home (hero + tiles + product rails)
    (shop)/                Public product browsing — category, search, PDP
    cart/                  Cart review
    checkout/              Three-step checkout (address, mock payment, review)
    orders/                Orders list + detail (protected)
    account/               Account hub, addresses CRUD, wishlist (protected)
    (auth)/                signin, register
    api/auth/[...nextauth]/route.ts  re-exports handlers from lib/auth-handlers.ts
  components/
    header/                TopNav + SubNav, SearchBar, AccountMenu, CartButton
    footer/                Footer + BackToTop (client component)
    product/               ProductCard, ProductRail, PriceBlock, StarRating
    pdp/                   Gallery, BuyBox, WishlistButton, ReviewForm
    cart/                  CartLine
    checkout/              CheckoutForm
  lib/                     db, auth, auth-handlers, cart, money, utils, validators
  actions/                 cart, checkout, auth, addresses, wishlist, reviews
  proxy.ts                 Auth gate for /checkout, /orders, /account
```

## Theming

Amazon's color palette is in `src/app/globals.css` as Tailwind v4 theme tokens. Headers use `#131921` (top) and `#232f3e` (sub). Primary CTAs use the `.btn-cta` yellow gradient; "Buy Now" uses `.btn-cta-orange`. Prices use `.text-price` (#b12704). The font stack starts with `"Amazon Ember"` then falls back to Helvetica/Arial.

## Auth notes

- `lib/auth.ts` exports `{ handlers, auth, signIn, signOut }` from NextAuth.
- The route handler at `src/app/api/auth/[...nextauth]/route.ts` re-exports from `lib/auth-handlers.ts` (a tiny shim) — this avoids a Next.js bundling issue where importing `signOut` directly from the route module trips up edge bundling.
- `events.signIn` triggers guest-cart merge via `mergeGuestCartIntoUser`.
- The `signOut()` in `AccountMenu` comes from `next-auth/react` (client side).

## Caveats / known limitations

- Payment is mocked. The checkout form's card input always succeeds.
- Product images come from `picsum.photos` (random placeholders) — first paint depends on network.
- `next-auth@beta` produces a `module.register()` deprecation warning on Node 26 — harmless.
- No tests yet. Verification was via dev-server smoke tests + production build.

## When you change something

- **Touched a server action?** Make sure `revalidatePath` covers the affected pages. Cart-related actions revalidate `/`, `/cart`, and the layout (header cart count).
- **Added a new image host?** Add it to `next.config.ts:images.remotePatterns`.
- **Added a protected route?** Add a regex/matcher entry in `src/proxy.ts`.
- **Changed `User`/`Address`/`Order` schema?** Run `npx prisma migrate dev --name <change>` and update `prisma/seed.ts` if needed.

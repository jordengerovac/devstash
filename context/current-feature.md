# Current Feature

## Status

## Goals

## Notes

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Setup** — Next.js 16, Tailwind CSS v4, Typescript Configured (Completed)
- **Dashboard UI Phase 1** — ShadCN UI setup, dark mode, dashboard route with top bar and layout placeholders (Completed)
- **Dashboard UI Phase 2** — Collapsible sidebar with item type links, favorite/recent collections, user avatar, mobile drawer (Completed)
- **Dashboard UI Phase 3** — Stats cards, collections grid, pinned items, and 10 recent items sections with mock data (Completed)
- **Database Setup** — Prisma 7 + Neon PostgreSQL: schema with all models and NextAuth types, initial migration, system item type seed, db test script (Completed)
- **Sample Data Seed** — Demo user, 5 collections, 18 items (snippets, prompts, commands, links) seeded via prisma/seed.ts (Completed)
- **Dashboard Collections** — Real collections fetched from Neon DB via Prisma, dominant type border color on cards, type preview icons, async server component (Completed)
- **Dashboard Items** — Real pinned and recent items fetched from Neon DB via Prisma, item type icon/border color, tag display, live stats cards, no pinned section when empty (Completed)
- **Stats & Sidebar** — Live stats from DB, system item types with icons and counts in sidebar, colored dot for recent collections, star for favorites, "View all collections" link (Completed)
- **Pro Badge Sidebar** — ShadCN Badge on File and Image item types in sidebar, outline style, PRO uppercase, isPro flag derived in data layer (Completed)
- **Code Audit Fixes** — Wrapped getDemoUserId and getDemoCollections with React cache() to eliminate redundant DB queries, added take:20 and _count to getCollections, extracted shared getItemTypeIcon utility replacing three duplicate iconMap declarations (Completed)
- **Auth Phase 1** — NextAuth v5 with GitHub OAuth: split config pattern, Prisma adapter, JWT strategy, proxy-based dashboard route protection, Session type extension (Completed)
- **Auth Phase 2** — Credentials provider with email/password: bcrypt validation in auth.ts, Credentials placeholder in auth.config.ts for Edge safety, POST /api/auth/register with validation and hashing (Completed)
- **Auth Phase 3** — Custom /sign-in and /register pages, reusable UserAvatar component (image or initials), sidebar user section with real session data and sign-out dropdown (Completed)
- **Email Verification** — Resend integration: verification token generated on register, email sent with 24h link, /api/auth/verify-email validates and marks emailVerified, /verify-email and /email-verified pages, credentials sign-in blocked until verified (Completed)
- **Email Verification Toggle** — EMAIL_VERIFICATION_ENABLED env flag: when false, users are auto-verified on register and signIn skips the verified check; defaults to enabled (Completed)
- **Forgot Password** — /forgot-password page + POST /api/auth/forgot-password sends Resend email with 1h reset link; /reset-password?token= validates VerificationToken (password-reset: prefix), updates hashed password, redirects to /sign-in with success banner; OAuth-only users silently skipped (Completed)
- **Profile Page** — /profile route with user info (avatar, name, email, member since), usage stats (total items/collections + per-type breakdown), change password form (email users only), delete account with email-confirmation dialog; fixed session.user.id missing from JWT via session callback (Completed)
- **Rate Limiting** — Upstash Redis sliding window rate limiting on register (3/1h), forgot-password (3/1h), reset-password (5/15min), and login via server action (5/15min IP+email); reusable src/lib/rate-limit.ts utility with fail-open behavior; 429 responses include Retry-After header (Completed)
- **Items List View** — Dynamic `/items/[type]` route with type-filtered items grid: 2-col responsive ItemCard layout, left border colored by item type, getItemsByType() DB function, shared items layout with DashboardShell (Completed)
- **Items List 3-Column Layout** — Items grid updated to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`; 3 columns on lg+ screens, 2 on md, 1 on mobile (Completed)
- **Item Drawer** — Right-side Sheet drawer opens on ItemCard/ItemRow click; fetches full item detail via GET /api/items/[id]; action bar (Favorite, Pin, Copy, Edit, Delete), description, content, tags, collections, dates, loading skeleton; ItemDrawerProvider + context wired into dashboard and items list pages (Completed)
- **Item Drawer Edit Mode** — Inline edit mode in the item drawer: Edit toggles to editable inputs (title, description, tags, type-specific fields), Save/Cancel replace the action bar, updateItem server action with Zod validation, tag disconnect/reconnect, router.refresh() on save (Completed)
- **Item Delete** — Delete button in item drawer triggers ShadCN AlertDialog confirmation; deleteItem server action with ownership check; success closes drawer and refreshes list with toast; error surfaces as toast without closing (Completed)
- **Item Create** — "New Item" button in top bar opens a Dialog modal; type selector (snippet, prompt, command, note, link) with dynamic fields per type; createItem server action with Zod validation; toast on success, modal closes and list refreshes (Completed)

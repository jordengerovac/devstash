# Current Feature: Email Verification Toggle

## Status

In Progress

## Goals

- Add an `EMAIL_VERIFICATION_ENABLED` env variable (`true` | `false`) that controls whether email verification is required
- When disabled: skip token creation and email sending on register; set `emailVerified` on the user immediately so they can sign in right away
- When disabled: skip the email-verified check in the `signIn` callback in `src/auth.ts`
- When enabled: existing behavior is unchanged
- Add the variable to `.env.example` (or `.env.local`) with a comment explaining its purpose

## Notes

- Resend is not yet linked to a custom domain, so only the Resend account email can receive verification emails during development — disabling verification unblocks local testing with any email address
- Touch points: `src/app/api/auth/register/route.ts` and `src/auth.ts`
- A single helper `src/lib/email-verification.ts` (or inline check) reading `process.env.EMAIL_VERIFICATION_ENABLED !== "false"` keeps the flag in one place
- No UI needed — this is a server-side / env-level toggle

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

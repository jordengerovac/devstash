# Current Feature: Email Verification on Register

## Status

In Progress

## Goals

- Send a verification email via Resend when a new user registers with email/password
- Email contains a unique, time-limited verification link the user must click
- Store email verification tokens in the database (token, expiry, userId)
- Add a route/handler that validates the token and marks the user's email as verified
- Block or warn unverified users from accessing the app until they verify (redirect or notice)
- Show appropriate UI feedback: "Check your email" after register, "Email verified" after clicking link
- Resend integration uses the `RESEND_API_KEY` from `.env`

## Notes

- Using Resend for email delivery (`RESEND_API_KEY` already in `.env`)
- Verification tokens should expire (e.g. 24 hours)
- Tokens should be single-use — invalidate after successful verification
- Must add a `emailVerified` field and a `VerificationToken` model to the Prisma schema (NextAuth already has `emailVerified` on `User`)
- Do not use NextAuth's built-in email provider — this is a custom credentials flow
- Follow existing auth patterns: split config, Prisma adapter, server actions where appropriate

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

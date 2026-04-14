# Current Feature — Auth Phase 3: Sign In, Register & Sign Out UI

## Status

In Progress

## Goals

- Replace NextAuth default pages with custom `/sign-in` page (email/password + GitHub OAuth + link to register)
- Build custom `/register` page (name, email, password, confirm password with validation)
- Update bottom of sidebar: user avatar, name, dropdown with "Sign out", clicking avatar goes to `/profile`
- Avatar shows GitHub image if available, otherwise initials fallback (e.g. "Brad Traversy" → "BT")
- Create a reusable avatar component that handles both cases

## Notes

### Sign In Page (`/sign-in`)
- Email and password input fields
- "Sign in with GitHub" button
- Link to register page
- Form validation and error display

### Register Page (`/register`)
- Name, email, password, confirm password fields
- Form validation (passwords match, email format)
- Submit to `/api/auth/register`
- Redirect to sign-in on success

### Bottom Of Sidebar
- Display user avatar (GitHub image or initials fallback)
- Display user name
- Dropdown/up on avatar click with "Sign out" link
- Clicking on the icon should go to "/profile"

### Avatar Logic
- If user has `image` (from GitHub): use that
- Otherwise: generate initials from name (e.g., "Brad Traversy" → "BT")

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

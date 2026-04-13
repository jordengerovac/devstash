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

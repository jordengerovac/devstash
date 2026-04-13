# Current Feature

## Status
In Progress

## Goals
Fix the top 3 priority issues identified in the code audit:

1. **Wrap `getDemoUserId` and `getDemoCollections` with React `cache()`** — eliminates 4–5 redundant DB queries per page load. Both functions are called independently by multiple components on the same render pass.

2. **Add `take` limit + `_count` to `getCollections`** — currently fetches every item with full type data for every collection, unbounded. Replace with `take: 20` on the items include and `_count: { select: { items: true } }` for the item count.

3. **Extract `iconMap` to a shared utility** — the same `iconMap` object is copy-pasted in `Sidebar.tsx`, `ItemRow.tsx`, and `CollectionCard.tsx`. Extract to `src/lib/item-type-icons.ts` and import from a single source of truth.

## Notes
- React `cache()` deduplicates identical calls within a single server render pass — the fix for issues 1 is a one-liner per function
- For issue 2, use `collection._count.items` for the item count display instead of `collection.items.length`
- For issue 3, export a `getItemTypeIcon(iconName)` helper from the shared file so components don't access `iconMap` directly

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

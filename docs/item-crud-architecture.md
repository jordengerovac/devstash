# Item CRUD Architecture

A unified CRUD system for all 7 item types. One set of actions, one route, shared components that adapt by type.

---

## Design Principles

- **Mutations in one file** — `src/actions/items.ts` handles create, update, delete, and toggle operations for every type. Actions do not branch by type; they write whichever fields are populated.
- **Queries in `lib/db`** — data fetching stays in `src/lib/db/items.ts`, called directly from server components (no client fetching).
- **Type-specific logic in components** — the form renders different fields based on `contentType`; the card displays different content based on `contentType`. The action layer never needs to know which type it is.
- **One dynamic route** — `/items/[type]` resolves the slug to a `typeId` and passes it to a shared page component.

---

## File Structure

```
src/
  actions/
    items.ts                    # create, update, delete, toggleFavorite, togglePinned

  lib/
    db/
      items.ts                  # (existing) + getItemsByType, getItemById
    item-type-icons.ts          # (existing) icon resolver
    item-type-map.ts            # slug → typeId + contentType mapping

  types/
    items.ts                    # shared Item* interfaces used across layers

  app/
    (dashboard)/
      items/
        [type]/
          page.tsx              # server component — fetches items by type slug

  components/
    items/
      ItemsPageHeader.tsx       # page title, item count, "New [Type]" button
      ItemsGrid.tsx             # grid/list of ItemCard components
      ItemCard.tsx              # single item card — adapts by contentType
      ItemDrawer.tsx            # quick-open detail + edit drawer (client component)
      ItemForm.tsx              # create/edit form — renders correct field group
      fields/
        TextFields.tsx          # content + language (snippet, prompt, note, command)
        UrlFields.tsx           # url field (link)
        FileFields.tsx          # file upload (file, image) — Pro only
```

---

## Routing — `/items/[type]`

The `[type]` segment is the **plural lowercase slug** as shown in the sidebar.

### Slug → Type Mapping

Defined in `src/lib/item-type-map.ts` and used by both the page and the actions:

```ts
// src/lib/item-type-map.ts
export const ITEM_TYPE_MAP: Record<string, { typeId: string; contentType: 'text' | 'url' | 'file'; label: string }> = {
  snippets: { typeId: 'system-snippet', contentType: 'text',  label: 'Snippet' },
  prompts:  { typeId: 'system-prompt',  contentType: 'text',  label: 'Prompt'  },
  notes:    { typeId: 'system-note',    contentType: 'text',  label: 'Note'    },
  commands: { typeId: 'system-command', contentType: 'text',  label: 'Command' },
  links:    { typeId: 'system-link',    contentType: 'url',   label: 'Link'    },
  files:    { typeId: 'system-file',    contentType: 'file',  label: 'File'    },
  images:   { typeId: 'system-image',   contentType: 'file',  label: 'Image'   },
}
```

### Page Component

```tsx
// src/app/(dashboard)/items/[type]/page.tsx  (server component)
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { ITEM_TYPE_MAP } from '@/lib/item-type-map'
import { getItemsByType } from '@/lib/db/items'
import { ItemsPageHeader } from '@/components/items/ItemsPageHeader'
import { ItemsGrid } from '@/components/items/ItemsGrid'

export default async function ItemsPage({ params }: { params: { type: string } }) {
  const meta = ITEM_TYPE_MAP[params.type]
  if (!meta) notFound()

  const session = await auth()
  const items = await getItemsByType(session!.user.id, meta.typeId)

  return (
    <div className="space-y-6 max-w-6xl">
      <ItemsPageHeader label={meta.label} count={items.length} typeSlug={params.type} />
      <ItemsGrid items={items} contentType={meta.contentType} typeSlug={params.type} />
    </div>
  )
}
```

The page is a thin server component. It resolves the slug, fetches data, and delegates rendering to shared components.

---

## Data Layer — `src/lib/db/items.ts`

Two new functions added to the existing file:

```ts
// Get all items of a specific type for the list page
export async function getItemsByType(
  userId: string,
  typeId: string
): Promise<ItemWithMeta[]>

// Get a single full item for the drawer/edit view
export async function getItemById(
  userId: string,
  id: string
): Promise<ItemFull | null>
```

`ItemFull` extends `ItemWithMeta` with the full content fields (`content`, `url`, `fileUrl`, `fileName`, `fileSize`, `language`) needed by the drawer and form.

Queries stay in `lib/db`, not in server actions or components.

---

## Actions — `src/actions/items.ts`

Single `"use server"` file for all item mutations. All functions:
1. Call `auth()` to get the session — return `{ error: "Not authenticated" }` if missing
2. Validate input with Zod
3. Verify the item belongs to the user before update/delete
4. Return `{ success: true, data? }` or `{ error: string }`

```ts
"use server"

// Create a new item — works for all contentTypes
export async function createItem(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState>

// Update an existing item
export async function updateItem(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState>

// Delete an item
export async function deleteItem(id: string): Promise<ActionState>

// Toggle isFavorite or isPinned
export async function toggleItemFlag(
  id: string,
  flag: 'isFavorite' | 'isPinned',
  value: boolean
): Promise<ActionState>
```

### Why actions don't branch by type

The `Item` schema stores `content`, `url`, and `fileUrl` as nullable fields — only the relevant one is populated per `contentType`. `createItem` and `updateItem` simply read whichever fields are present in the `FormData` and write them. There is no `if type === 'snippet'` logic in the action.

---

## Components

### `ItemsPageHeader`

Server component. Renders the page title (e.g. "Snippets"), item count badge, and a "New Snippet" button that opens `ItemDrawer` in create mode.

### `ItemsGrid`

Server component. Receives `items` and renders an `ItemCard` for each. Handles empty state.

### `ItemCard`

Server component (or client if drawer-open is managed here). Displays:
- Type icon + color (left border or icon badge)
- Title
- Type-specific preview:
  - `"text"`: first line of `content`, optional language badge
  - `"url"`: the URL hostname + `description`
  - `"file"`: `fileName` + formatted `fileSize`
- Tags
- Favorite star
- Relative timestamp

### `ItemDrawer`

Client component (`"use client"`). Opened by clicking a card or the "New" button. Manages open/close state and whether it is in create or edit mode. Contains `ItemForm`.

### `ItemForm`

Client component. Receives `contentType` and renders:
- Common fields: `title`, `description`, tags (all types)
- Type-specific field group: one of `TextFields`, `UrlFields`, or `FileFields`
- Submit calls the `createItem` or `updateItem` server action via `useActionState`

### Field Group Components

| Component | Used by | Fields |
| --------- | ------- | ------ |
| `TextFields` | Snippet, Prompt, Note, Command | `content` (textarea/markdown editor), `language` (select, shown for Snippet/Command) |
| `UrlFields` | Link | `url` (text input) |
| `FileFields` | File, Image | file picker, shows `fileName` + `fileSize` on edit |

This is the **only place** type-specific branching happens.

---

## Data Flow Summary

```
User clicks "New Snippet"
  → ItemsPageHeader button → opens ItemDrawer (create mode)
  → ItemDrawer renders ItemForm with contentType="text"
  → ItemForm renders TextFields (content + language)
  → User submits → createItem() server action
  → createItem validates → prisma.item.create
  → Router refreshes → getItemsByType() re-fetches → ItemsGrid updates

User clicks an ItemCard
  → ItemDrawer opens (view/edit mode)
  → getItemById() fetch (or data already in card props)
  → ItemForm pre-populated → User edits → updateItem()

User deletes from drawer
  → deleteItem() → router.refresh()
```

---

## Type Interfaces (`src/types/items.ts`)

```ts
// Minimal shape used in lists and cards
export interface ItemWithMeta {
  id: string
  title: string
  description: string | null
  contentType: 'text' | 'url' | 'file'
  language: string | null
  isFavorite: boolean
  isPinned: boolean
  tags: string[]
  type: { id: string; name: string; icon: string | null; color: string | null }
  createdAt: string
}

// Full shape used in drawer/edit — extends ItemWithMeta
export interface ItemFull extends ItemWithMeta {
  content: string | null
  url: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
}

// Shared server action return type
export type ActionState = { success?: boolean; data?: ItemFull; error?: string } | null
```

---

## What Does NOT Go in Actions

- Type icon or color lookups — those are display concerns, handled in components via `getItemTypeIcon()`
- Content preview/truncation — handled in `ItemCard`
- File upload to R2 — upload happens client-side (or via a dedicated route handler) before `createItem` is called; the action only receives the resulting `fileUrl`
- Pro gating enforcement at the UI level — the action enforces it: check `session.user.isPro` before creating File/Image items during the Pro phase

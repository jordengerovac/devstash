# Item Types

DevStash has 7 built-in system item types. System types are seeded into the database with stable IDs (`system-snippet`, `system-prompt`, etc.) and cannot be deleted by users. Pro users can additionally create custom types.

---

## Type Reference

### Snippet

| Property | Value |
| -------- | ----- |
| DB ID    | `system-snippet` |
| Icon     | `Code` (Lucide) |
| Color    | Blue — `#3b82f6` |
| Pro Only | No |
| `contentType` | `"text"` |

**Purpose:** Reusable blocks of source code in any language (TypeScript, Python, SQL, YAML, etc.).

**Key fields used:**
- `content` — the code text
- `language` — syntax highlighting hint (e.g. `"typescript"`, `"bash"`, `"yaml"`)
- `title` — short descriptive name

---

### Prompt

| Property | Value |
| -------- | ----- |
| DB ID    | `system-prompt` |
| Icon     | `Sparkles` (Lucide) |
| Color    | Purple — `#8b5cf6` |
| Pro Only | No |
| `contentType` | `"text"` |

**Purpose:** AI prompts and system messages — code review templates, documentation generators, refactoring assistants, etc.

**Key fields used:**
- `content` — the prompt text (markdown supported)
- `language` — typically `null` (prompts are plain text)
- `title` — prompt name or intent

---

### Note

| Property | Value |
| -------- | ----- |
| DB ID    | `system-note` |
| Icon     | `StickyNote` (Lucide) |
| Color    | Yellow — `#fde047` |
| Pro Only | No |
| `contentType` | `"text"` |

**Purpose:** Free-form markdown notes — project notes, documentation drafts, meeting notes, checklists.

**Key fields used:**
- `content` — markdown text
- `language` — typically `null`
- `description` — optional summary

---

### Command

| Property | Value |
| -------- | ----- |
| DB ID    | `system-command` |
| Icon     | `Terminal` (Lucide) |
| Color    | Orange — `#f97316` |
| Pro Only | No |
| `contentType` | `"text"` |

**Purpose:** Shell commands, scripts, and CLI sequences for git, Docker, npm, deployment workflows, etc.

**Key fields used:**
- `content` — the command(s) text
- `language` — typically `"bash"` or shell dialect
- `title` — describes what the command does

---

### Link

| Property | Value |
| -------- | ----- |
| DB ID    | `system-link` |
| Icon     | `Link` (Lucide) |
| Color    | Emerald — `#10b981` |
| Pro Only | No |
| `contentType` | `"url"` |

**Purpose:** Bookmarked URLs — documentation sites, tools, references, design systems, icon libraries.

**Key fields used:**
- `url` — the destination URL
- `description` — short description of what the link points to
- `content` — `null` (not used for URL items)
- `language` — `null`

---

### File

| Property | Value |
| -------- | ----- |
| DB ID    | `system-file` |
| Icon     | `File` (Lucide) |
| Color    | Gray — `#6b7280` |
| Pro Only | **Yes** |
| `contentType` | `"file"` |

**Purpose:** Uploaded binary or document files stored in Cloudflare R2 (PDFs, templates, config files, etc.).

**Key fields used:**
- `fileUrl` — Cloudflare R2 URL
- `fileName` — original filename
- `fileSize` — size in bytes
- `content` — `null`
- `url` — `null`

---

### Image

| Property | Value |
| -------- | ----- |
| DB ID    | `system-image` |
| Icon     | `Image` (Lucide) |
| Color    | Pink — `#ec4899` |
| Pro Only | **Yes** |
| `contentType` | `"file"` |

**Purpose:** Uploaded image files stored in Cloudflare R2 (screenshots, diagrams, design references, etc.).

**Key fields used:**
- `fileUrl` — Cloudflare R2 URL
- `fileName` — original filename
- `fileSize` — size in bytes
- `content` — `null`
- `url` — `null`

---

## Summaries

### Content Classification

Items are classified into three mutually exclusive content modes via the `contentType` field on `Item`:

| `contentType` | Types | Storage |
| ------------- | ----- | ------- |
| `"text"` | Snippet, Prompt, Note, Command | `content` field (Postgres `Text`) |
| `"url"` | Link | `url` field |
| `"file"` | File, Image | `fileUrl`, `fileName`, `fileSize` via Cloudflare R2 |

### Shared Properties

All item types share these fields on the `Item` model:

| Field | Description |
| ----- | ----------- |
| `id` | cuid primary key |
| `title` | Display name |
| `description` | Optional short description |
| `isFavorite` | Starred by user |
| `isPinned` | Pinned to top of lists |
| `typeId` | FK → `ItemType.id` |
| `userId` | FK → `User.id` |
| `tags` | Many-to-many via `ItemTag` |
| `collections` | Many-to-many via `ItemCollection` |
| `createdAt` / `updatedAt` | Timestamps |

### Display Differences

| Type | Border Color | Icon | Shows Language Badge | Shows URL | Shows File Info |
| ---- | ------------ | ---- | -------------------- | --------- | --------------- |
| Snippet | Blue | `Code` | Yes | No | No |
| Prompt | Purple | `Sparkles` | No | No | No |
| Note | Yellow | `StickyNote` | No | No | No |
| Command | Orange | `Terminal` | Yes (`bash`) | No | No |
| Link | Emerald | `Link` | No | Yes | No |
| File | Gray | `File` | No | No | Yes (name, size) |
| Image | Pink | `Image` | No | No | Yes (name, size) |

### Pro Gating

File and Image are the only Pro-only system types. In the sidebar they display an outlined `PRO` badge. During development, all users have access to all features regardless of `isPro`.

### URL Routes

Item type list pages follow the pattern `/items/{type-name-plural}`:

| Type | Route |
| ---- | ----- |
| Snippet | `/items/snippets` |
| Prompt | `/items/prompts` |
| Note | `/items/notes` |
| Command | `/items/commands` |
| Link | `/items/links` |
| File | `/items/files` |
| Image | `/items/images` |

### Icon Utility

Icons are resolved at runtime from the `icon` string stored in `ItemType` via `src/lib/item-type-icons.ts`:

```ts
getItemTypeIcon(iconName: string | null | undefined): ElementType
```

Falls back to the `File` icon for unknown or `null` icon names.

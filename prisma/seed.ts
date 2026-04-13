import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ─── System Item Types ────────────────────────────────────────────────────────

const SYSTEM_TYPES = [
  { name: "Snippet", icon: "Code",       color: "#3b82f6" },
  { name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6" },
  { name: "Note",    icon: "StickyNote", color: "#fde047" },
  { name: "Command", icon: "Terminal",   color: "#f97316" },
  { name: "Link",    icon: "Link",       color: "#10b981" },
  { name: "File",    icon: "File",       color: "#6b7280" },
  { name: "Image",   icon: "Image",      color: "#ec4899" },
]

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_EMAIL = "demo@devstash.io"

const COLLECTIONS = [
  { key: "react",    name: "React Patterns",     description: "Reusable React patterns and hooks" },
  { key: "ai",       name: "AI Workflows",        description: "AI prompts and workflow automations" },
  { key: "devops",   name: "DevOps",              description: "Infrastructure and deployment resources" },
  { key: "terminal", name: "Terminal Commands",   description: "Useful shell commands for everyday development" },
  { key: "design",   name: "Design Resources",    description: "UI/UX resources and references" },
]

const ITEMS = [
  // ── React Patterns ──────────────────────────────────────────────────────────
  {
    collection: "react",
    title: "useDebounce & useLocalStorage Hooks",
    contentType: "text",
    language: "typescript",
    content: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}`,
  },
  {
    collection: "react",
    title: "Context Provider + useContext Pattern",
    contentType: "text",
    language: "typescript",
    content: `import { createContext, useContext, useState } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}`,
  },
  {
    collection: "react",
    title: "cn, formatDate & truncate Utilities",
    contentType: "text",
    language: "typescript",
    content: `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  return str.length > length ? \`\${str.slice(0, length)}...\` : str
}`,
  },

  // ── AI Workflows ─────────────────────────────────────────────────────────────
  {
    collection: "ai",
    title: "Code Review Prompt",
    contentType: "text",
    language: null,
    content: `Review the following code for:
1. Logic errors and edge cases
2. Performance issues (unnecessary re-renders, N+1 queries)
3. Security vulnerabilities (XSS, injection, missing auth checks)
4. Code clarity and naming conventions
5. Missing error handling

Format your response as:
- **Issue**: description
- **Severity**: low | medium | high
- **Fix**: suggested improvement

Code to review:
[PASTE CODE HERE]`,
  },
  {
    collection: "ai",
    title: "Documentation Generator",
    contentType: "text",
    language: null,
    content: `Generate comprehensive documentation for the following code:

1. A brief description of what it does
2. Parameters/props — name, type, and description for each
3. Return value description
4. Usage examples (2–3 realistic examples)
5. Edge cases and known limitations

Format as JSDoc comments. Be concise but complete.

Code:
[PASTE CODE HERE]`,
  },
  {
    collection: "ai",
    title: "Refactoring Assistant",
    contentType: "text",
    language: null,
    content: `Refactor the following code to improve:
- Readability and maintainability
- Performance where applicable
- TypeScript types (strict mode, no any)
- React best practices (if applicable)

Constraints:
- Do not change external behavior or the public API
- Preserve the existing file structure
- Briefly explain each change you make

Code to refactor:
[PASTE CODE HERE]`,
  },

  // ── DevOps ───────────────────────────────────────────────────────────────────
  {
    collection: "devops",
    title: "Docker Compose — App + Postgres",
    contentType: "text",
    language: "yaml",
    content: `version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: \${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`,
  },
  {
    collection: "devops",
    title: "Vercel Production Deploy",
    contentType: "text",
    language: "bash",
    content: `# Pull env vars and deploy to production
vercel env pull .env.production.local
npm run build
vercel deploy --prebuilt --prod`,
  },
  {
    collection: "devops",
    title: "Docker Hub",
    contentType: "url",
    language: null,
    url: "https://hub.docker.com/",
    description: "Official Docker image registry",
  },
  {
    collection: "devops",
    title: "GitHub Actions Docs",
    contentType: "url",
    language: null,
    url: "https://docs.github.com/en/actions",
    description: "CI/CD workflows with GitHub Actions",
  },

  // ── Terminal Commands ─────────────────────────────────────────────────────────
  {
    collection: "terminal",
    title: "Git — Undo, Rebase & Branch Cleanup",
    contentType: "text",
    language: "bash",
    content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Interactive rebase last N commits
git rebase -i HEAD~3

# Delete all local branches already merged into main
git branch --merged main | grep -v "\\* main" | xargs git branch -d

# Stash including untracked files
git stash push -u -m "wip: description"`,
  },
  {
    collection: "terminal",
    title: "Docker — Cleanup Commands",
    contentType: "text",
    language: "bash",
    content: `# Stop and remove all containers
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

# Remove all unused images, containers, networks and volumes
docker system prune -af --volumes

# Tail logs for a running container
docker logs -f --tail 100 <container_name>

# Open a shell inside a running container
docker exec -it <container_name> /bin/sh`,
  },
  {
    collection: "terminal",
    title: "Kill Process on Port",
    contentType: "text",
    language: "bash",
    content: `# Find what is using a port (macOS / Linux)
lsof -i :3000

# Kill the process on that port
kill -9 $(lsof -t -i:3000)

# Windows equivalent
netstat -ano | findstr :3000
taskkill /PID <PID> /F`,
  },
  {
    collection: "terminal",
    title: "npm / Package Manager Utilities",
    contentType: "text",
    language: "bash",
    content: `# Check for outdated packages
npm outdated

# Interactively upgrade all packages to latest
npx npm-check-updates -u && npm install

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force

# Find which package depends on a module
npm why <package-name>`,
  },

  // ── Design Resources ──────────────────────────────────────────────────────────
  {
    collection: "design",
    title: "Tailwind CSS Docs",
    contentType: "url",
    language: null,
    url: "https://tailwindcss.com/docs",
    description: "Official Tailwind CSS documentation",
  },
  {
    collection: "design",
    title: "shadcn/ui",
    contentType: "url",
    language: null,
    url: "https://ui.shadcn.com",
    description: "Beautifully designed accessible component library",
  },
  {
    collection: "design",
    title: "Material Design 3",
    contentType: "url",
    language: null,
    url: "https://m3.material.io",
    description: "Google's design system — tokens, components, and guidelines",
  },
  {
    collection: "design",
    title: "Lucide Icons",
    contentType: "url",
    language: null,
    url: "https://lucide.dev",
    description: "Open-source icon library used throughout DevStash",
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Upsert system item types
  console.log("Seeding system item types...")
  for (const type of SYSTEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id: `system-${type.name.toLowerCase()}` },
      update: { icon: type.icon, color: type.color },
      create: {
        id:       `system-${type.name.toLowerCase()}`,
        name:     type.name,
        icon:     type.icon,
        color:    type.color,
        isSystem: true,
        userId:   null,
      },
    })
    console.log(`  ✓ ${type.name}`)
  }

  // 2. Upsert demo user
  console.log("\nSeeding demo user...")
  const hashedPassword = await bcrypt.hash("12345678", 12)
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email:         DEMO_EMAIL,
      name:          "Demo User",
      password:      hashedPassword,
      isPro:         false,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✓ ${user.email}`)

  // 3. Wipe existing demo collections + items (idempotent re-runs)
  console.log("\nCleaning up existing demo data...")
  await prisma.item.deleteMany({ where: { userId: user.id } })
  await prisma.collection.deleteMany({ where: { userId: user.id } })
  console.log("  ✓ Cleared")

  // 4. Create collections
  console.log("\nCreating collections...")
  const collectionMap: Record<string, string> = {}
  for (const col of COLLECTIONS) {
    const created = await prisma.collection.create({
      data: {
        name:        col.name,
        description: col.description,
        userId:      user.id,
      },
    })
    collectionMap[col.key] = created.id
    console.log(`  ✓ ${col.name}`)
  }

  // 5. Create items and link to collections
  console.log("\nCreating items...")
  for (const item of ITEMS) {
    const typeKey = item.contentType === "url"
      ? "system-link"
      : item.language === "yaml" || item.language === "bash"
        ? item.language === "bash" && item.collection === "terminal"
          ? "system-command"
          : item.language === "bash" && item.collection === "devops"
            ? "system-command"
            : "system-snippet"
        : item.collection === "ai"
          ? "system-prompt"
          : "system-snippet"

    await prisma.item.create({
      data: {
        title:       item.title,
        contentType: item.contentType,
        content:     item.contentType !== "url" ? item.content ?? null : null,
        url:         item.contentType === "url" ? (item as { url: string }).url : null,
        description: "description" in item ? (item.description as string) : null,
        language:    item.language ?? null,
        userId:      user.id,
        typeId:      typeKey,
        collections: {
          create: [{ collectionId: collectionMap[item.collection] }],
        },
      },
    })
    console.log(`  ✓ ${item.title}`)
  }

  console.log("\nDone.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Testing database connection...\n")

  // Connection check
  await prisma.$queryRaw`SELECT 1`
  console.log("✓ Connected to Neon PostgreSQL\n")

  // System item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  })
  console.log(`✓ System item types (${itemTypes.length}):`)
  for (const t of itemTypes) {
    console.log(`    ${t.icon?.padEnd(12)} ${t.name.padEnd(10)} ${t.color}`)
  }

  // Demo user
  console.log()
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      _count: { select: { items: true, collections: true } },
    },
  })

  if (!user) {
    console.log("✗ Demo user not found — run: npm run db:seed")
    return
  }

  console.log("✓ Demo user:")
  console.log(`    email:       ${user.email}`)
  console.log(`    name:        ${user.name}`)
  console.log(`    verified:    ${user.emailVerified?.toISOString().split("T")[0]}`)
  console.log(`    isPro:       ${user.isPro}`)
  console.log(`    collections: ${user._count.collections}`)
  console.log(`    items:       ${user._count.items}`)

  // Collections with items
  console.log()
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: {
      items: {
        include: { item: { include: { type: true } } },
        orderBy: { addedAt: "asc" },
      },
    },
  })

  console.log(`✓ Collections (${collections.length}):`)
  for (const col of collections) {
    console.log(`\n    ${col.name}  (${col.items.length} items)`)
    for (const { item } of col.items) {
      const label = item.contentType === "url" ? item.url! : item.language ?? item.contentType
      console.log(`      · [${item.type.name.padEnd(8)}]  ${item.title}  — ${label}`)
    }
  }

  console.log("\nAll checks passed.")
}

main()
  .catch((e) => {
    console.error("Database test failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

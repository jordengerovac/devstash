import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Testing database connection...\n")

  // Verify connection
  await prisma.$queryRaw`SELECT 1`
  console.log("✓ Connected to Neon PostgreSQL\n")

  // Fetch system item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  })

  console.log(`✓ Found ${itemTypes.length} system item types:`)
  for (const type of itemTypes) {
    console.log(`    ${type.icon?.padEnd(12)} ${type.name.padEnd(10)} ${type.color}`)
  }

  // Count all tables
  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ])

  console.log("\n✓ Table row counts:")
  console.log(`    users:       ${users}`)
  console.log(`    items:       ${items}`)
  console.log(`    collections: ${collections}`)
  console.log(`    tags:        ${tags}`)

  console.log("\nAll checks passed.")
}

main()
  .catch((e) => {
    console.error("Database test failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

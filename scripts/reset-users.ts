/**
 * Deletes all users and their content except for demo@devstash.io.
 *
 * Usage:
 *   npm run db:reset-users            # delete non-demo users
 *   npm run db:reset-users -- --dry-run  # preview without deleting
 */

import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const DEMO_EMAIL = "demo@devstash.io"
const isDryRun = process.argv.includes("--dry-run")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  if (isDryRun) console.log("--- DRY RUN — no changes will be made ---\n")

  // Confirm demo user exists before touching anything
  const demoUser = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })
  if (!demoUser) {
    console.error(`✗ Demo user (${DEMO_EMAIL}) not found — aborting.`)
    process.exit(1)
  }

  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: DEMO_EMAIL } },
    select: {
      id: true,
      email: true,
      _count: { select: { items: true, collections: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  if (usersToDelete.length === 0) {
    console.log("Nothing to delete — no non-demo users found.")
    return
  }

  console.log(`Users to delete (${usersToDelete.length}):`)
  for (const u of usersToDelete) {
    console.log(
      `  · ${(u.email ?? "(no email)").padEnd(30)}  ${u._count.items} items  ${u._count.collections} collections`
    )
  }

  const emails = usersToDelete.map((u) => u.email).filter(Boolean) as string[]
  const tokenCount = await prisma.verificationToken.count({
    where: { identifier: { in: emails } },
  })
  if (tokenCount > 0) {
    console.log(`  · ${tokenCount} verification token(s)`)
  }

  if (isDryRun) {
    console.log("\nDry run complete — rerun without --dry-run to apply.")
    return
  }

  // Delete orphaned verification tokens first (no FK cascade for these)
  if (tokenCount > 0) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: { in: emails } },
    })
  }

  // Deleting users cascades to: items, collections, accounts, sessions,
  // custom itemTypes, and join tables (ItemCollection, ItemTag).
  const { count: deleted } = await prisma.user.deleteMany({
    where: { email: { not: DEMO_EMAIL } },
  })

  console.log(`\n✓ Deleted ${deleted} user(s) and all their content.`)
  if (tokenCount > 0) console.log(`✓ Deleted ${tokenCount} verification token(s).`)
  console.log(`✓ Demo user (${DEMO_EMAIL}) preserved.`)
}

main()
  .catch((e) => {
    console.error("Script failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

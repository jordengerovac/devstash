import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const SYSTEM_TYPES = [
  { name: "Snippet", icon: "Code",       color: "#3b82f6" },
  { name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6" },
  { name: "Note",    icon: "StickyNote", color: "#fde047" },
  { name: "Command", icon: "Terminal",   color: "#f97316" },
  { name: "Link",    icon: "Link",       color: "#10b981" },
  { name: "File",    icon: "File",       color: "#6b7280" },
  { name: "Image",   icon: "Image",      color: "#ec4899" },
]

async function main() {
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

  console.log("Done.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

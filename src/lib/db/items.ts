import { prisma } from '@/lib/prisma';

export interface ItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  typeId: string;
  type: ItemType;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

type PrismaItemWithRelations = Awaited<ReturnType<typeof fetchItems>>[number];

async function fetchItems(userId: string, where: object = {}) {
  return prisma.item.findMany({
    where: { userId, ...where },
    orderBy: { createdAt: 'desc' },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
  });
}

function mapItem(item: PrismaItemWithRelations): ItemWithMeta {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    typeId: item.typeId,
    type: item.type,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    createdAt: item.createdAt.toISOString(),
  };
}

export async function getPinnedItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await fetchItems(userId, { isPinned: true });
  return items.map(mapItem);
}

export async function getRecentItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
  });
  return items.map(mapItem);
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
  isPro: boolean;
}

export async function getSystemItemTypesWithCounts(userId: string): Promise<SidebarItemType[]> {
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      items: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  const PRO_TYPE_NAMES = new Set(['File', 'Image']);

  return itemTypes.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    count: type.items.length,
    isPro: PRO_TYPE_NAMES.has(type.name),
  }));
}

// Temporary: uses demo user until auth is wired up
async function getDemoUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function getDemoPinnedItems(): Promise<ItemWithMeta[]> {
  const userId = await getDemoUserId();
  if (!userId) return [];
  return getPinnedItems(userId);
}

export async function getDemoRecentItems(): Promise<ItemWithMeta[]> {
  const userId = await getDemoUserId();
  if (!userId) return [];
  return getRecentItems(userId);
}

export async function getDemoDashboardStats(): Promise<DashboardStats> {
  const userId = await getDemoUserId();
  if (!userId) return { totalItems: 0, totalCollections: 0, favoriteItems: 0, favoriteCollections: 0 };
  return getDashboardStats(userId);
}

export async function getDemoSystemItemTypesWithCounts(): Promise<SidebarItemType[]> {
  const userId = await getDemoUserId();
  if (!userId) return [];
  return getSystemItemTypesWithCounts(userId);
}

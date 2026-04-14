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

export async function getItemsByType(
  userId: string,
  typeSlug: string,
): Promise<{ items: ItemWithMeta[]; type: ItemType } | null> {
  const typeName = typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1, -1);
  const itemType = await prisma.itemType.findFirst({
    where: { isSystem: true, name: typeName },
  });
  if (!itemType) return null;

  const items = await fetchItems(userId, { typeId: itemType.id });
  return { items: items.map(mapItem), type: itemType };
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


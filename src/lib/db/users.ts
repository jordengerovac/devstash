import { prisma } from '@/lib/prisma';

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hasPassword: boolean;
  createdAt: string;
}

export interface ItemTypeCount {
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface ProfileStats {
  totalItems: number;
  totalCollections: number;
  itemTypeBreakdown: ItemTypeCount[];
}

export async function getProfileUser(userId: string): Promise<ProfileUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: user.password !== null,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: {
        name: true,
        icon: true,
        color: true,
        items: { where: { userId }, select: { id: true } },
      },
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    itemTypeBreakdown: itemTypes.map((t) => ({
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t.items.length,
    })),
  };
}

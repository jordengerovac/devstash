import { prisma } from '@/lib/prisma';

export interface CollectionType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface CollectionWithMeta {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantType: CollectionType | null;
  previewTypes: CollectionType[];
}

export async function getCollections(userId: string): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      items: {
        take: 20,
        orderBy: { addedAt: 'desc' },
        include: {
          item: {
            include: { type: true },
          },
        },
      },
      _count: { select: { items: true } },
    },
  });

  return collections.map((collection) => {
    const typeCounts = new Map<string, { count: number; type: CollectionType }>();

    for (const ic of collection.items) {
      const { type } = ic.item;
      const existing = typeCounts.get(type.id);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(type.id, { count: 1, type });
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection._count.items,
      dominantType: sorted[0]?.type ?? null,
      previewTypes: sorted.map((e) => e.type),
    };
  });
}


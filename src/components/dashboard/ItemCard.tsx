'use client';

import { Star } from 'lucide-react';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import { useItemDrawer } from '@/components/items/ItemDrawerContext';
import type { ItemWithMeta, ItemType } from '@/lib/db/items';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface ItemCardProps {
  item: ItemWithMeta;
  itemType: ItemType;
}

export function ItemCard({ item, itemType }: ItemCardProps) {
  const { openItem } = useItemDrawer();
  const Icon = getItemTypeIcon(itemType.icon);
  const borderColor = itemType.color ?? 'var(--border)';

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer border-l-[3px]"
      style={{ borderLeftColor: borderColor }}
      onClick={() => openItem(item.id)}
    >
      <div className="flex items-start gap-3 mb-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${itemType.color}20` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: itemType.color ?? undefined }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">{item.title}</span>
            {item.isFavorite && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
            )}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {item.description}
            </p>
          )}
        </div>
      </div>
      {item.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground/60 tabular-nums">
        {formatDate(item.createdAt)}
      </p>
    </div>
  );
}

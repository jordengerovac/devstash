import { MoreHorizontal, Star } from 'lucide-react';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import type { CollectionWithMeta } from '@/lib/db/collections';

interface CollectionCardProps {
  collection: CollectionWithMeta;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const borderColor = collection.dominantType?.color ?? 'var(--border)';

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer border-l-[3px]"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-sm font-medium truncate">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
          )}
        </div>
        <button
          className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{collection.itemCount} items</p>
      <p className="text-xs text-muted-foreground/60 mb-4 line-clamp-1">{collection.description}</p>
      <div className="flex items-center gap-1.5">
        {collection.previewTypes.slice(0, 4).map((type) => {
          const Icon = getItemTypeIcon(type.icon);
          return (
            <div
              key={type.id}
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${type.color}25` }}
            >
              <Icon className="h-3 w-3" style={{ color: type.color ?? undefined }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

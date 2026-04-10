import {
  MoreHorizontal,
  Star,
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  previewTypeIds: string[];
}

interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CollectionCardProps {
  collection: Collection;
  itemTypes: ItemType[];
}

export function CollectionCard({ collection, itemTypes }: CollectionCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer">
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
        {collection.previewTypeIds.slice(0, 4).map((typeId) => {
          const type = itemTypes.find((t) => t.id === typeId);
          if (!type) return null;
          const Icon = iconMap[type.icon ?? ''] ?? File;
          return (
            <div
              key={typeId}
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${type.color}25` }}
            >
              <Icon className="h-3 w-3" style={{ color: type.color }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

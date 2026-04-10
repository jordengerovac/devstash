import {
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface Item {
  id: string;
  title: string;
  description: string;
  typeId: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
}

interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ItemRowProps {
  item: Item;
  itemTypes: ItemType[];
}

export function ItemRow({ item, itemTypes }: ItemRowProps) {
  const type = itemTypes.find((t) => t.id === item.typeId);
  const Icon = type ? (iconMap[type.icon ?? ''] ?? File) : File;

  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-muted/30 transition-colors cursor-pointer">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: type ? `${type.color}20` : undefined }}
      >
        <Icon className="h-4 w-4" style={{ color: type?.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-medium truncate">{item.title}</span>
          {item.isFavorite && (
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1.5">{item.description}</p>
        {item.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
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
      </div>
      <span className="text-xs text-muted-foreground shrink-0 mt-0.5 tabular-nums">
        {formatDate(item.createdAt)}
      </span>
    </div>
  );
}

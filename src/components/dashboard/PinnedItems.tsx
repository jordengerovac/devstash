import { Pin } from 'lucide-react';
import { mockItems, mockItemTypes } from '@/lib/mock-data';
import { ItemRow } from './ItemRow';

export function PinnedItems() {
  const pinnedItems = mockItems.filter((item) => item.isPinned);

  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Pin className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Pinned</h2>
      </div>
      <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} itemTypes={mockItemTypes} />
        ))}
      </div>
    </section>
  );
}

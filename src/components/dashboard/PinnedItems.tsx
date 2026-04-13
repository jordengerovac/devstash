import { Pin } from 'lucide-react';
import { getDemoPinnedItems } from '@/lib/db/items';
import { ItemRow } from './ItemRow';

export async function PinnedItems() {
  const pinnedItems = await getDemoPinnedItems();

  if (pinnedItems.length === 0) return null;

  const itemTypes = [...new Map(pinnedItems.map((i) => [i.type.id, i.type])).values()];

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Pin className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Pinned</h2>
      </div>
      <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} itemTypes={itemTypes} />
        ))}
      </div>
    </section>
  );
}

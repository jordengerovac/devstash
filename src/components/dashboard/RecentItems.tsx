import { Clock } from 'lucide-react';
import { getRecentItems } from '@/lib/db/items';
import { ItemRow } from './ItemRow';

export async function RecentItems({ userId }: { userId: string }) {
  const recentItems = await getRecentItems(userId);

  const itemTypes = [...new Map(recentItems.map((i) => [i.type.id, i.type])).values()];

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Recent</h2>
      </div>
      <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} itemTypes={itemTypes} />
        ))}
      </div>
    </section>
  );
}

import { Clock } from 'lucide-react';
import { mockItems, mockItemTypes } from '@/lib/mock-data';
import { ItemRow } from './ItemRow';

export function RecentItems() {
  const recentItems = [...mockItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Recent</h2>
      </div>
      <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} itemTypes={mockItemTypes} />
        ))}
      </div>
    </section>
  );
}

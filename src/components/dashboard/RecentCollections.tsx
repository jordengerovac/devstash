import Link from 'next/link';
import { mockCollections, mockItemTypes } from '@/lib/mock-data';
import { CollectionCard } from './CollectionCard';

export function RecentCollections() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            itemTypes={mockItemTypes}
          />
        ))}
      </div>
    </section>
  );
}

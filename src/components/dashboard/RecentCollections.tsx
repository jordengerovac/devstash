import Link from 'next/link';
import { getDemoCollections } from '@/lib/db/collections';
import { CollectionCard } from './CollectionCard';

export async function RecentCollections() {
  const collections = await getDemoCollections();

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
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}

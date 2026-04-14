import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getItemsByType } from '@/lib/db/items';
import { ItemCard } from '@/components/dashboard/ItemCard';
import { ItemDrawerProvider } from '@/components/items/ItemDrawerProvider';

interface ItemsPageProps {
  params: Promise<{ type: string }>;
}

export default async function ItemsPage({ params }: ItemsPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const { type: typeSlug } = await params;
  const result = await getItemsByType(session.user.id, typeSlug);
  if (!result) notFound();

  const { items, type } = result;

  return (
    <ItemDrawerProvider>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl font-semibold">{type.name}s</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? type.name.toLowerCase() : type.name.toLowerCase() + 's'}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No {type.name.toLowerCase()}s yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} itemType={type} />
            ))}
          </div>
        )}
      </div>
    </ItemDrawerProvider>
  );
}

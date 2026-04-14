import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { getSystemItemTypesWithCounts } from '@/lib/db/items';
import { getCollections } from '@/lib/db/collections';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const userId = session.user.id;

  const [sidebarItemTypes, sidebarCollections] = await Promise.all([
    getSystemItemTypesWithCounts(userId),
    getCollections(userId),
  ]);

  return (
    <DashboardShell
      sidebarItemTypes={sidebarItemTypes}
      sidebarCollections={sidebarCollections}
      user={{
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      }}
    >
      {children}
    </DashboardShell>
  );
}

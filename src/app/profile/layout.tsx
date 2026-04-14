import { auth } from '@/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { getDemoSystemItemTypesWithCounts } from '@/lib/db/items';
import { getDemoCollections } from '@/lib/db/collections';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, sidebarItemTypes, sidebarCollections] = await Promise.all([
    auth(),
    getDemoSystemItemTypesWithCounts(),
    getDemoCollections(),
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

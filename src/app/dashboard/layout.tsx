import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { getDemoSystemItemTypesWithCounts } from '@/lib/db/items';
import { getDemoCollections } from '@/lib/db/collections';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarItemTypes, sidebarCollections] = await Promise.all([
    getDemoSystemItemTypesWithCounts(),
    getDemoCollections(),
  ]);

  return (
    <DashboardShell
      sidebarItemTypes={sidebarItemTypes}
      sidebarCollections={sidebarCollections}
    >
      {children}
    </DashboardShell>
  );
}

import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentCollections } from '@/components/dashboard/RecentCollections';
import { PinnedItems } from '@/components/dashboard/PinnedItems';
import { RecentItems } from '@/components/dashboard/RecentItems';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your developer knowledge hub</p>
      </div>
      <StatsCards />
      <RecentCollections />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}

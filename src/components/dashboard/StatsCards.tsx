import { Layers, FolderOpen, Star, Bookmark } from 'lucide-react';
import { mockStats } from '@/lib/mock-data';

export function StatsCards() {
  const stats = [
    { label: 'Items', value: mockStats.totalItems, icon: Layers },
    { label: 'Collections', value: mockStats.totalCollections, icon: FolderOpen },
    { label: 'Favorite Items', value: mockStats.favoriteItems, icon: Star },
    { label: 'Favorite Collections', value: mockStats.favoriteCollections, icon: Bookmark },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}

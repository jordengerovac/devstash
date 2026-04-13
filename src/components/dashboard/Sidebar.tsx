'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Star,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from 'lucide-react';
import { mockUser } from '@/lib/mock-data';
import type { SidebarItemType } from '@/lib/db/items';
import type { CollectionWithMeta } from '@/lib/db/collections';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  itemTypes: SidebarItemType[];
  collections: CollectionWithMeta[];
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  itemTypes,
  collections,
}: SidebarProps) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  const userInitials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const content = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center h-14 px-3 border-b border-border shrink-0">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">DevStash</span>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto hidden md:flex items-center"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto flex items-center md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {/* Types Section */}
        <div className="mb-4">
          {!collapsed && (
            <p className="text-xs font-medium text-muted-foreground mb-1 px-2">
              Types
            </p>
          )}
          <nav className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon ?? ''] ?? File;
              const slug = type.name.toLowerCase() + 's';
              return (
                <Link
                  key={type.id}
                  href={`/items/${slug}`}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  title={collapsed ? type.name : undefined}
                >
                  <Icon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: type.color ?? undefined }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{type.name}</span>
                      {type.isPro && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px] font-medium text-muted-foreground border-muted-foreground/30">
                          PRO
                        </Badge>
                      )}
                      <span className="text-xs tabular-nums">{type.count}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collections Section */}
        {!collapsed && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 px-2">
              Collections
            </p>

            {/* Favorites */}
            {favoriteCollections.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground/60 px-2 mb-0.5 mt-2">
                  Favorites
                </p>
                <nav className="space-y-0.5 mb-3">
                  {favoriteCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                      <span className="flex-1 truncate">{col.name}</span>
                    </Link>
                  ))}
                </nav>
              </>
            )}

            {/* Recent Collections */}
            {recentCollections.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground/60 px-2 mb-0.5">
                  Recent
                </p>
                <nav className="space-y-0.5">
                  {recentCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: col.dominantType?.color ?? '#6b7280' }}
                      />
                      <span className="flex-1 truncate">{col.name}</span>
                    </Link>
                  ))}
                </nav>
              </>
            )}

            {/* View all collections */}
            <Link
              href="/collections"
              className="flex items-center px-2 py-1.5 mt-1 rounded-md text-xs text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              View all collections
            </Link>
          </div>
        )}
      </div>

      {/* User Avatar Area */}
      <div
        className={`shrink-0 border-t border-border p-3 flex items-center gap-2.5 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground shrink-0">
          {userInitials}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {mockUser.email}
              </p>
            </div>
            <button
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              aria-label="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 overflow-hidden ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        {content}
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border flex flex-col md:hidden transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}

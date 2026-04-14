'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Star,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { signOutUser } from '@/actions/auth';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import type { SidebarItemType } from '@/lib/db/items';
import type { CollectionWithMeta } from '@/lib/db/collections';

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  itemTypes: SidebarItemType[];
  collections: CollectionWithMeta[];
  user: SidebarUser;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  itemTypes,
  collections,
  user,
}: SidebarProps) {
  const router = useRouter();
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

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
              const Icon = getItemTypeIcon(type.icon);
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
      <div className="shrink-0 border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            aria-label="User menu"
          >
            <UserAvatar name={user.name} image={user.image} />
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium truncate">{user.name ?? 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={collapsed ? 'center' : 'start'} className="w-48">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => signOutUser()}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

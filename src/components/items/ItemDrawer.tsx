'use client';

import { useEffect, useState } from 'react';
import { Star, Pin, Copy, Pencil, Trash2, Folder } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import type { ItemDetail } from '@/lib/db/items';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      return;
    }
    setLoading(true);
    setItem(null);
    fetch(`/api/items/${itemId}`)
      .then((r) => r.json())
      .then((data) => setItem(data))
      .finally(() => setLoading(false));
  }, [itemId]);

  const Icon = item ? getItemTypeIcon(item.type.icon) : null;

  return (
    <Sheet open={!!itemId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {loading && <DrawerSkeleton />}

        {!loading && item && (
          <>
            <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
              <div className="flex items-start gap-3">
                {Icon && (
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${item.type.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.type.color ?? undefined }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-base font-semibold leading-tight">
                    {item.title}
                  </SheetTitle>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${item.type.color}20`,
                        color: item.type.color ?? undefined,
                      }}
                    >
                      {item.type.name}
                    </span>
                    {item.language && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {item.language}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Action bar */}
            <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border">
              <ActionButton
                icon={<Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />}
                label="Favorite"
              />
              <ActionButton icon={<Pin className="h-3.5 w-3.5" />} label="Pin" />
              <ActionButton icon={<Copy className="h-3.5 w-3.5" />} label="Copy" />
              <ActionButton icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" />
              <div className="ml-auto">
                <ActionButton
                  icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
                  label="Delete"
                  destructive
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {item.description && (
                <Section label="Description">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Section>
              )}

              {item.content && (
                <Section label="Content">
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words">
                    {item.content}
                  </pre>
                </Section>
              )}

              {item.url && (
                <Section label="URL">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </Section>
              )}

              {item.tags.length > 0 && (
                <Section label="Tags">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {item.collections.length > 0 && (
                <Section label="Collections">
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map((col) => (
                      <span
                        key={col.id}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1"
                      >
                        <Folder className="h-3 w-3" />
                        {col.name}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              <Section label="Details">
                <dl className="space-y-1">
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-muted-foreground">Created</dt>
                    <dd className="text-xs tabular-nums">{formatDate(item.createdAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-muted-foreground">Updated</dt>
                    <dd className="text-xs tabular-nums">{formatDate(item.updatedAt)}</dd>
                  </div>
                </dl>
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ActionButton({
  icon,
  label,
  destructive = false,
}: {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-muted ${destructive ? 'hover:text-destructive' : ''}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-7 w-16 bg-muted rounded-md" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-20 bg-muted rounded" />
      </div>
    </div>
  );
}

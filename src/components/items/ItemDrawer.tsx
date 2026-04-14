'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Pin, Copy, Pencil, Trash2, Folder, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import { updateItem, deleteItem } from '@/actions/items';
import type { ItemDetail } from '@/lib/db/items';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLanguage, setEditLanguage] = useState('');
  const [editTags, setEditTags] = useState('');

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setIsEditing(false);
      return;
    }
    setLoading(true);
    setItem(null);
    setIsEditing(false);
    fetch(`/api/items/${itemId}`)
      .then((r) => r.json())
      .then((data) => setItem(data))
      .finally(() => setLoading(false));
  }, [itemId]);

  function handleEdit() {
    if (!item) return;
    setEditTitle(item.title);
    setEditDescription(item.description ?? '');
    setEditContent(item.content ?? '');
    setEditUrl(item.url ?? '');
    setEditLanguage(item.language ?? '');
    setEditTags(item.tags.join(', '));
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!item) return;
    setDeleting(true);
    const result = await deleteItem(item.id);
    setDeleting(false);
    setDeleteConfirmOpen(false);
    if (result.success) {
      onClose();
      router.refresh();
      toast.success('Item deleted');
    } else {
      toast.error(result.error);
    }
  }

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    const result = await updateItem(item.id, {
      title: editTitle,
      description: editDescription || null,
      content: editContent || null,
      url: editUrl || null,
      language: editLanguage || null,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSaving(false);
    if (result.success) {
      setItem(result.data);
      setIsEditing(false);
      toast.success('Item saved');
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const Icon = item ? getItemTypeIcon(item.type.icon) : null;
  const typeName = item?.type.name.toLowerCase() ?? '';
  const showContent = CONTENT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showUrl = typeName === 'link';

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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-base font-semibold leading-tight bg-transparent border-b border-border focus:border-foreground outline-none pb-0.5"
                      placeholder="Title"
                      autoFocus
                    />
                  ) : (
                    <SheetTitle className="text-base font-semibold leading-tight">
                      {item.title}
                    </SheetTitle>
                  )}
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
                    {!isEditing && item.language && (
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
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving || !editTitle.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <ActionButton
                    icon={<Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />}
                    label="Favorite"
                  />
                  <ActionButton icon={<Pin className="h-3.5 w-3.5" />} label="Pin" />
                  <ActionButton icon={<Copy className="h-3.5 w-3.5" />} label="Copy" />
                  <ActionButton icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" onClick={handleEdit} />
                  <div className="ml-auto">
                    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                      <AlertDialogTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-muted hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete &ldquo;{item.title}&rdquo;?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The item will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleting ? 'Deleting…' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {isEditing ? (
                <>
                  <EditField label="Description">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      placeholder="Optional description"
                      className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border resize-none"
                    />
                  </EditField>

                  {showContent && (
                    <EditField label="Content">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        placeholder="Content"
                        className="w-full text-xs font-mono bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border resize-none"
                      />
                    </EditField>
                  )}

                  {showUrl && (
                    <EditField label="URL">
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
                      />
                    </EditField>
                  )}

                  {showLanguage && (
                    <EditField label="Language">
                      <input
                        type="text"
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        placeholder="e.g. typescript"
                        className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
                      />
                    </EditField>
                  )}

                  <EditField label="Tags">
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
                  </EditField>

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
                </>
              ) : (
                <>
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
                </>
              )}
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
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

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
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

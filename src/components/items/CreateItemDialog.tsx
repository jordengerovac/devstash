'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getItemTypeIcon } from '@/lib/item-type-icons';
import { createItem } from '@/actions/items';
import type { SidebarItemType } from '@/lib/db/items';

interface CreateItemDialogProps {
  open: boolean;
  onClose: () => void;
  itemTypes: SidebarItemType[];
}

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);

export function CreateItemDialog({ open, onClose, itemTypes }: CreateItemDialogProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [typeId, setTypeId] = useState(itemTypes[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState('');

  const selectedType = itemTypes.find((t) => t.id === typeId);
  const SelectedIcon = selectedType ? getItemTypeIcon(selectedType.icon) : null;
  const typeName = selectedType?.name.toLowerCase() ?? '';
  const showContent = CONTENT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showUrl = typeName === 'link';

  function resetForm() {
    setTitle('');
    setDescription('');
    setContent('');
    setUrl('');
    setLanguage('');
    setTags('');
    setTypeId(itemTypes[0]?.id ?? '');
  }

  function handleClose() {
    if (saving) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createItem({
      typeId,
      title,
      description: description || null,
      content: content || null,
      url: url || null,
      language: language || null,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSaving(false);
    if (result.success) {
      toast.success('Item created');
      resetForm();
      onClose();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Type
            </Label>
            <Select value={typeId} onValueChange={(val) => { if (!val) return; setTypeId(val); setContent(''); setUrl(''); setLanguage(''); }}>
              <SelectTrigger className="h-9">
                <span className="flex items-center gap-2">
                  {SelectedIcon && selectedType ? (
                    <>
                      <SelectedIcon className="h-3.5 w-3.5 shrink-0" style={{ color: selectedType.color ?? undefined }} />
                      <span>{selectedType.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Select a type</span>
                  )}
                </span>
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((t) => {
                  const Icon = getItemTypeIcon(t.icon);
                  return (
                    <SelectItem key={t.id} value={t.id}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: t.color ?? undefined }} />
                        {t.name}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Title <span className="text-destructive">*</span>
            </Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item title"
              required
              autoFocus
              className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional description"
              className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border resize-none"
            />
          </div>

          {/* Content — snippet, prompt, note, command */}
          {showContent && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Content
              </Label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Content"
                className="w-full text-xs font-mono bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border resize-none"
              />
            </div>
          )}

          {/* URL — link only */}
          {showUrl && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                URL <span className="text-destructive">*</span>
              </Label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required={showUrl}
                className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
              />
            </div>
          )}

          {/* Language — snippet, command */}
          {showLanguage && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Language
              </Label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g. typescript"
                className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
              />
            </div>
          )}

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tags
            </Label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full text-sm bg-muted rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-border"
            />
            <p className="text-xs text-muted-foreground">Comma-separated</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !title.trim() || (showUrl && !url.trim())}
            >
              {saving ? 'Creating…' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem } from '@/lib/db/items';
import type { ItemDetail } from '@/lib/db/items';

const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.preprocess(
    (v) => (v == null || v === '' ? null : v),
    z.string().url('Must be a valid URL').nullable(),
  ),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

export async function updateItem(
  itemId: string,
  data: UpdateItemInput,
): Promise<{ success: true; data: ItemDetail } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const parsed = UpdateItemSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const updated = await dbUpdateItem(session.user.id, itemId, {
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    content: parsed.data.content ?? null,
    url: parsed.data.url ?? null,
    language: parsed.data.language ?? null,
    tags: parsed.data.tags,
  });

  if (!updated) {
    return { success: false, error: 'Item not found' };
  }

  return { success: true, data: updated };
}

export async function deleteItem(
  itemId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const deleted = await dbDeleteItem(session.user.id, itemId);
  if (!deleted) {
    return { success: false, error: 'Item not found' };
  }

  return { success: true };
}

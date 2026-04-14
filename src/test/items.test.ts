import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/db/items', () => ({
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
}));

import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem } from '@/lib/db/items';
import { updateItem, deleteItem } from '@/actions/items';

const mockAuth = vi.mocked(auth);
const mockDbUpdateItem = vi.mocked(dbUpdateItem);
const mockDbDeleteItem = vi.mocked(dbDeleteItem);

const MOCK_SESSION = { user: { id: 'user-1' } };

const VALID_INPUT = {
  title: 'My Snippet',
  description: 'A description',
  content: 'console.log("hello")',
  url: null,
  language: 'typescript',
  tags: ['js', 'utils'],
};

const MOCK_ITEM = {
  id: 'item-1',
  title: 'My Snippet',
  description: 'A description',
  content: 'console.log("hello")',
  contentType: 'text',
  url: null,
  fileUrl: null,
  fileName: null,
  language: 'typescript',
  isFavorite: false,
  isPinned: false,
  tags: ['js', 'utils'],
  collections: [],
  type: { id: 'type-1', name: 'Snippet', icon: 'Code', color: '#3b82f6' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateItem action', () => {
  describe('authentication', () => {
    it('returns error when not authenticated', async () => {
      mockAuth.mockResolvedValue(null as never);

      const result = await updateItem('item-1', VALID_INPUT);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
      expect(mockDbUpdateItem).not.toHaveBeenCalled();
    });

    it('returns error when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: {} } as never);

      const result = await updateItem('item-1', VALID_INPUT);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
      expect(mockDbUpdateItem).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(MOCK_SESSION as never);
    });

    it('returns error when title is empty', async () => {
      const result = await updateItem('item-1', { ...VALID_INPUT, title: '' });

      expect(result).toEqual({ success: false, error: 'Title is required' });
      expect(mockDbUpdateItem).not.toHaveBeenCalled();
    });

    it('returns error when title is only whitespace', async () => {
      const result = await updateItem('item-1', { ...VALID_INPUT, title: '   ' });

      expect(result).toEqual({ success: false, error: 'Title is required' });
      expect(mockDbUpdateItem).not.toHaveBeenCalled();
    });

    it('returns error when url is not a valid URL', async () => {
      const result = await updateItem('item-1', { ...VALID_INPUT, url: 'not-a-url' });

      expect(result).toEqual({ success: false, error: 'Must be a valid URL' });
      expect(mockDbUpdateItem).not.toHaveBeenCalled();
    });

    it('treats empty string url as null', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      const result = await updateItem('item-1', { ...VALID_INPUT, url: '' });

      expect(result.success).toBe(true);
      expect(mockDbUpdateItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
        expect.objectContaining({ url: null }),
      );
    });

    it('accepts a valid URL', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      const result = await updateItem('item-1', { ...VALID_INPUT, url: 'https://example.com' });

      expect(result.success).toBe(true);
      expect(mockDbUpdateItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
        expect.objectContaining({ url: 'https://example.com' }),
      );
    });
  });

  describe('database interaction', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(MOCK_SESSION as never);
    });

    it('returns error when item is not found', async () => {
      mockDbUpdateItem.mockResolvedValue(null);

      const result = await updateItem('item-1', VALID_INPUT);

      expect(result).toEqual({ success: false, error: 'Item not found' });
    });

    it('returns success with updated item on valid input', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      const result = await updateItem('item-1', VALID_INPUT);

      expect(result).toEqual({ success: true, data: MOCK_ITEM });
    });

    it('passes correct userId and itemId to db function', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      await updateItem('item-abc', VALID_INPUT);

      expect(mockDbUpdateItem).toHaveBeenCalledWith('user-1', 'item-abc', expect.any(Object));
    });

    it('passes trimmed title to db function', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      await updateItem('item-1', { ...VALID_INPUT, title: '  My Snippet  ' });

      expect(mockDbUpdateItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
        expect.objectContaining({ title: 'My Snippet' }),
      );
    });

    it('passes tags array to db function', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      await updateItem('item-1', { ...VALID_INPUT, tags: ['react', 'hooks'] });

      expect(mockDbUpdateItem).toHaveBeenCalledWith(
        'user-1',
        'item-1',
        expect.objectContaining({ tags: ['react', 'hooks'] }),
      );
    });

    it('passes null for optional fields when omitted', async () => {
      mockDbUpdateItem.mockResolvedValue(MOCK_ITEM);

      await updateItem('item-1', { title: 'Title', url: null, tags: [] });

      expect(mockDbUpdateItem).toHaveBeenCalledWith('user-1', 'item-1', {
        title: 'Title',
        description: null,
        content: null,
        url: null,
        language: null,
        tags: [],
      });
    });
  });
});

describe('deleteItem action', () => {
  describe('authentication', () => {
    it('returns error when not authenticated', async () => {
      mockAuth.mockResolvedValue(null as never);

      const result = await deleteItem('item-1');

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
      expect(mockDbDeleteItem).not.toHaveBeenCalled();
    });

    it('returns error when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: {} } as never);

      const result = await deleteItem('item-1');

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
      expect(mockDbDeleteItem).not.toHaveBeenCalled();
    });
  });

  describe('database interaction', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(MOCK_SESSION as never);
    });

    it('returns error when item is not found', async () => {
      mockDbDeleteItem.mockResolvedValue(false);

      const result = await deleteItem('item-1');

      expect(result).toEqual({ success: false, error: 'Item not found' });
    });

    it('returns success when item is deleted', async () => {
      mockDbDeleteItem.mockResolvedValue(true);

      const result = await deleteItem('item-1');

      expect(result).toEqual({ success: true });
    });

    it('passes correct userId and itemId to db function', async () => {
      mockDbDeleteItem.mockResolvedValue(true);

      await deleteItem('item-abc');

      expect(mockDbDeleteItem).toHaveBeenCalledWith('user-1', 'item-abc');
    });
  });
});

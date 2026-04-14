'use client';

import { createContext, useContext } from 'react';

interface ItemDrawerContextValue {
  openItem: (itemId: string) => void;
}

export const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error('useItemDrawer must be used within ItemDrawerProvider');
  return ctx;
}

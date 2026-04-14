'use client';

import { useState } from 'react';
import { ItemDrawerContext } from './ItemDrawerContext';
import { ItemDrawer } from './ItemDrawer';

export function ItemDrawerProvider({ children }: { children: React.ReactNode }) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  return (
    <ItemDrawerContext.Provider value={{ openItem: setOpenItemId }}>
      {children}
      <ItemDrawer itemId={openItemId} onClose={() => setOpenItemId(null)} />
    </ItemDrawerContext.Provider>
  );
}

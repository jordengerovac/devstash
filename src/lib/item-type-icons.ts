import type { ElementType } from 'react';
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
} from 'lucide-react';

const iconMap: Record<string, ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

export function getItemTypeIcon(iconName: string | null | undefined): ElementType {
  return iconMap[iconName ?? ''] ?? File;
}

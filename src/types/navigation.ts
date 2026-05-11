import type { LucideIcon } from 'lucide-react';
import type { AdminRole } from './auth';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
  requiredRole?: AdminRole;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

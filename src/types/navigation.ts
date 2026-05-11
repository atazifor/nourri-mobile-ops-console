import type { ComponentType, SVGProps } from 'react';
import type { AdminRole } from './auth';

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  requiredRole?: AdminRole;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

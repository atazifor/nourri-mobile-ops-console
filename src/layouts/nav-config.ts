import {
  Bell,
  LayoutDashboard,
  LifeBuoy,
  ScrollText,
  Smartphone,
  Users,
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';
import type { NavSection } from '@/types';

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: ROUTES.dashboard,
        icon: LayoutDashboard,
        description: 'Operational health & KPIs',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        label: 'Mobile Users',
        to: ROUTES.users,
        icon: Users,
        description: 'Customer accounts & profiles',
      },
      {
        label: 'Devices',
        to: ROUTES.devices,
        icon: Smartphone,
        description: 'Registered handsets',
      },
      {
        label: 'Support Issues',
        to: ROUTES.support,
        icon: LifeBuoy,
        description: 'Triage & resolution queue',
      },
      {
        label: 'Notifications',
        to: ROUTES.notifications,
        icon: Bell,
        description: 'Outbound push events',
      },
    ],
  },
  {
    title: 'Governance',
    items: [
      {
        label: 'Audit Logs',
        to: ROUTES.auditLogs,
        icon: ScrollText,
        description: 'Admin activity history',
        requiredRole: 'ADMIN',
      },
    ],
  },
];

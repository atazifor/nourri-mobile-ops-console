import {
  AuditLogsIcon,
  DashboardIcon,
  DevicesIcon,
  NotificationsIcon,
  SupportIcon,
  UsersIcon,
} from '@/components/icons';
import { ROUTES } from '@/routes/paths';
import type { NavSection } from '@/types';

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: ROUTES.dashboard,
        icon: DashboardIcon,
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
        icon: UsersIcon,
        description: 'Customer accounts & profiles',
      },
      {
        label: 'Devices',
        to: ROUTES.devices,
        icon: DevicesIcon,
        description: 'Registered handsets',
      },
      {
        label: 'Support Issues',
        to: ROUTES.support,
        icon: SupportIcon,
        description: 'Triage & resolution queue',
      },
      {
        label: 'Notifications',
        to: ROUTES.notifications,
        icon: NotificationsIcon,
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
        icon: AuditLogsIcon,
        description: 'Admin activity history',
        requiredRole: 'ADMIN',
      },
    ],
  },
];

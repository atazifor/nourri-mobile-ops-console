export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
  devices: '/devices',
  support: '/support',
  notifications: '/notifications',
  auditLogs: '/audit-logs',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

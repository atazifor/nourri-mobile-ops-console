export const MOBILE_USER_ROLES = [
  'CUSTOMER',
  'RIDER',
  'RESTAURANT',
  'SUPPORT',
] as const;
export type MobileUserRole = (typeof MOBILE_USER_ROLES)[number];

export const MOBILE_USER_STATUSES = [
  'ACTIVE',
  'SUSPENDED',
  'PENDING',
] as const;
export type MobileUserStatus = (typeof MOBILE_USER_STATUSES)[number];

export interface MobileUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: MobileUserRole;
  status: MobileUserStatus;
  createdAt: Date;
  lastActiveAt: Date | null;
}

export type AdminRole = 'ADMIN' | 'VIEWER';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
}

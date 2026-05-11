export type AdminRole = 'ADMIN' | 'VIEWER';

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName?: string;
  createdAt: Date;
}

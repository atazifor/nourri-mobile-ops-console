import type { AdminRole } from '@/types';

export function isAdmin(role: AdminRole | null | undefined): boolean {
  return role === 'ADMIN';
}

export function isViewer(role: AdminRole | null | undefined): boolean {
  return role === 'VIEWER';
}

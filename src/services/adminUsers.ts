import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import type { AdminUser } from '@/types';

const ADMIN_USERS_COLLECTION = 'adminUsers';

/**
 * Loads the admin-portal profile for a given Firebase Auth UID, or returns
 * null if the user has no `adminUsers/{uid}` document. Read-only by design —
 * write operations on this collection are not exposed yet.
 *
 * A document with an unrecognized `role` is treated as missing rather than
 * defaulted to a permission level, so operators can fix the doc instead of
 * silently granting access.
 */
export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  const snap = await getDoc(doc(db, ADMIN_USERS_COLLECTION, uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  if (data.role !== 'ADMIN' && data.role !== 'VIEWER') {
    console.warn(
      `[adminUsers/${uid}] document is missing a valid role; treating as unauthorized.`,
    );
    return null;
  }

  return {
    uid: snap.id,
    email: String(data.email ?? ''),
    role: data.role,
    displayName:
      typeof data.displayName === 'string' ? data.displayName : undefined,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(),
  };
}

import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/firestore';

export interface DashboardStats {
  mobileUsers: number;
  activeDevices: number;
  openSupportIssues: number;
  failedNotifications: number;
}

/**
 * Fetches dashboard tile counts in parallel using Firestore aggregation
 * queries. `getCountFromServer` returns just the count, not the documents,
 * so this is cheap even on large collections.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [mobileUsers, activeDevices, openSupport, failedNotifs] =
    await Promise.all([
      getCountFromServer(collection(db, 'mobileUsers')),
      getCountFromServer(
        query(collection(db, 'devices'), where('status', '==', 'ACTIVE')),
      ),
      getCountFromServer(
        query(
          collection(db, 'supportIssues'),
          where('status', 'in', ['OPEN', 'IN_PROGRESS']),
        ),
      ),
      getCountFromServer(
        query(
          collection(db, 'notificationEvents'),
          where('status', '==', 'FAILED'),
        ),
      ),
    ]);

  return {
    mobileUsers: mobileUsers.data().count,
    activeDevices: activeDevices.data().count,
    openSupportIssues: openSupport.data().count,
    failedNotifications: failedNotifs.data().count,
  };
}

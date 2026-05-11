import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import type {
  MobileUser,
  MobileUserRole,
  MobileUserStatus,
} from '@/types';

// The service layer exists so every Firestore read and write goes through a
// typed, named function rather than being scattered across pages. UI code
// imports `listMobileUsers` and `changeMobileUserStatus` and gets back fully-
// shaped `MobileUser` objects — raw Firestore data (Timestamps, unknown
// fields, document references) is normalized at this boundary. That keeps
// query logic, collection names, and Timestamp/Date conversion in one place,
// so when the schema or path changes, only this file changes.

const MOBILE_USERS_COLLECTION = 'mobileUsers';
const AUDIT_LOGS_COLLECTION = 'auditLogs';
const MAX_USERS = 200;

/**
 * Reads the most recently created mobile users from Firestore.
 *
 * `query(collection(...), orderBy(...), limit(...))` builds an immutable
 * Query object; `getDocs` runs it once against the server (or the local
 * cache, if offline persistence is enabled) and returns a snapshot. We cap
 * results with `limit` to keep the client responsive — pagination would be
 * added here once the dataset outgrows the cap. The ordering on `createdAt`
 * is server-side, so the same first page is returned regardless of which
 * admin is paging through it.
 */
export async function listMobileUsers(): Promise<MobileUser[]> {
  const snap = await getDocs(
    query(
      collection(db, MOBILE_USERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(MAX_USERS),
    ),
  );
  return snap.docs.map(mapMobileUser);
}

export interface ChangeStatusParams {
  user: MobileUser;
  nextStatus: MobileUserStatus;
  performedBy: {
    uid: string;
    email: string;
  };
}

/**
 * Updates a single mobileUsers document's status and appends a matching
 * auditLogs entry inside the same Firestore batch.
 *
 * `writeBatch` queues writes locally and commits them as one atomic unit —
 * either every operation lands or none of them do. This is preferable to two
 * sequential calls because it prevents the case where the status change
 * succeeds but the audit-log write fails, leaving an action that looks
 * ungoverned in the history. `serverTimestamp()` stamps `createdAt`
 * server-side, so audit timestamps can't be back-dated from a misconfigured
 * client clock.
 *
 * No-op if the requested status is identical to the current status, to keep
 * the audit log free of empty entries.
 */
export async function changeMobileUserStatus({
  user,
  nextStatus,
  performedBy,
}: ChangeStatusParams): Promise<void> {
  if (user.status === nextStatus) return;

  const batch = writeBatch(db);

  batch.update(doc(db, MOBILE_USERS_COLLECTION, user.id), {
    status: nextStatus,
  });

  // Pre-allocate the audit log doc so the batch can `set` it (addDoc does its
  // own commit, which would bypass batching).
  const auditRef = doc(collection(db, AUDIT_LOGS_COLLECTION));
  batch.set(auditRef, {
    action: 'UPDATE_MOBILE_USER_STATUS',
    entityType: 'mobileUser',
    entityId: user.id,
    performedBy: performedBy.uid,
    performedByEmail: performedBy.email,
    before: { status: user.status },
    after: { status: nextStatus },
    createdAt: serverTimestamp(),
  });

  await batch.commit();
}

function mapMobileUser(
  snap: QueryDocumentSnapshot<DocumentData>,
): MobileUser {
  const data = snap.data();
  return {
    id: snap.id,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    role: data.role as MobileUserRole,
    status: data.status as MobileUserStatus,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(0),
    lastActiveAt:
      data.lastActiveAt instanceof Timestamp
        ? data.lastActiveAt.toDate()
        : null,
  };
}

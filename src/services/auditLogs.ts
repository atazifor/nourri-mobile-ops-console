import {
  collection,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import type { AuditLog } from '@/types';

const AUDIT_LOGS_COLLECTION = 'auditLogs';
const DEFAULT_LIMIT = 100;

export async function listAuditLogs(limit = DEFAULT_LIMIT): Promise<AuditLog[]> {
  const snap = await getDocs(
    query(
      collection(db, AUDIT_LOGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      fsLimit(limit),
    ),
  );
  return snap.docs.map(mapAuditLog);
}

function mapAuditLog(snap: QueryDocumentSnapshot<DocumentData>): AuditLog {
  const data = snap.data();
  return {
    id: snap.id,
    action: String(data.action ?? ''),
    entityType: String(data.entityType ?? ''),
    entityId: String(data.entityId ?? ''),
    performedBy: String(data.performedBy ?? ''),
    performedByEmail: String(data.performedByEmail ?? ''),
    before:
      data.before && typeof data.before === 'object'
        ? (data.before as Record<string, unknown>)
        : null,
    after:
      data.after && typeof data.after === 'object'
        ? (data.after as Record<string, unknown>)
        : null,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(0),
  };
}

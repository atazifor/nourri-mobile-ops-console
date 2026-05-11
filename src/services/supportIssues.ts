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
  SupportCategory,
  SupportIssue,
  SupportPriority,
  SupportStatus,
} from '@/types';

const SUPPORT_ISSUES_COLLECTION = 'supportIssues';
const AUDIT_LOGS_COLLECTION = 'auditLogs';
const MAX_ISSUES = 200;

export async function listSupportIssues(): Promise<SupportIssue[]> {
  const snap = await getDocs(
    query(
      collection(db, SUPPORT_ISSUES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(MAX_ISSUES),
    ),
  );
  return snap.docs.map(mapSupportIssue);
}

export interface ChangeIssueStatusParams {
  issue: SupportIssue;
  nextStatus: SupportStatus;
  performedBy: {
    uid: string;
    email: string;
  };
}

/**
 * Mirrors the mobileUsers pattern: status change + audit log written as one
 * atomic Firestore batch. Also bumps `updatedAt` so the support queue can
 * sort by "most recently touched" later.
 */
export async function changeSupportIssueStatus({
  issue,
  nextStatus,
  performedBy,
}: ChangeIssueStatusParams): Promise<void> {
  if (issue.status === nextStatus) return;

  const batch = writeBatch(db);

  batch.update(doc(db, SUPPORT_ISSUES_COLLECTION, issue.id), {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  });

  const auditRef = doc(collection(db, AUDIT_LOGS_COLLECTION));
  batch.set(auditRef, {
    action: 'UPDATE_SUPPORT_ISSUE_STATUS',
    entityType: 'supportIssue',
    entityId: issue.id,
    performedBy: performedBy.uid,
    performedByEmail: performedBy.email,
    before: { status: issue.status },
    after: { status: nextStatus },
    createdAt: serverTimestamp(),
  });

  await batch.commit();
}

function mapSupportIssue(
  snap: QueryDocumentSnapshot<DocumentData>,
): SupportIssue {
  const data = snap.data();
  return {
    id: snap.id,
    subject: String(data.subject ?? ''),
    description: String(data.description ?? ''),
    category: data.category as SupportCategory,
    priority: data.priority as SupportPriority,
    status: data.status as SupportStatus,
    reportedByUid: String(data.reportedByUid ?? ''),
    reportedByName: String(data.reportedByName ?? ''),
    reportedByEmail: String(data.reportedByEmail ?? ''),
    orderRef:
      typeof data.orderRef === 'string' && data.orderRef.length > 0
        ? data.orderRef
        : undefined,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(0),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(0),
  };
}

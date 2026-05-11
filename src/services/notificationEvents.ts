import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase/firestore';
import type {
  NotificationChannel,
  NotificationEvent,
  NotificationStatus,
} from '@/types';

const NOTIFICATION_EVENTS_COLLECTION = 'notificationEvents';
const MAX_EVENTS = 200;

export async function listNotificationEvents(): Promise<NotificationEvent[]> {
  const snap = await getDocs(
    query(
      collection(db, NOTIFICATION_EVENTS_COLLECTION),
      orderBy('sentAt', 'desc'),
      limit(MAX_EVENTS),
    ),
  );
  return snap.docs.map(mapNotificationEvent);
}

function mapNotificationEvent(
  snap: QueryDocumentSnapshot<DocumentData>,
): NotificationEvent {
  const data = snap.data();
  const recipientCount = Number(data.recipientCount ?? 0);
  const deliveredCount = Number(data.deliveredCount ?? 0);
  const failedCount = Number(data.failedCount ?? 0);
  return {
    id: snap.id,
    channel: data.channel as NotificationChannel,
    title: String(data.title ?? ''),
    body: String(data.body ?? ''),
    recipientCount,
    deliveredCount,
    failedCount,
    status: data.status as NotificationStatus,
    sentAt:
      data.sentAt instanceof Timestamp ? data.sentAt.toDate() : new Date(0),
  };
}

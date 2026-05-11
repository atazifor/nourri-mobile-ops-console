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
import type { Device, DevicePlatform, DeviceStatus } from '@/types';

const DEVICES_COLLECTION = 'devices';
const MAX_DEVICES = 200;

export async function listDevices(): Promise<Device[]> {
  const snap = await getDocs(
    query(
      collection(db, DEVICES_COLLECTION),
      orderBy('lastSeenAt', 'desc'),
      limit(MAX_DEVICES),
    ),
  );
  return snap.docs.map(mapDevice);
}

function mapDevice(snap: QueryDocumentSnapshot<DocumentData>): Device {
  const data = snap.data();
  return {
    id: snap.id,
    ownerUid: String(data.ownerUid ?? ''),
    ownerName: String(data.ownerName ?? ''),
    ownerEmail: String(data.ownerEmail ?? ''),
    platform: data.platform as DevicePlatform,
    appVersion: String(data.appVersion ?? ''),
    pushToken: String(data.pushToken ?? ''),
    status: data.status as DeviceStatus,
    lastSeenAt:
      data.lastSeenAt instanceof Timestamp ? data.lastSeenAt.toDate() : null,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(0),
  };
}

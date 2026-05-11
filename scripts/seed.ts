/**
 * Seed the Firestore collections behind the Nourri Mobile Ops Console with
 * realistic Yaoundé-flavored operational data.
 *
 * Usage:
 *   1. Ensure `.env.local` has the VITE_FIREBASE_* config.
 *   2. Set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in `.env.local` (or pass
 *      them inline). The credentials must belong to a Firebase Auth user who
 *      has an `adminUsers/{uid}` doc with `role: "ADMIN"`.
 *   3. Run `npm run seed`.
 *
 * Writes are keyed by deterministic IDs, so re-running the seed updates
 * documents in place instead of creating duplicates.
 */

import { config as dotenvConfig } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import {
  auditLogs,
  devices,
  mobileUsers,
  notificationEvents,
  supportIssues,
} from './seed-data';

dotenvConfig({ path: '.env.local' });

const FIRESTORE_BATCH_LIMIT = 450; // leave headroom under the 500-op hard cap

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
}

interface SeedDoc<T> {
  id: string;
  data: T;
}

async function writeCollection<T extends object>(
  db: ReturnType<typeof getFirestore>,
  collectionName: string,
  docs: SeedDoc<T>[],
): Promise<void> {
  for (let i = 0; i < docs.length; i += FIRESTORE_BATCH_LIMIT) {
    const chunk = docs.slice(i, i + FIRESTORE_BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const { id, data } of chunk) {
      batch.set(doc(db, collectionName, id), data);
    }
    await batch.commit();
  }
  console.log(`  ${collectionName}: ${docs.length} document(s) written`);
}

async function main(): Promise<void> {
  const firebaseApp = initializeApp({
    apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
    authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv('VITE_FIREBASE_APP_ID'),
  });

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const adminEmail = requireEnv('SEED_ADMIN_EMAIL');
  const adminPassword = requireEnv('SEED_ADMIN_PASSWORD');

  console.log(`Signing in as ${adminEmail}…`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  console.log('Signed in.\n');

  console.log('Seeding Firestore:');
  await writeCollection(db, 'mobileUsers', mobileUsers);
  await writeCollection(db, 'devices', devices);
  await writeCollection(db, 'supportIssues', supportIssues);
  await writeCollection(db, 'notificationEvents', notificationEvents);
  await writeCollection(db, 'auditLogs', auditLogs);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

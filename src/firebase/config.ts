import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';

// Vite only inlines env vars prefixed with `VITE_` into the client bundle —
// anything without that prefix stays on the build host and is unavailable in
// the browser. Firebase web config values are public by design (gated by
// Firebase Security Rules), but they still vary per environment, so they're
// loaded from .env.local instead of being hard-coded.
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Copy .env.example to .env.local and fill in your Firebase project config.`,
    );
  }
  return value;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
};

// `initializeApp` creates a FirebaseApp — a lightweight container holding the
// project config. It does NOT itself open a connection to Auth, Firestore, or
// any other product. Each product is a separate service obtained via its own
// factory (`getAuth(app)`, `getFirestore(app)`, …), which is why those live in
// sibling files in this directory. This split is what lets the modular SDK
// tree-shake unused products out of the client bundle.
//
// The `getApps()` guard makes initialization idempotent across Vite HMR
// reloads — re-running `initializeApp` with the default name would otherwise
// throw "Firebase App named '[DEFAULT]' already exists".
export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

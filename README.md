# Nourri Mobile Ops Console

Internal operations portal for the Nourri Express mobile stack (Yaoundé). Manages mobile users, devices, support issues, push notifications, and the audit trail on top of Firebase.

## Features

- Email/password auth with role gating from `adminUsers/{uid}` (`ADMIN` / `VIEWER`)
- Mobile users — list, search, filter; ADMIN status edits with audit log
- Devices — list with platform / version / last-seen
- Support issues — triage queue; ADMIN status edits with audit log
- Notifications — outbound push history with delivery / failure breakdown
- Audit logs — append-only, filterable
- Dashboard — live Firestore counts + recent activity
- Toast feedback on writes

## Stack

React 19, TypeScript, Vite, Tailwind v4, React Router 7, Firebase Web SDK (modular), Sonner, lucide-react.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in Firebase web config
npm run dev
```

Required env vars (from Firebase Console → Project settings → Your apps):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

For seeding:

```
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

## Firebase setup

1. Create the project; enable **Email/Password** auth and **Firestore**.
2. Create an `ADMIN` user in Auth, then add `adminUsers/{uid}`:

   ```json
   {
     "email": "ops-admin@nourri.cm",
     "role": "ADMIN",
     "displayName": "Ops Admin",
     "createdAt": <Timestamp>
   }
   ```

3. Repeat with `role: "VIEWER"` to test read-only behavior.

A user without an `adminUsers` doc lands on Access Denied.

## Seed data

Idempotent (deterministic IDs). Run with the admin credentials in `.env.local`:

```bash
npm run seed
```

Populates `mobileUsers`, `devices`, `supportIssues`, `notificationEvents`, `auditLogs`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview prod build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed Firestore |

## Deploy (Firebase Hosting)

```bash
firebase use --add        # first time only
npm run build
firebase deploy --only hosting
```

`firebase.json` rewrites all paths to `/index.html` and caches hashed assets.

## Security rules

UI gates are convenience; enforce roles in Firestore rules before going live. Starting point:

```js
function isSignedInAdmin() {
  return request.auth != null
    && exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
}
function isAdmin() {
  return request.auth != null
    && get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'ADMIN';
}

match /mobileUsers/{id}        { allow read: if isSignedInAdmin(); allow update: if isAdmin(); }
match /supportIssues/{id}      { allow read: if isSignedInAdmin(); allow update: if isAdmin(); }
match /devices/{id}            { allow read: if isSignedInAdmin(); }
match /notificationEvents/{id} { allow read: if isSignedInAdmin(); }
match /auditLogs/{id}          { allow read: if isSignedInAdmin(); allow create: if isAdmin(); }
match /adminUsers/{uid}        { allow read: if request.auth.uid == uid; }
```

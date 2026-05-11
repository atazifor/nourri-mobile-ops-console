# Nourri Mobile Ops Console

Internal operations console for the **Nourri Express** mobile ecosystem (Yaoundé, Cameroon). It's the day-to-day cockpit ops uses to manage customers, riders, restaurant/partner accounts, devices, support tickets, and the push notifications that flow between them — all backed by Firebase.

## What's inside

- **Auth & RBAC** — Firebase Authentication (email + password) with role-based access from a Firestore `adminUsers/{uid}` document (`ADMIN` / `VIEWER`). Authenticated users with no `adminUsers` doc see a dedicated Access Denied screen.
- **Mobile users** — searchable, filterable table of every customer, rider, restaurant operator, and support-staff account in the mobile app. ADMINs can change account status; every change is audit-logged.
- **Devices** — registered handsets across iOS and Android with app version, push token health, and last-seen times.
- **Support issues** — triage queue with priority, category, status, and ADMIN-driven status updates (audit-logged).
- **Notifications** — outbound push event history with delivery / failure breakdowns per campaign.
- **Audit log** — immutable record of every admin write (who, what, before → after, when).
- **Dashboard** — Firestore-aggregated counts (`getCountFromServer`) plus the most recent audit-log activity.

## Tech stack

React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · Firebase Web SDK (modular) · Sonner · lucide-react · clsx

## Local setup

```bash
git clone <repo>
cd nourri-mobile-ops-console
npm install
cp .env.example .env.local   # then fill in the values — see below
npm run dev
```

### Environment variables

Vite only inlines variables prefixed with `VITE_` into the client bundle. Fill these in `.env.local` from **Firebase Console → Project settings → Your apps → SDK setup**:

| Variable | Source |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Web app config |
| `VITE_FIREBASE_PROJECT_ID` | Web app config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Web app config |
| `VITE_FIREBASE_APP_ID` | Web app config |

For seeding only, also set:

| Variable | Purpose |
| --- | --- |
| `SEED_ADMIN_EMAIL` | Firebase Auth email of an ADMIN user used by the seed script |
| `SEED_ADMIN_PASSWORD` | Password for that user |

The Firebase web config values are public by design (they're inlined into the client bundle); access is gated by Firebase Security Rules, not by hiding the API key.

## Firebase project setup

1. Create a Firebase project at <https://console.firebase.google.com>.
2. **Authentication** → enable the **Email/Password** sign-in provider.
3. **Firestore Database** → create a database (start in test mode while developing; lock down with Security Rules before deploying).
4. **Project settings → Your apps** → add a **Web** app. Copy the generated config into `.env.local`.

### Create the first admin

The console requires an `adminUsers/{uid}` document for every authenticated user. To bootstrap:

1. Create a Firebase Auth user via **Authentication → Users → Add user** (e.g. `ops-admin@nourri.cm`).
2. Copy the UID Firebase generates for that user.
3. In **Firestore Database**, create the collection `adminUsers` and add a document with the UID as the document ID:

   ```json
   {
     "email": "ops-admin@nourri.cm",
     "role": "ADMIN",
     "displayName": "Ops Admin",
     "createdAt": <Timestamp: now>
   }
   ```

Repeat for a VIEWER if you want to test read-only behavior:

```json
{
  "email": "ops-viewer@nourri.cm",
  "role": "VIEWER",
  "displayName": "Ops Viewer",
  "createdAt": <Timestamp: now>
}
```

### Demo accounts

After completing the bootstrap above, sign in with the credentials you created:

| Role | Email (example) | Password |
| --- | --- | --- |
| ADMIN | `ops-admin@nourri.cm` | (set when creating the user in Firebase Console) |
| VIEWER | `ops-viewer@nourri.cm` | (set when creating the user in Firebase Console) |

ADMINs can change account/issue status. VIEWERs see the same data but no edit affordances are rendered.

## Seeding operational data

A seed script populates the five Firestore collections with realistic Yaoundé-flavored data (Cameroonian names, +237 phone numbers, real Yaoundé neighborhoods like Bastos / Mvog-Mbi / Biyem-Assi, food + pharmacy + grocery issues, mobile-money payment incidents, etc.).

```bash
# Make sure .env.local has VITE_FIREBASE_* and SEED_ADMIN_*
npm run seed
```

The seed uses **deterministic document IDs** (`mu_001`, `dev_001`, `si_001`, …), so re-running it updates documents in place instead of creating duplicates.

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed Firestore with realistic Cameroon/Nourri data |

## Deploying to Firebase Hosting

This repo already includes `firebase.json` (SPA rewrite + cache headers) and an empty `.firebaserc`.

```bash
# One-time, on a machine without the Firebase CLI
npm install -g firebase-tools
firebase login

# Tell the CLI which project to deploy to
firebase use --add        # pick your project; aliases it as `default`

# Build + ship
npm run build
firebase deploy --only hosting
```

`firebase.json` rewrites every path to `/index.html` so client-side routing works on hard refresh, and aggressively caches hashed JS/CSS/font assets while keeping `index.html` always-fresh.

## Project layout

```
src/
  components/    reusable UI primitives (Button, Modal, Badge, …)
  context/       React Contexts (AuthContext)
  firebase/      Firebase app + service singletons (auth, firestore)
  hooks/         shared hooks (useAuth)
  layouts/       AppLayout, Sidebar, Topbar, nav config
  pages/         route entry points (one file per route)
  routes/        AppRouter, ProtectedRoute, route paths
  services/      typed Firestore read/write functions per collection
  types/         shared TypeScript types
  utils/         pure helpers (cn, formatRelative, roles)

scripts/
  seed.ts        runs the seed against your Firebase project
  seed-data.ts   the data itself (mobile users, devices, issues, …)
```

The **service layer** (`src/services/*`) is the only place that talks to Firestore directly. UI code imports typed functions like `listMobileUsers()` and `changeMobileUserStatus()` and gets back fully-shaped domain objects — Timestamps are converted to `Date` at this boundary, and writes that affect more than one document (entity update + audit log) are committed as a single `writeBatch` so they're atomic.

## Security rules

Production deployments should enforce role checks in Firestore Security Rules too — UI gates are convenience, not a security boundary. A sketch:

```js
match /databases/{db}/documents {
  function isAdmin() {
    return request.auth != null
      && get(/databases/$(db)/documents/adminUsers/$(request.auth.uid)).data.role == 'ADMIN';
  }
  function isSignedInAdmin() {
    return request.auth != null
      && exists(/databases/$(db)/documents/adminUsers/$(request.auth.uid));
  }

  match /mobileUsers/{id} {
    allow read: if isSignedInAdmin();
    allow update: if isAdmin();
    allow create, delete: if false; // not exposed by the console
  }
  match /supportIssues/{id} {
    allow read: if isSignedInAdmin();
    allow update: if isAdmin();
  }
  match /devices/{id} {
    allow read: if isSignedInAdmin();
  }
  match /notificationEvents/{id} {
    allow read: if isSignedInAdmin();
  }
  match /auditLogs/{id} {
    allow read: if isSignedInAdmin();
    allow create: if isAdmin();
    allow update, delete: if false; // append-only
  }
  match /adminUsers/{uid} {
    allow read: if request.auth != null && request.auth.uid == uid;
  }
}
```

Tighten and test before going live.

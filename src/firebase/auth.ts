import { getAuth, type Auth } from 'firebase/auth';
import { firebaseApp } from './config';

// `getAuth(app)` returns the Auth service singleton bound to our FirebaseApp.
// Subsequent calls return the same instance, so importing `auth` from this
// module anywhere in the app is cheap and safe.
export const auth: Auth = getAuth(firebaseApp);

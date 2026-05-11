import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/firebase/auth';

// Authentication answers *who* the user is — the only concern of this Context.
// Authorization (*what* they're allowed to do) is a separate problem layered
// on top, driven by role/claim data sourced elsewhere (e.g. `adminUsers` in
// Firestore). Roles are intentionally not modeled here yet; this Context only
// exposes the signed-in Firebase user and the actions needed to flip that
// state.
//
// React Context is used because auth state is consumed in many unrelated
// places — route guards, the topbar, future role-gated UI — and prop-drilling
// it through every layer would couple unrelated components. A single Context,
// sourced from Firebase's `onAuthStateChanged` subscription, keeps that state
// centralized, reactive, and accessible via a single hook.

export interface AuthContextValue {
  user: User | null;
  /** True until Firebase resolves the persisted session on initial page load. */
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          throw new Error(mapAuthError(err));
        }
      },
      signOut: () => firebaseSignOut(auth),
    }),
    [user, initializing],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// `auth/user-not-found` and `auth/wrong-password` are intentionally collapsed
// into a single message to avoid user-enumeration via the sign-in form.
function mapAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : 'unknown';
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again in a few minutes.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact your administrator.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Sign-in failed. Try again or contact support.';
  }
}

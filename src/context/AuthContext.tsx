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
import { getAdminUser } from '@/services/adminUsers';
import type { AdminUser } from '@/types';

// Authentication and authorization are kept as two distinct concepts even
// though both now live in this Context:
//
//   • Authentication — *who is the user?* — answered by Firebase Auth. The
//     `user` field below is the proof of identity (signed JWT, persisted
//     session). A user can be authenticated and still have zero capabilities
//     in this app.
//
//   • Authorization — *what may the user do?* — answered by the
//     `adminUsers/{uid}` Firestore document, mapped here into `profile`.
//     Without a matching document the user has no role in this portal and
//     ProtectedRoute will surface AccessDeniedPage instead of the app shell,
//     regardless of how valid their Firebase credentials are. Capability
//     checks (ADMIN vs VIEWER) live in `src/utils/roles.ts` so any component
//     can ask the same question the same way.
//
// React Context centralizes both pieces because they're consumed all over the
// tree — route guards, the topbar, future role-gated UI — and prop-drilling
// would force every intermediate component to know about auth.

export interface AuthContextValue {
  user: User | null;
  profile: AdminUser | null;
  /**
   * True while either the persisted Firebase session or the matching
   * adminUsers/{uid} document is still loading. Consumers must not treat
   * `user` or `profile` as final until this flips to false.
   */
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
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setInitializing(true);
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setInitializing(false);
        return;
      }
      try {
        setProfile(await getAdminUser(nextUser.uid));
      } catch (err) {
        console.error('Failed to load adminUsers profile:', err);
        setProfile(null);
      } finally {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
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
    [user, profile, initializing],
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

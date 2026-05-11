import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from './paths';

interface ProtectedRouteProps {
  children: ReactNode;
}

// ProtectedRoute is a route-level authentication gate. It sits between the
// router and the page element and does three things, in order:
//
//   1. While Firebase Auth is still resolving the persisted session
//      (`initializing`), it renders a minimal full-page loader. Without this,
//      a signed-in user landing on a protected URL would briefly be redirected
//      to /login during the auth handshake.
//
//   2. If there's no signed-in user once initialization completes, it
//      redirects to /login and stashes the requested path in
//      `location.state.from` so a future "redirect back after sign-in" flow
//      can pick it up.
//
//   3. Otherwise it renders the children — the actual page tree.
//
// Authorization (role checks) would also be layered here once roles are wired
// up; for now this is strictly an authentication gate.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <FullPageLoader />;
  }

  if (!user) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}

function FullPageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-canvas"
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand-600"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

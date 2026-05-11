import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { FullPageLoader } from '@/components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { AccessDeniedPage } from '@/pages/AccessDeniedPage';
import { ROUTES } from './paths';

interface ProtectedRouteProps {
  children: ReactNode;
}

// ProtectedRoute applies two gates in sequence:
//
//   1. Authentication — while Firebase Auth (and the matching adminUsers
//      profile) are loading, render a minimal full-page loader. Without this,
//      a signed-in user landing on a protected URL would briefly bounce to
//      /login during the auth handshake. If no signed-in user once
//      initialization completes, redirect to /login and stash the requested
//      path in `location.state.from` so a future "redirect back after
//      sign-in" flow can pick it up.
//
//   2. Authorization — a Firebase user without a corresponding
//      adminUsers/{uid} document has no role in this portal and is shown
//      AccessDeniedPage in place of the requested route. Granular role
//      checks (ADMIN vs VIEWER on specific routes) belong here too as
//      they're introduced.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <FullPageLoader />;
  }

  if (!user) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  if (!profile) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
}

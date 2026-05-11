import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import type { AdminRole } from '@/types';
import { ROUTES } from './paths';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AdminRole;
}

/**
 * Auth gate placeholder. Once Firebase Auth is wired up, this should read the
 * signed-in admin from context and redirect to /login if absent, or render a
 * 403 when the role doesn't meet `requiredRole`.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '@/layouts/AppLayout';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DevicesPage } from '@/pages/DevicesPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { SupportPage } from '@/pages/SupportPage';
import { UsersPage } from '@/pages/UsersPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './paths';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.users} element={<UsersPage />} />
          <Route path={ROUTES.devices} element={<DevicesPage />} />
          <Route path={ROUTES.support} element={<SupportPage />} />
          <Route path={ROUTES.notifications} element={<NotificationsPage />} />
          <Route
            path={ROUTES.auditLogs}
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

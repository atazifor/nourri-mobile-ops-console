import { ShieldAlert } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export function AccessDeniedPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <Logo className="mb-6" />

        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200">
          <ShieldAlert size={20} />
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-ink-900">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          You're signed in as{' '}
          <span className="font-medium text-ink-700">
            {user?.email ?? 'unknown user'}
          </span>
          , but this account hasn't been provisioned for the Nourri Mobile Ops
          Console. Contact your administrator to request access.
        </p>

        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink-700 hover:bg-canvas-muted"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

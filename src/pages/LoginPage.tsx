import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ROUTES } from '@/routes/paths';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(ROUTES.dashboard, { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-10" />

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
              Sign in to operations
            </h1>
            <p className="mt-1.5 text-sm text-ink-500">
              Use your Nourri admin account to access the operations console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink-700">
                Work email
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@nourri.com"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink-700">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                required
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              Continue
            </button>
          </form>

          <p className="mt-8 text-xs text-ink-400">
            Access is restricted to authorized Nourri staff. All sign-in
            activity is logged for audit and compliance review.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(225,29,72,0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(190,18,60,0.25), transparent 60%), linear-gradient(180deg, #0f172a 0%, #111827 100%)',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Nourri Mobile Ops Console
          </div>
          <div>
            <p className="max-w-md text-2xl font-medium leading-snug">
              Visibility into every device, support thread, and notification
              moving through the Nourri Express mobile platform.
            </p>
            <p className="mt-6 text-sm text-white/60">
              Role-aware, audit-logged, and built for the operations team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

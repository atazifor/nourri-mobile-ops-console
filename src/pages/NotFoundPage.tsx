import { Link } from 'react-router';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.dashboard}
        className="mt-6 inline-flex h-9 items-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

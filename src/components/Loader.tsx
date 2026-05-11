import { cn } from '@/utils/cn';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Loader({ size = 20, className, label = 'Loading…' }: LoaderProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center justify-center', className)}
    >
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="animate-spin rounded-full border-2 border-border border-t-brand-600"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

interface FullPageLoaderProps {
  label?: string;
}

export function FullPageLoader({ label }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Loader size={24} label={label} />
    </div>
  );
}

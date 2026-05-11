import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-semibold tracking-tight text-white shadow-sm">
        N
      </span>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-ink-900">
            Nourri
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
            Ops Console
          </span>
        </div>
      )}
    </div>
  );
}

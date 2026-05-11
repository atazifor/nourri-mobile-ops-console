import {
  ChevronDownIcon,
  LogoutIcon,
  MenuIcon,
  NotificationsIcon,
  SearchIcon,
} from '@/components/icons';

interface TopbarProps {
  onOpenMobileNav: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900 lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon />
      </button>

      <div className="relative hidden flex-1 max-w-md sm:block">
        <SearchIcon
          width={16}
          height={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="search"
          placeholder="Search users, devices, support issues…"
          className="h-9 w-full rounded-md border border-border bg-canvas pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900"
          aria-label="Notifications"
        >
          <NotificationsIcon width={18} height={18} />
          <span className="absolute right-2 top-2 inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-canvas-muted"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
            AT
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[13px] font-medium text-ink-900">
              Amin Tazifor
            </span>
            <span className="text-[11px] text-ink-400">Admin</span>
          </span>
          <ChevronDownIcon
            width={14}
            height={14}
            className="hidden text-ink-400 sm:block"
          />
        </button>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogoutIcon width={18} height={18} />
        </button>
      </div>
    </header>
  );
}

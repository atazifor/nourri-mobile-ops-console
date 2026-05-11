import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onOpenMobileNav: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { user, signOut } = useAuth();

  const email = user?.email ?? '';
  const initial = (email[0] ?? '?').toUpperCase();

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search
          size={16}
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
          <Bell size={18} />
          <span className="absolute right-2 top-2 inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <div className="flex items-center gap-2 px-1.5 py-1">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white"
          >
            {initial}
          </span>
          <span
            className="hidden max-w-[200px] truncate text-[13px] font-medium text-ink-900 sm:block"
            title={email}
          >
            {email}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

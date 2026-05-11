import { X } from 'lucide-react';
import { NavLink } from 'react-router';
import { Logo } from '@/components/Logo';
import { cn } from '@/utils/cn';
import { NAV_SECTIONS } from './nav-config';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen
            ? 'opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Logo />
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-canvas-muted hover:text-ink-900 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title ?? 'unnamed'} className="mb-5 last:mb-0">
              {section.title && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {section.title}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-ink-700 hover:bg-canvas-muted hover:text-ink-900',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={18}
                              className={cn(
                                'flex-shrink-0',
                                isActive
                                  ? 'text-brand-600'
                                  : 'text-ink-400 group-hover:text-ink-700',
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-4 py-3">
          <div className="rounded-md bg-canvas-muted px-3 py-2.5">
            <p className="text-[11px] font-medium text-ink-700">
              Environment
            </p>
            <p className="mt-0.5 text-[11px] text-ink-500">
              <span className="inline-flex h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />
              <span className="ml-1.5">production · us-east1</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

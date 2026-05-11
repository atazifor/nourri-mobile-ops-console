import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BellOff,
  LifeBuoy,
  RotateCw,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/Loader';
import { PageHeader } from '@/components/PageHeader';
import { listAuditLogs } from '@/services/auditLogs';
import { getDashboardStats, type DashboardStats } from '@/services/dashboard';
import type { AuditLog } from '@/types';
import { formatRelative } from '@/utils/format';

interface StatTile {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  accent: string;
}

const STAT_TILES: StatTile[] = [
  {
    key: 'mobileUsers',
    label: 'Total mobile users',
    icon: Users,
    accent: 'bg-brand-50 text-brand-600 ring-brand-100',
  },
  {
    key: 'activeDevices',
    label: 'Active devices',
    icon: Smartphone,
    accent: 'bg-sky-50 text-sky-600 ring-sky-100',
  },
  {
    key: 'openSupportIssues',
    label: 'Open support issues',
    icon: LifeBuoy,
    accent: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  {
    key: 'failedNotifications',
    label: 'Failed notification events',
    icon: BellOff,
    accent: 'bg-rose-50 text-rose-600 ring-rose-100',
  },
];

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<AuditLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, logs] = await Promise.all([
        getDashboardStats(),
        listAuditLogs(8),
      ]);
      setStats(s);
      setRecent(logs);
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setError('Could not load dashboard. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Operations dashboard"
        description="Live snapshot of the Nourri Express mobile ecosystem in Yaoundé."
        actions={
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => void load()}
            leadingIcon={<RotateCw size={14} />}
          >
            Refresh
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-6 sm:px-8">
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <span className="flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void load()}
            >
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_TILES.map((tile) => (
            <StatCard
              key={tile.key}
              tile={tile}
              value={stats ? stats[tile.key] : null}
              loading={loading && !stats}
            />
          ))}
        </div>

        <Card>
          <CardHeader
            title="Recent operational activity"
            description="Latest writes captured in the audit log."
          />
          <CardBody className="p-0">
            {loading && !recent ? (
              <div className="flex items-center justify-center py-10">
                <Loader />
              </div>
            ) : !recent || recent.length === 0 ? (
              <div className="px-5 py-5">
                <EmptyState
                  title="No activity yet"
                  description="Admin updates across the console will appear here as they happen."
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((log) => (
                  <ActivityRow key={log.id} log={log} />
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function StatCard({
  tile,
  value,
  loading,
}: {
  tile: StatTile;
  value: number | null;
  loading: boolean;
}) {
  const Icon = tile.icon;
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-ink-500">{tile.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
            {loading ? (
              <span className="inline-block h-7 w-12 animate-pulse rounded bg-canvas-muted align-middle" />
            ) : (
              (value ?? '—').toLocaleString()
            )}
          </p>
        </div>
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ${tile.accent}`}
        >
          <Icon size={18} />
        </span>
      </CardBody>
    </Card>
  );
}

function ActivityRow({ log }: { log: AuditLog }) {
  const beforeStatus = (log.before as { status?: string } | null)?.status;
  const afterStatus = (log.after as { status?: string } | null)?.status;

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ink-900">
            {humanAction(log.action)}
          </span>
          {beforeStatus && afterStatus && (
            <span className="text-xs text-ink-400">
              {beforeStatus} → {afterStatus}
            </span>
          )}
          <Badge tone="neutral" className="font-mono normal-case">
            {log.entityType}/{log.entityId.slice(0, 6)}
          </Badge>
        </div>
        <p className="mt-1 truncate text-xs text-ink-500">
          by {log.performedByEmail || log.performedBy || 'system'}
        </p>
      </div>
      <span className="flex-shrink-0 text-[12px] text-ink-400">
        {formatRelative(log.createdAt)}
      </span>
    </li>
  );
}

function humanAction(action: string): string {
  switch (action) {
    case 'UPDATE_MOBILE_USER_STATUS':
      return 'Mobile user status updated';
    case 'UPDATE_SUPPORT_ISSUE_STATUS':
      return 'Support issue status updated';
    default:
      return action
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/^./, (c) => c.toUpperCase());
  }
}

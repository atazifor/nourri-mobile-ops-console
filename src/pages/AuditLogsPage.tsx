import { useEffect, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { TableSkeleton } from '@/components/TableSkeleton';
import { listAuditLogs } from '@/services/auditLogs';
import type { AuditLog } from '@/types';
import { formatRelative } from '@/utils/format';

type EntityFilter = 'all' | string;

const ENTITY_LABEL: Record<string, string> = {
  mobileUser: 'Mobile user',
  supportIssue: 'Support issue',
  device: 'Device',
  adminUser: 'Admin user',
};

const ACTION_LABEL: Record<string, string> = {
  UPDATE_MOBILE_USER_STATUS: 'Mobile user status updated',
  UPDATE_SUPPORT_ISSUE_STATUS: 'Support issue status updated',
};

function humanAction(action: string): string {
  return (
    ACTION_LABEL[action] ??
    action
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/^./, (c) => c.toUpperCase())
  );
}

function humanEntity(entityType: string): string {
  return ENTITY_LABEL[entityType] ?? entityType;
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await listAuditLogs(150));
    } catch (err) {
      console.error('Failed to load audit logs', err);
      setError('Could not load audit logs. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const entityOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.entityType));
    return Array.from(set).filter(Boolean).sort();
  }, [logs]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      if (entityFilter !== 'all' && log.entityType !== entityFilter)
        return false;
      if (!q) return true;
      return (
        log.action.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        log.performedByEmail.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery, entityFilter]);

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Audit logs"
        description="Immutable record of every admin write across the console — who did what, when, and to which entity."
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

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Recent activity"
            description={
              loading
                ? 'Loading…'
                : logs.length === 0
                  ? 'Backed by the auditLogs collection.'
                  : `${filtered.length} of ${logs.length} shown`
            }
          />
          <div className="flex flex-col gap-2 border-b border-border bg-canvas-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search action, entity, or actor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="sm:w-80"
              aria-label="Search audit logs"
            />
            <Select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              containerClassName="sm:w-48"
              aria-label="Filter by entity type"
            >
              <option value="all">All entity types</option>
              {entityOptions.map((entity) => (
                <option key={entity} value={entity}>
                  {humanEntity(entity)}
                </option>
              ))}
            </Select>
          </div>
          <CardBody className="p-0">
            {error ? (
              <div className="px-5 py-5">
                <div
                  role="alert"
                  className="flex items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  <span>{error}</span>
                  <Button size="sm" variant="secondary" onClick={() => void load()}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <div className="px-5 py-5">
                <EmptyState
                  title={logs.length === 0 ? 'No audit entries' : 'No matches'}
                  description={
                    logs.length === 0
                      ? 'Every admin write produces a record here with before/after snapshots and the acting user.'
                      : 'Adjust your search or filter to see other entries.'
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-canvas-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      <th className="px-5 py-2.5">Action</th>
                      <th className="px-5 py-2.5">Entity</th>
                      <th className="px-5 py-2.5">Change</th>
                      <th className="px-5 py-2.5">Performed by</th>
                      <th className="px-5 py-2.5">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log) => {
                      const beforeStatus = (
                        log.before as { status?: string } | null
                      )?.status;
                      const afterStatus = (
                        log.after as { status?: string } | null
                      )?.status;
                      return (
                        <tr
                          key={log.id}
                          className="border-b border-border last:border-b-0 hover:bg-canvas-muted/40"
                        >
                          <td className="px-5 py-3 text-[13px] font-medium text-ink-900">
                            {humanAction(log.action)}
                          </td>
                          <td className="px-5 py-3">
                            <Badge tone="neutral">
                              {humanEntity(log.entityType)}
                            </Badge>
                            <div className="mt-0.5 truncate font-mono text-[11px] text-ink-400">
                              {log.entityId}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-ink-700">
                            {beforeStatus && afterStatus ? (
                              <>
                                <span className="text-ink-500">{beforeStatus}</span>
                                <span className="mx-1.5 text-ink-300">→</span>
                                <span className="font-medium">{afterStatus}</span>
                              </>
                            ) : (
                              <span className="text-ink-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="truncate text-[13px] text-ink-700">
                              {log.performedByEmail || 'system'}
                            </div>
                            <div className="truncate font-mono text-[11px] text-ink-400">
                              {log.performedBy}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-ink-500">
                            {formatRelative(log.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

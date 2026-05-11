import { useEffect, useMemo, useState } from 'react';
import { Pencil, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/TableSkeleton';
import { useAuth } from '@/hooks/useAuth';
import {
  changeSupportIssueStatus,
  listSupportIssues,
} from '@/services/supportIssues';
import {
  SUPPORT_CATEGORIES,
  SUPPORT_STATUSES,
  type SupportCategory,
  type SupportIssue,
  type SupportPriority,
  type SupportStatus,
} from '@/types';
import { formatRelative } from '@/utils/format';
import { isAdmin } from '@/utils/roles';

type StatusFilter = 'all' | SupportStatus;
type CategoryFilter = 'all' | SupportCategory;

const STATUS_LABEL: Record<SupportStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const CATEGORY_LABEL: Record<SupportCategory, string> = {
  DELIVERY: 'Delivery',
  PHARMACY: 'Pharmacy',
  GROCERY: 'Grocery',
  PAYMENT: 'Payment',
  RIDER: 'Rider',
  APP_BUG: 'App bug',
};

function statusTone(status: SupportStatus) {
  switch (status) {
    case 'OPEN':
      return 'warning' as const;
    case 'IN_PROGRESS':
      return 'info' as const;
    case 'RESOLVED':
      return 'success' as const;
    case 'CLOSED':
      return 'neutral' as const;
  }
}

function priorityTone(p: SupportPriority) {
  switch (p) {
    case 'LOW':
      return 'neutral' as const;
    case 'MEDIUM':
      return 'info' as const;
    case 'HIGH':
      return 'warning' as const;
    case 'URGENT':
      return 'danger' as const;
  }
}

export function SupportPage() {
  const { profile } = useAuth();
  const canEdit = isAdmin(profile?.role);

  const [issues, setIssues] = useState<SupportIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [editingIssue, setEditingIssue] = useState<SupportIssue | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setIssues(await listSupportIssues());
    } catch (err) {
      console.error('Failed to load support issues', err);
      setError('Could not load support issues. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return issues.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && i.category !== categoryFilter)
        return false;
      if (!q) return true;
      return (
        i.subject.toLowerCase().includes(q) ||
        i.reportedByName.toLowerCase().includes(q) ||
        i.reportedByEmail.toLowerCase().includes(q) ||
        (i.orderRef ?? '').toLowerCase().includes(q)
      );
    });
  }, [issues, searchQuery, statusFilter, categoryFilter]);

  const handleStatusSaved = (updated: SupportIssue) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const openCount = useMemo(
    () =>
      issues.filter((i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS')
        .length,
    [issues],
  );

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Support issues"
        description="Triage and resolve customer-reported issues across food delivery, pharmacy, and grocery."
        actions={
          <div className="flex items-center gap-2">
            {!loading && (
              <StatusBadge tone={openCount > 0 ? 'warning' : 'success'}>
                {openCount > 0 ? `${openCount} open` : 'All caught up'}
              </StatusBadge>
            )}
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => void load()}
              leadingIcon={<RotateCw size={14} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Triage queue"
            description={
              loading
                ? 'Loading…'
                : issues.length === 0
                  ? 'Backed by the supportIssues collection.'
                  : `${filtered.length} of ${issues.length} shown`
            }
          />
          <div className="flex flex-col gap-2 border-b border-border bg-canvas-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search subject, reporter, or order"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="sm:w-72"
              aria-label="Search support issues"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                containerClassName="sm:w-44"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {SUPPORT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </Select>
              <Select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as CategoryFilter)
                }
                containerClassName="sm:w-44"
                aria-label="Filter by category"
              >
                <option value="all">All categories</option>
                {SUPPORT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </Select>
            </div>
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
                  title={
                    issues.length === 0
                      ? 'No support issues'
                      : 'No matches'
                  }
                  description={
                    issues.length === 0
                      ? 'Tickets submitted from the Nourri Express mobile app will show up here for triage.'
                      : 'Adjust your search or filters to see other issues.'
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-canvas-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      <th className="px-5 py-2.5">Issue</th>
                      <th className="px-5 py-2.5">Reporter</th>
                      <th className="px-5 py-2.5">Category</th>
                      <th className="px-5 py-2.5">Priority</th>
                      <th className="px-5 py-2.5">Status</th>
                      <th className="px-5 py-2.5">Updated</th>
                      {canEdit && <th className="px-5 py-2.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((issue) => (
                      <tr
                        key={issue.id}
                        className="border-b border-border last:border-b-0 hover:bg-canvas-muted/40"
                      >
                        <td className="px-5 py-3">
                          <div className="truncate text-[13px] font-medium text-ink-900">
                            {issue.subject}
                          </div>
                          <div className="truncate text-[11px] text-ink-400">
                            {issue.orderRef ? (
                              <>Order {issue.orderRef} · </>
                            ) : null}
                            {issue.id}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="truncate text-[13px] text-ink-700">
                            {issue.reportedByName || '—'}
                          </div>
                          <div className="truncate text-[11px] text-ink-400">
                            {issue.reportedByEmail || '—'}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone="neutral">
                            {CATEGORY_LABEL[issue.category]}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={priorityTone(issue.priority)}>
                            {issue.priority}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge tone={statusTone(issue.status)}>
                            {STATUS_LABEL[issue.status]}
                          </StatusBadge>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-ink-500">
                          {formatRelative(issue.updatedAt)}
                        </td>
                        {canEdit && (
                          <td className="px-5 py-3 text-right">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingIssue(issue)}
                              leadingIcon={<Pencil size={12} />}
                            >
                              Update
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <EditIssueStatusModal
        issue={editingIssue}
        onClose={() => setEditingIssue(null)}
        onSaved={handleStatusSaved}
      />
    </>
  );
}

interface EditIssueStatusModalProps {
  issue: SupportIssue | null;
  onClose: () => void;
  onSaved: (updated: SupportIssue) => void;
}

function EditIssueStatusModal({
  issue,
  onClose,
  onSaved,
}: EditIssueStatusModalProps) {
  const { user: firebaseUser, profile } = useAuth();
  const [nextStatus, setNextStatus] = useState<SupportStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setNextStatus(issue.status);
      setError(null);
      setSaving(false);
    }
  }, [issue]);

  const handleSave = async () => {
    if (!issue || !nextStatus || !firebaseUser) return;
    if (nextStatus === issue.status) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await changeSupportIssueStatus({
        issue,
        nextStatus,
        performedBy: {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? profile?.email ?? '',
        },
      });
      onSaved({ ...issue, status: nextStatus, updatedAt: new Date() });
      toast.success(`Issue moved to ${STATUS_LABEL[nextStatus]}`);
      onClose();
    } catch (err) {
      console.error('Failed to update support issue', err);
      setError('Could not save changes. Try again.');
      toast.error('Could not update issue.');
      setSaving(false);
    }
  };

  const dirty =
    issue !== null && nextStatus !== null && nextStatus !== issue.status;

  return (
    <Modal
      open={issue !== null}
      onClose={() => {
        if (!saving) onClose();
      }}
      title="Update issue status"
      description={issue ? issue.subject : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => void handleSave()}
            loading={saving}
            disabled={!dirty}
          >
            Save changes
          </Button>
        </>
      }
    >
      {issue && nextStatus && (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-canvas-muted/50 px-3 py-2.5 text-xs text-ink-600">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink-500">Reporter</span>
              <span className="text-ink-800">
                {issue.reportedByName || issue.reportedByEmail}
              </span>
            </div>
            {issue.orderRef && (
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-medium text-ink-500">Order</span>
                <span className="font-mono text-ink-800">{issue.orderRef}</span>
              </div>
            )}
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-medium text-ink-500">Current status</span>
              <StatusBadge tone={statusTone(issue.status)}>
                {STATUS_LABEL[issue.status]}
              </StatusBadge>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-ink-700">New status</span>
            <Select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value as SupportStatus)}
              containerClassName="mt-1.5"
            >
              {SUPPORT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </Select>
            <p className="mt-2 text-[11px] text-ink-400">
              A record will be appended to the audit log when you save.
            </p>
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
            >
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

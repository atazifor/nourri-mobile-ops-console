import { useEffect, useMemo, useState } from 'react';
import { Pencil, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import {
  changeMobileUserStatus,
  listMobileUsers,
} from '@/services/mobileUsers';
import {
  MOBILE_USER_STATUSES,
  type MobileUser,
  type MobileUserStatus,
} from '@/types';
import { formatRelative } from '@/utils/format';
import { isAdmin } from '@/utils/roles';

type StatusFilter = 'all' | MobileUserStatus;

const STATUS_LABELS: Record<MobileUserStatus, string> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  PENDING: 'Pending',
};

function statusTone(
  status: MobileUserStatus,
): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'SUSPENDED':
      return 'danger';
    case 'PENDING':
      return 'warning';
  }
}

export function MobileUsersPage() {
  const { profile } = useAuth();
  const canEdit = isAdmin(profile?.role);

  const [users, setUsers] = useState<MobileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editingUser, setEditingUser] = useState<MobileUser | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listMobileUsers());
    } catch (err) {
      console.error('Failed to load mobile users:', err);
      setError('Could not load users. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, statusFilter]);

  const handleStatusSaved = (updated: MobileUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Mobile users"
        description="Customer, rider, restaurant, and support accounts across the Nourri Express mobile platform."
        actions={
          <Button
            variant="secondary"
            onClick={() => void loadUsers()}
            disabled={loading}
            leadingIcon={<RotateCw size={14} />}
          >
            Refresh
          </Button>
        }
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="All mobile users"
            description={
              loading
                ? 'Loading…'
                : users.length === 0
                  ? 'Backed by the mobileUsers collection.'
                  : `${filteredUsers.length} of ${users.length} shown`
            }
          />

          <div className="flex flex-col gap-2 border-b border-border bg-canvas-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="sm:w-72"
              aria-label="Search mobile users"
            />
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilter)
              }
              containerClassName="sm:w-44"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {MOBILE_USER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
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
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void loadUsers()}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <TableSkeleton />
            ) : filteredUsers.length === 0 ? (
              <div className="px-5 py-5">
                <EmptyState
                  title={
                    users.length === 0 ? 'No mobile users yet' : 'No matches'
                  }
                  description={
                    users.length === 0
                      ? 'Newly registered users from the Nourri Express mobile app will appear here.'
                      : 'Adjust your search or status filter to see other accounts.'
                  }
                />
              </div>
            ) : (
              <UsersTable
                users={filteredUsers}
                canEdit={canEdit}
                onEdit={(u) => setEditingUser(u)}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <EditStatusModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={handleStatusSaved}
      />
    </>
  );
}

interface UsersTableProps {
  users: MobileUser[];
  canEdit: boolean;
  onEdit: (user: MobileUser) => void;
}

function UsersTable({ users, canEdit, onEdit }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-canvas-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <th className="px-5 py-2.5">User</th>
            <th className="px-5 py-2.5">Contact</th>
            <th className="px-5 py-2.5">Role</th>
            <th className="px-5 py-2.5">Status</th>
            <th className="px-5 py-2.5">Last active</th>
            {canEdit && (
              <th className="px-5 py-2.5 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              canEdit={canEdit}
              onEdit={() => onEdit(u)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface UserRowProps {
  user: MobileUser;
  canEdit: boolean;
  onEdit: () => void;
}

function UserRow({ user, canEdit, onEdit }: UserRowProps) {
  const initial = (user.name[0] ?? user.email[0] ?? '?').toUpperCase();

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-canvas-muted/40">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white"
          >
            {initial}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-ink-900">
              {user.name || '—'}
            </div>
            <div className="truncate font-mono text-[11px] text-ink-400">
              {user.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="truncate text-[13px] text-ink-700">
          {user.email || '—'}
        </div>
        <div className="truncate text-[11px] text-ink-400">
          {user.phone || '—'}
        </div>
      </td>
      <td className="px-5 py-3">
        <span className="inline-flex rounded-md bg-canvas-muted px-2 py-0.5 text-[11px] font-medium text-ink-700">
          {user.role}
        </span>
      </td>
      <td className="px-5 py-3">
        <StatusBadge tone={statusTone(user.status)}>
          {STATUS_LABELS[user.status]}
        </StatusBadge>
      </td>
      <td className="px-5 py-3 text-[12px] text-ink-500">
        {user.lastActiveAt ? formatRelative(user.lastActiveAt) : 'Never'}
      </td>
      {canEdit && (
        <td className="px-5 py-3 text-right">
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            leadingIcon={<Pencil size={12} />}
          >
            Edit status
          </Button>
        </td>
      )}
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-md border border-border px-3 py-3"
        >
          <div className="h-8 w-8 animate-pulse rounded-full bg-canvas-muted" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-40 animate-pulse rounded bg-canvas-muted" />
            <div className="h-2.5 w-56 animate-pulse rounded bg-canvas-muted/70" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-canvas-muted" />
        </div>
      ))}
    </div>
  );
}

interface EditStatusModalProps {
  user: MobileUser | null;
  onClose: () => void;
  onSaved: (updated: MobileUser) => void;
}

function EditStatusModal({ user, onClose, onSaved }: EditStatusModalProps) {
  const { user: firebaseUser, profile } = useAuth();
  const [nextStatus, setNextStatus] = useState<MobileUserStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNextStatus(user.status);
      setError(null);
      setSaving(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !nextStatus || !firebaseUser) return;
    if (nextStatus === user.status) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await changeMobileUserStatus({
        user,
        nextStatus,
        performedBy: {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? profile?.email ?? '',
        },
      });
      onSaved({ ...user, status: nextStatus });
      toast.success(
        `${user.name || user.email} is now ${STATUS_LABELS[nextStatus]}`,
      );
      onClose();
    } catch (err) {
      console.error('Failed to update mobile user status:', err);
      setError('Could not save changes. Try again.');
      toast.error('Could not save status change.');
      setSaving(false);
    }
  };

  const dirty = user !== null && nextStatus !== null && nextStatus !== user.status;

  return (
    <Modal
      open={user !== null}
      onClose={() => {
        if (!saving) onClose();
      }}
      title="Edit account status"
      description={
        user ? `${user.name || user.email || '—'} · ${user.id}` : undefined
      }
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
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
      {user && nextStatus && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md bg-canvas-muted px-3 py-2">
            <span className="text-xs font-medium text-ink-500">
              Current status
            </span>
            <StatusBadge tone={statusTone(user.status)}>
              {STATUS_LABELS[user.status]}
            </StatusBadge>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-ink-700">
              New status
            </span>
            <Select
              value={nextStatus}
              onChange={(e) =>
                setNextStatus(e.target.value as MobileUserStatus)
              }
              containerClassName="mt-1.5"
            >
              {MOBILE_USER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
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

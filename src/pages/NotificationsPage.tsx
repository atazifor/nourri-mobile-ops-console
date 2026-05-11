import { useEffect, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/TableSkeleton';
import { listNotificationEvents } from '@/services/notificationEvents';
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUSES,
  type NotificationChannel,
  type NotificationEvent,
  type NotificationStatus,
} from '@/types';
import { formatRelative } from '@/utils/format';

type StatusFilter = 'all' | NotificationStatus;
type ChannelFilter = 'all' | NotificationChannel;

const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  ORDER_UPDATE: 'Order update',
  PROMO: 'Promo',
  SUPPORT_REPLY: 'Support reply',
  PAYMENT: 'Payment',
  SYSTEM: 'System',
};

const STATUS_LABEL: Record<NotificationStatus, string> = {
  SENT: 'Sent',
  PARTIAL: 'Partial',
  FAILED: 'Failed',
};

function statusTone(status: NotificationStatus) {
  switch (status) {
    case 'SENT':
      return 'success' as const;
    case 'PARTIAL':
      return 'warning' as const;
    case 'FAILED':
      return 'danger' as const;
  }
}

export function NotificationsPage() {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await listNotificationEvents());
    } catch (err) {
      console.error('Failed to load notification events', err);
      setError('Could not load notification events. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (channelFilter !== 'all' && e.channel !== channelFilter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q)
      );
    });
  }, [events, searchQuery, statusFilter, channelFilter]);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Notifications"
        description="History of outbound push events and campaigns, including delivery and failure breakdowns."
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
            title="Recent events"
            description={
              loading
                ? 'Loading…'
                : events.length === 0
                  ? 'Backed by the notificationEvents collection.'
                  : `${filtered.length} of ${events.length} shown`
            }
          />
          <div className="flex flex-col gap-2 border-b border-border bg-canvas-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search title or body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="sm:w-72"
              aria-label="Search notification events"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={channelFilter}
                onChange={(e) =>
                  setChannelFilter(e.target.value as ChannelFilter)
                }
                containerClassName="sm:w-44"
                aria-label="Filter by channel"
              >
                <option value="all">All channels</option>
                {NOTIFICATION_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {CHANNEL_LABEL[c]}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                containerClassName="sm:w-40"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {NOTIFICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
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
                    events.length === 0
                      ? 'No notification events'
                      : 'No matches'
                  }
                  description={
                    events.length === 0
                      ? 'Push events sent via Cloud Messaging will appear here with delivery breakdowns.'
                      : 'Adjust your search or filters to see other events.'
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-canvas-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      <th className="px-5 py-2.5">Title</th>
                      <th className="px-5 py-2.5">Channel</th>
                      <th className="px-5 py-2.5">Delivery</th>
                      <th className="px-5 py-2.5">Status</th>
                      <th className="px-5 py-2.5">Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => {
                      const deliveryRate =
                        e.recipientCount > 0
                          ? Math.round((e.deliveredCount / e.recipientCount) * 100)
                          : 0;
                      return (
                        <tr
                          key={e.id}
                          className="border-b border-border last:border-b-0 hover:bg-canvas-muted/40"
                        >
                          <td className="px-5 py-3">
                            <div className="truncate text-[13px] font-medium text-ink-900">
                              {e.title}
                            </div>
                            <div className="line-clamp-1 text-[11px] text-ink-400">
                              {e.body}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <Badge tone="neutral">{CHANNEL_LABEL[e.channel]}</Badge>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-ink-700">
                            <div>
                              {e.deliveredCount.toLocaleString()} /{' '}
                              {e.recipientCount.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-ink-400">
                              {deliveryRate}% delivered
                              {e.failedCount > 0 && (
                                <span className="text-rose-600">
                                  {' · '}
                                  {e.failedCount.toLocaleString()} failed
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge tone={statusTone(e.status)}>
                              {STATUS_LABEL[e.status]}
                            </StatusBadge>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-ink-500">
                            {formatRelative(e.sentAt)}
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

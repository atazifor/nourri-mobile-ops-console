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
import { listDevices } from '@/services/devices';
import {
  DEVICE_PLATFORMS,
  DEVICE_STATUSES,
  type Device,
  type DevicePlatform,
  type DeviceStatus,
} from '@/types';
import { formatRelative } from '@/utils/format';

type PlatformFilter = 'all' | DevicePlatform;
type StatusFilter = 'all' | DeviceStatus;

const PLATFORM_LABEL: Record<DevicePlatform, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
};

const STATUS_LABEL: Record<DeviceStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setDevices(await listDevices());
    } catch (err) {
      console.error('Failed to load devices', err);
      setError('Could not load devices. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return devices.filter((d) => {
      if (platformFilter !== 'all' && d.platform !== platformFilter) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (!q) return true;
      return (
        d.ownerName.toLowerCase().includes(q) ||
        d.ownerEmail.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      );
    });
  }, [devices, searchQuery, platformFilter, statusFilter]);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Devices"
        description="Registered handsets across iOS and Android with push token health and last-seen times."
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
            title="Registered devices"
            description={
              loading
                ? 'Loading…'
                : devices.length === 0
                  ? 'Backed by the devices collection.'
                  : `${filtered.length} of ${devices.length} shown`
            }
          />
          <div className="flex flex-col gap-2 border-b border-border bg-canvas-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search by owner or device ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="sm:w-72"
              aria-label="Search devices"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as PlatformFilter)
                }
                containerClassName="sm:w-40"
                aria-label="Filter by platform"
              >
                <option value="all">All platforms</option>
                {DEVICE_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABEL[p]}
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
                {DEVICE_STATUSES.map((s) => (
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
                    devices.length === 0
                      ? 'No devices registered'
                      : 'No matches'
                  }
                  description={
                    devices.length === 0
                      ? 'Devices register automatically the first time a customer opens the Nourri Express mobile app.'
                      : 'Adjust your search or filters to see other devices.'
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-canvas-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                      <th className="px-5 py-2.5">Owner</th>
                      <th className="px-5 py-2.5">Platform</th>
                      <th className="px-5 py-2.5">App version</th>
                      <th className="px-5 py-2.5">Push token</th>
                      <th className="px-5 py-2.5">Status</th>
                      <th className="px-5 py-2.5">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-border last:border-b-0 hover:bg-canvas-muted/40"
                      >
                        <td className="px-5 py-3">
                          <div className="truncate text-[13px] font-medium text-ink-900">
                            {d.ownerName || '—'}
                          </div>
                          <div className="truncate text-[11px] text-ink-400">
                            {d.ownerEmail || '—'}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={d.platform === 'IOS' ? 'info' : 'success'}>
                            {PLATFORM_LABEL[d.platform]}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 font-mono text-[12px] text-ink-700">
                          {d.appVersion}
                        </td>
                        <td className="px-5 py-3">
                          <code className="rounded bg-canvas-muted px-1.5 py-0.5 font-mono text-[11px] text-ink-700">
                            {d.pushToken
                              ? `${d.pushToken.slice(0, 10)}…${d.pushToken.slice(-4)}`
                              : '—'}
                          </code>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge
                            tone={d.status === 'ACTIVE' ? 'success' : 'neutral'}
                          >
                            {STATUS_LABEL[d.status]}
                          </StatusBadge>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-ink-500">
                          {d.lastSeenAt ? formatRelative(d.lastSeenAt) : 'Never'}
                        </td>
                      </tr>
                    ))}
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

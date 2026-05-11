import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';

const STATS = [
  { label: 'Active mobile users (24h)', value: '—', delta: 'Awaiting Firestore' },
  { label: 'Registered devices', value: '—', delta: 'Awaiting Firestore' },
  { label: 'Open support issues', value: '—', delta: 'Awaiting Firestore' },
  { label: 'Push events sent (24h)', value: '—', delta: 'Awaiting Firestore' },
];

export function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Operations dashboard"
        description="Real-time health of the Nourri Express mobile ecosystem. Metrics will populate once Firestore is connected."
        actions={<StatusBadge tone="success">All systems nominal</StatusBadge>}
      />

      <div className="space-y-6 px-6 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardBody>
                <p className="text-xs font-medium text-ink-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-ink-400">{stat.delta}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader
              title="Recent admin activity"
              description="Latest writes captured in the audit log."
            />
            <CardBody>
              <EmptyState
                title="No activity yet"
                description="Audit entries will appear here once admins start making changes through the console."
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Service status"
              description="Backing Firebase services."
            />
            <CardBody className="space-y-3">
              <ServiceRow name="Authentication" status="success" />
              <ServiceRow name="Cloud Firestore" status="success" />
              <ServiceRow name="Cloud Messaging" status="success" />
              <ServiceRow name="Cloud Functions" status="warning" />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function ServiceRow({
  name,
  status,
}: {
  name: string;
  status: 'success' | 'warning' | 'danger';
}) {
  const label =
    status === 'success'
      ? 'Operational'
      : status === 'warning'
        ? 'Degraded'
        : 'Outage';
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-700">{name}</span>
      <StatusBadge tone={status}>{label}</StatusBadge>
    </div>
  );
}

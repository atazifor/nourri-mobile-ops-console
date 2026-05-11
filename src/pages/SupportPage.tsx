import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';

export function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Support issues"
        description="Triage and resolve support tickets raised from the Nourri mobile app."
        actions={<StatusBadge tone="warning">0 open</StatusBadge>}
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Open queue"
            description="Backed by the supportIssues collection."
          />
          <CardBody>
            <EmptyState
              title="Support queue is empty"
              description="When customers report an issue from the app, it will land here for triage with severity, owner, and SLA timers."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

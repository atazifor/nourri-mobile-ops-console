import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';

export function AuditLogsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Audit logs"
        description="Immutable record of every admin write across the console — who did what, when, and to which entity."
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Recent activity"
            description="Backed by the auditLogs collection."
          />
          <CardBody>
            <EmptyState
              title="No audit entries yet"
              description="Each admin update will produce a record with before/after snapshots and the acting user. Filterable by action, actor, and entity."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

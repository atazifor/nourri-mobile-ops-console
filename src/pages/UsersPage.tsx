import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';

export function UsersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Mobile users"
        description="Search, inspect, and update Nourri Express customer accounts."
        actions={
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink-700 hover:bg-canvas-muted"
          >
            Export CSV
          </button>
        }
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="All users"
            description="Backed by the mobileUsers collection."
          />
          <CardBody>
            <EmptyState
              title="User table coming soon"
              description="Once Firestore is wired up, this view will list customers with filters by status, signup date, and last activity."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';

export function NotificationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Notifications"
        description="History of outbound push campaigns and transactional notification events."
        actions={
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md bg-brand-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Compose campaign
          </button>
        }
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Recent events"
            description="Backed by the notificationEvents collection."
          />
          <CardBody>
            <EmptyState
              title="No notification events yet"
              description="Once Cloud Messaging is connected, you'll see delivery, open, and failure breakdowns per campaign."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

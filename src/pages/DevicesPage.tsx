import { Card, CardBody, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';

export function DevicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Devices"
        description="Registered handsets across iOS and Android with their push tokens and last-seen timestamps."
      />

      <div className="px-6 py-6 sm:px-8">
        <Card>
          <CardHeader
            title="Registered devices"
            description="Backed by the devices collection."
          />
          <CardBody>
            <EmptyState
              title="Device inventory coming soon"
              description="This page will surface device platform, app version, push token health, and last-sync time."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

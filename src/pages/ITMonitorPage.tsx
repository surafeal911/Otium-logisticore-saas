import { Page, PageHeader, PageTitle, PageDescription, PageBody, EmptyState } from '@blinkdotnew/ui';
import { Monitor } from 'lucide-react';

export function ITMonitorPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>IT Technical Monitor</PageTitle>
        <PageDescription>Revise and manage technical issues reported by users regarding their hardware and software.</PageDescription>
      </PageHeader>
      <PageBody>
        <EmptyState 
          icon={<Monitor />} 
          title="No hardware issues" 
          description="Go to the Complaints section to see detailed technical reports routed to your account."
        />
      </PageBody>
    </Page>
  );
}

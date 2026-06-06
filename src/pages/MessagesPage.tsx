import { Page, PageHeader, PageTitle, PageDescription, PageBody, EmptyState } from '@blinkdotnew/ui';
import { MessageSquare } from 'lucide-react';

export function MessagesPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Internal Messaging</PageTitle>
        <PageDescription>Communicate with your team members across roles.</PageDescription>
      </PageHeader>
      <PageBody>
        <EmptyState 
          icon={<MessageSquare />} 
          title="No messages yet" 
          description="Your internal communications will appear here once they start flowing."
        />
      </PageBody>
    </Page>
  );
}

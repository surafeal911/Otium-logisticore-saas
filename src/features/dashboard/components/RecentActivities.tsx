import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, StructuredList, StructuredListItem } from '@blinkdotnew/ui';
import { Activity, Truck, AlertCircle, ChevronRight } from 'lucide-react';

interface RecentActivitiesProps {
  activities: any[];
  carriers: any[];
  onCarrierClick: (carrier: any) => void;
  onViewComplaints: () => void;
}

export function RecentActivities({ activities, carriers, onCarrierClick, onViewComplaints }: RecentActivitiesProps) {
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StructuredList>
          {activities.map((activity) => (
            <StructuredListItem 
              key={activity.id} 
              icon={activity.type === 'CARRIER' ? <Truck className="text-primary" /> : <AlertCircle className="text-red-500" />}
              title={activity.title}
              description={new Date(activity.time).toLocaleString()}
              actions={
                <ChevronRight 
                  size={18} 
                  className="text-muted-foreground cursor-pointer hover:text-primary" 
                  onClick={() => {
                    if (activity.type === 'CARRIER') {
                      const carrier = carriers.find(c => c.id === activity.id);
                      if (carrier) {
                        onCarrierClick(carrier);
                      }
                    } else {
                      onViewComplaints();
                    }
                  }}
                />
              }
            />
          ))}
        </StructuredList>
      </CardContent>
    </Card>
  );
}

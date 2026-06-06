import React from 'react';
import { Card, CardContent } from '@blinkdotnew/ui';
import { Truck, LayoutGrid } from 'lucide-react';

interface SupervisorStatsProps {
  profile: any;
  stats: {
    ownCarriers: number;
    marketerGiven: number;
  };
}

export function SupervisorStats({ profile, stats }: SupervisorStatsProps) {
  if (!(profile?.role === 'MARKETING_SUPERVISOR' || profile?.role === 'DISPATCHER_SUPERVISOR')) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Direct Carriers</p>
              <h3 className="text-2xl font-bold">{stats.ownCarriers}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="text-primary" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned from Marketers</p>
              <h3 className="text-2xl font-bold">{stats.marketerGiven}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <LayoutGrid className="text-emerald-500" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

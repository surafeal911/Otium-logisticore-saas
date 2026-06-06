import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Persona } from '@blinkdotnew/ui';
import { Users } from 'lucide-react';

interface TeamOnDutyProps {
  onlineProfiles: any[];
}

export function TeamOnDuty({ onlineProfiles }: TeamOnDutyProps) {
  return (
    <Card className="lg:col-span-2 bg-card/30 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Users size={24} className="text-primary" />
          Team on Duty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {onlineProfiles.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-card/40 border border-border/50 flex items-center justify-between group hover:bg-card/60 transition-all">
              <Persona 
                name={p.full_name} 
                subtitle={p.role.replace('_', ' ')}
                className="text-white"
              />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Online</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

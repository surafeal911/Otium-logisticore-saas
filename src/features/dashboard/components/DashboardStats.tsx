import React from 'react';
import { StatGroup, Stat } from '@blinkdotnew/ui';
import { Activity, CheckCircle, ShieldAlert, Filter } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    newClients: number;
    active: number;
    inactive: number;
    remarket: number;
  };
  onStatClick: (type: string, value: string) => void;
}

export function DashboardStats({ stats, onStatClick }: DashboardStatsProps) {
  return (
    <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Stat 
        label="New Clients (7 Days)" 
        value={stats.newClients.toString()} 
        icon={<Activity className="text-blue-500" />}
        className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:bg-card/80 transition-all hover:scale-105"
        onClick={() => onStatClick('/carriers', 'new')}
      />
      <Stat 
        label="Active Fleet" 
        value={stats.active.toString()} 
        icon={<CheckCircle className="text-emerald-500" />}
        className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:bg-card/80 transition-all hover:scale-105"
        onClick={() => onStatClick('/carriers', 'active')}
      />
      <Stat 
        label="Inactive Fleet" 
        value={stats.inactive.toString()} 
        icon={<ShieldAlert className="text-red-500" />}
        className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:bg-card/80 transition-all hover:scale-105"
        onClick={() => onStatClick('/carriers', 'inactive')}
      />
      <Stat 
        label="Remarket" 
        value={stats.remarket.toString()} 
        icon={<Filter className="text-amber-500" />}
        className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:bg-card/80 transition-all hover:scale-105"
        onClick={() => onStatClick('/carriers', 'remarket')}
      />
    </StatGroup>
  );
}

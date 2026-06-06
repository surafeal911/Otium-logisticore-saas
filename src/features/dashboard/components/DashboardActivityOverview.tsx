import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@blinkdotnew/ui';
import { 
  ClipboardList, 
  Sparkles, 
  Trophy, 
  Activity, 
  ChevronRight, 
  Clock,
  LayoutList
} from 'lucide-react';

export function DashboardActivityOverview() {
  return (
    <div className="space-y-8">
      {/* Top row: Tasks, Opportunities, Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Tasks */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ClipboardList className="text-amber-500" size={20} />
              </div>
              <CardTitle className="text-base font-bold">My Tasks</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
              View all <ChevronRight size={14} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Badge variant="secondary" className="bg-secondary/50 cursor-pointer">All</Badge>
              <Badge variant="ghost" className="text-muted-foreground cursor-pointer">Overdue</Badge>
              <Badge variant="ghost" className="text-muted-foreground cursor-pointer">Today</Badge>
              <Badge variant="ghost" className="text-muted-foreground cursor-pointer">Week</Badge>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 bg-muted/50 rounded-xl mb-3 text-muted-foreground/50">
                <LayoutList size={24} />
              </div>
              <p className="text-sm font-medium text-foreground">No tasks found</p>
              <p className="text-xs text-muted-foreground">All caught up!</p>
            </div>
          </CardContent>
        </Card>

        {/* My Opportunities */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Sparkles className="text-emerald-500" size={20} />
              </div>
              <CardTitle className="text-base font-bold">My Opportunities</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
              View all <ChevronRight size={14} />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted/50 rounded-xl mb-3 text-muted-foreground/50">
              <Sparkles size={24} />
            </div>
            <p className="text-sm font-medium text-foreground">No open opportunities</p>
            <p className="text-xs text-muted-foreground">Create one to start tracking</p>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="text-primary" size={20} />
              </div>
              <CardTitle className="text-base font-bold">Goal Progress</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
              View All <ChevronRight size={14} />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No active goals</p>
            <button className="text-sm font-medium text-primary hover:underline">
              Create a goal
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Activity */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="text-primary" size={20} />
            </div>
            <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground bg-muted/30 px-3 gap-1">
            View all <ChevronRight size={14} />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-3 bg-muted/50 rounded-full mb-3 text-muted-foreground/50">
            <Clock size={24} />
          </div>
          <p className="text-sm font-medium text-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground">Actions will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}

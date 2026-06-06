import React from 'react';
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  MobileSidebarTrigger, 
  SidebarItem, 
  Button,
  Persona
} from '@blinkdotnew/ui';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  MessageSquare, 
  AlertCircle, 
  Settings, 
  LogOut,
  ShieldCheck,
  Monitor
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from '@tanstack/react-router';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/login' });
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
    { icon: <Truck size={20} />, label: 'Carriers', href: '/carriers' },
    { icon: <MessageSquare size={20} />, label: 'Messages', href: '/messages' },
    { icon: <AlertCircle size={20} />, label: 'Complaints', href: '/complaints' },
  ];

  if (profile?.role === 'IT_DISPATCHER') {
    menuItems.push({ icon: <Monitor size={20} />, label: 'IT Monitor', href: '/it-monitor' });
  }

  if (profile?.role === 'ADMIN' || profile?.role?.includes('SUPERVISOR')) {
    menuItems.push({ icon: <ShieldCheck size={20} />, label: 'Management', href: '/management' });
  }

  return (
    <AppShell>
      <AppShellSidebar className="shrink-0">
        <div className="flex flex-col h-full w-[16rem] bg-sidebar border-r border-sidebar-border overflow-hidden">
          <div className="shrink-0 border-b border-sidebar-border px-6 py-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">L</div>
            <span className="font-bold text-lg tracking-tight">LogistiCore</span>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.href}
                icon={item.icon} 
                label={item.label} 
                href={item.href}
                active={(window.location.pathname === item.href) || undefined}
              />
            ))}
          </div>

          <div className="shrink-0 border-t border-sidebar-border p-4 bg-sidebar/50 backdrop-blur-sm">
            {profile && (
              <div className="mb-4 px-2">
                <Persona 
                  name={profile.full_name} 
                  subtitle={profile.role.replace('_', ' ')} 
                  className="mb-4"
                />
              </div>
            )}
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Settings size={16} /> Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut size={16} /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </AppShellSidebar>

      <AppShellMain>
        <div className="md:hidden flex items-center gap-3 px-6 h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <MobileSidebarTrigger />
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">L</div>
          <span className="font-bold text-lg">LogistiCore</span>
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </AppShellMain>
    </AppShell>
  );
}

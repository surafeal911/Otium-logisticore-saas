import React, { useEffect, useState } from 'react';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, toast } from '@blinkdotnew/ui';
import { TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { CarrierDetailModal } from '../features/carriers/components/CarrierDetailModal';
import { RegistrationVolumeChart } from '../features/dashboard/components/RegistrationVolumeChart';
import { TruckTypeDistribution } from '../features/dashboard/components/TruckTypeDistribution';
import { TeamPerformanceChart } from '../features/dashboard/components/TeamPerformanceChart';
import { TeamOnDuty } from '../features/dashboard/components/TeamOnDuty';
import { RecentActivities } from '../features/dashboard/components/RecentActivities';
import { DashboardStats } from '../features/dashboard/components/DashboardStats';
import { DashboardActivityOverview } from '../features/dashboard/components/DashboardActivityOverview';
import { useNavigate } from '@tanstack/react-router';

export function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    newClients: 0,
    active: 0,
    inactive: 0,
    remarket: 0,
  });
  const [carriers, setCarriers] = useState<any[]>([]);
  const [onlineProfiles, setOnlineProfiles] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Chart Data State
  const [regVolumeData, setRegVolumeData] = useState<any[]>([]);
  const [truckTypeData, setTruckTypeData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Detail Modal State
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [dispatchers, setDispatchers] = useState<any[]>([]);
  const [selectedDispatcherId, setSelectedDispatcherId] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [carriersRes, profilesRes, complaintsRes] = await Promise.all([
        supabase
          .from('carriers')
          .select(`
            *,
            marketer:profiles!marketer_id(id, full_name),
            dispatcher:profiles!dispatcher_id(id, full_name)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').limit(10),
        supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (carriersRes.data) {
        const allCarriers = carriersRes.data;
        const newC = allCarriers.filter(c => new Date(c.created_at) >= sevenDaysAgo).length;
        const activeC = allCarriers.filter(c => c.status === 'ACTIVE').length;
        const inactiveC = allCarriers.filter(c => c.status === 'INACTIVE').length;
        const remarketC = allCarriers.filter(c => c.status === 'REMARKET').length;

        setStats({
          newClients: newC,
          active: activeC,
          inactive: inactiveC,
          remarket: remarketC
        });

        setCarriers(allCarriers.slice(0, 5));

        // Process Registration Volume (Last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const volume = days.map((day, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const count = allCarriers.filter(c => 
            new Date(c.created_at).toDateString() === d.toDateString()
          ).length;
          return { name: day, count };
        });
        setRegVolumeData(volume);

        // Process Truck Type Distribution
        const types: any = {};
        allCarriers.forEach(c => {
          const type = c.truck_type || 'Unknown';
          types[type] = (types[type] || 0) + 1;
        });
        setTruckTypeData(Object.entries(types).map(([name, value]) => ({ name, value })));

        // Performance Data (Mock for UI)
        setPerformanceData([
          { name: 'W1', performance: 85 },
          { name: 'W2', performance: 92 },
          { name: 'W3', performance: 88 },
          { name: 'W4', performance: 95 },
        ]);
      }

      if (profilesRes.data) setOnlineProfiles(profilesRes.data);
      
      const activities = [
        ...(carriersRes.data || []).map(c => ({ 
          id: c.id, 
          type: 'CARRIER', 
          title: `New Carrier: ${c.organization_name}`, 
          time: c.created_at 
        })),
        ...(complaintsRes.data || []).map(c => ({ 
          id: c.id, 
          type: 'COMPLAINT', 
          title: `Complaint: ${c.type}`, 
          time: c.created_at 
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
      
      setRecentActivities(activities);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDispatchers = async () => {
    try {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, last_assigned_at')
        .or('role.eq.DISPATCHER,role.eq.IT_DISPATCHER');

      if (!profilesData) return;

      const { data: countsData } = await supabase
        .from('carriers')
        .select('dispatcher_id')
        .not('dispatcher_id', 'is', null)
        .eq('status', 'PENDING');

      const counts = (countsData || []).reduce((acc: any, curr: any) => {
        acc[curr.dispatcher_id] = (acc[curr.dispatcher_id] || 0) + 1;
        return acc;
      }, {});

      const sortedDispatchers = profilesData
        .map((d: any) => ({
          ...d,
          count: counts[d.id] || 0
        }))
        .sort((a: any, b: any) => {
          if (a.count !== b.count) return a.count - b.count;
          const dateA = a.last_assigned_at ? new Date(a.last_assigned_at).getTime() : 0;
          const dateB = b.last_assigned_at ? new Date(b.last_assigned_at).getTime() : 0;
          return dateA - dateB;
        });

      setDispatchers(sortedDispatchers);
    } catch (err) {
      console.error('Error fetching dispatchers:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (profile?.role?.includes('SUPERVISOR')) {
      fetchDispatchers();
    }
  }, [profile]);

  const handleTransfer = async () => {
    if (!selectedDispatcherId || !selectedCarrier) return;
    try {
      const { error: carrierError } = await supabase
        .from('carriers')
        .update({
          dispatcher_id: selectedDispatcherId,
          marketing_supervisor_id: profile?.id,
          transfer_timestamp: new Date().toISOString(),
          is_new_for_supervisor: false,
        })
        .eq('id', selectedCarrier.id);

      if (carrierError) throw carrierError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ last_assigned_at: new Date().toISOString() })
        .eq('id', selectedDispatcherId);

      if (profileError) throw profileError;

      toast.success('Carrier transferred to dispatcher');
      setIsDetailOpen(false);
      fetchDashboardData();
      fetchDispatchers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateStatus = async (status: 'ACTIVE' | 'INACTIVE') => {
    if (!selectedCarrier) return;
    try {
      const { error } = await supabase
        .from('carriers')
        .update({ status })
        .eq('id', selectedCarrier.id);

      if (error) throw error;
      toast.success(`Carrier marked as ${status}`);
      setIsDetailOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <TrendingUp className="text-primary" size={24} />
          </div>
          <div>
            <PageTitle>Welcome back, {profile?.full_name}</PageTitle>
            <PageDescription>Here's what's happening in LogistiCore today.</PageDescription>
          </div>
        </div>
      </PageHeader>
      <PageBody className="space-y-8">
        <DashboardStats 
          stats={stats} 
          onStatClick={(path, value) => {
            if (value === 'new') {
              navigate({ to: path as any, search: { filter: 'new' } });
            } else {
              navigate({ to: path as any, search: { status: value } });
            }
          }} 
        />

        <DashboardActivityOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RegistrationVolumeChart data={regVolumeData} />
          <TruckTypeDistribution data={truckTypeData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TeamOnDuty onlineProfiles={onlineProfiles} />
          <RecentActivities 
            activities={recentActivities} 
            carriers={carriers}
            onCarrierClick={(carrier) => {
              setSelectedCarrier(carrier);
              setIsDetailOpen(true);
            }}
            onViewComplaints={() => navigate({ to: '/complaints' })}
          />
          <TeamPerformanceChart data={performanceData} />
        </div>
      </PageBody>

      <CarrierDetailModal 
        open={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
        carrier={selectedCarrier} 
        profile={profile} 
        dispatchers={dispatchers} 
        selectedDispatcherId={selectedDispatcherId} 
        onDispatcherChange={setSelectedDispatcherId} 
        onTransfer={handleTransfer} 
        onUpdateStatus={handleUpdateStatus} 
      />
    </Page>
  );
}

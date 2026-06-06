import React, { useEffect, useState } from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageActions, 
  PageBody, 
  Button, 
  toast,
} from '@blinkdotnew/ui';
import { Plus, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { SupervisorStats } from '../features/carriers/components/SupervisorStats';
import { CarrierTable } from '../features/carriers/components/CarrierTable';
import { CarrierRegisterModal } from '../features/carriers/components/CarrierRegisterModal';
import { CarrierDetailModal } from '../features/carriers/components/CarrierDetailModal';

export function CarriersPage() {
  const { profile } = useAuth();
  const [carriers, setCarriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Get filter from URL
  const queryParams = new URLSearchParams(window.location.search);
  const statusFilter = queryParams.get('status');
  const recentFilter = queryParams.get('filter') === 'new';

  // Supervisor Stats
  const [supervisorStats, setSupervisorStats] = useState({
    ownCarriers: 0,
    marketerGiven: 0
  });

  // Transfer State
  const [dispatchers, setDispatchers] = useState<any[]>([]);
  const [selectedDispatcherId, setSelectedDispatcherId] = useState<string>('');

  useEffect(() => {
    fetchCarriers();
    if (profile?.role?.includes('SUPERVISOR')) {
      fetchDispatchers();
    }
  }, [profile]);

  async function fetchCarriers() {
    try {
      setLoading(true);
      let query = supabase
        .from('carriers')
        .select(`
          *,
          marketer:profiles!marketer_id(id, full_name),
          dispatcher:profiles!dispatcher_id(id, full_name)
        `)
        .order('created_at', { ascending: false });

      // Apply URL filters
      if (statusFilter) {
        query = query.eq('status', statusFilter.toUpperCase());
      }
      
      if (recentFilter) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query = query.gte('created_at', sevenDaysAgo.toISOString());
      }

      // Apply strict role-based data isolation
      if (profile?.role === 'MARKETER') {
        query = query.eq('marketer_id', profile.id);
      } else if (profile?.role === 'DISPATCHER' || profile?.role === 'IT_DISPATCHER') {
        query = query.eq('dispatcher_id', profile.id);
      } else if (profile?.role === 'MARKETING_SUPERVISOR' || profile?.role === 'DISPATCHER_SUPERVISOR' || profile?.role === 'ADMIN') {
        // Supervisors and Admins maintain full visibility of the pool
      }

      const { data, error } = await query;

      if (error) throw error;
      const allCarriers = data || [];
      setCarriers(allCarriers);

      // Calculate supervisor specific stats
      if (profile?.role === 'MARKETING_SUPERVISOR' || profile?.role === 'DISPATCHER_SUPERVISOR') {
        const own = allCarriers.filter(c => c.marketer_id === profile.id).length;
        const given = allCarriers.filter(c => c.marketer_id !== profile.id).length;
        setSupervisorStats({ ownCarriers: own, marketerGiven: given });
      }
    } catch (err) {
      toast.error('Failed to fetch carriers');
    } finally {
      setLoading(false);
    }
  }

  async function fetchDispatchers() {
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
  }

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
      fetchCarriers();
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
      fetchCarriers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openCarrierDetails = (carrier: any) => {
    setSelectedCarrier(carrier);
    setIsDetailOpen(true);
  };

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>
            {profile?.role === 'MARKETING_SUPERVISOR' ? 'Shared Carrier Registry' : 'Carrier Management'}
          </PageTitle>
          <PageDescription>
            {profile?.role === 'MARKETING_SUPERVISOR' 
              ? 'Review and assign new carriers registered by marketers.' 
              : 'Centralized database for all carrier operations and tracking.'}
          </PageDescription>
        </div>
        <PageActions>
          {profile?.role === 'MARKETER' && (
            <Button onClick={() => setIsRegisterOpen(true)} className="gap-2">
              <Plus size={18} /> Register Carrier
            </Button>
          )}
        </PageActions>
      </PageHeader>

      <PageBody className="space-y-6">
        <SupervisorStats profile={profile} stats={supervisorStats} />

        <CarrierTable 
          carriers={carriers} 
          loading={loading || undefined} 
          profile={profile} 
          onViewDetails={openCarrierDetails} 
        />

        <CarrierRegisterModal 
          open={isRegisterOpen} 
          onOpenChange={setIsRegisterOpen} 
          profile={profile} 
          onSuccess={fetchCarriers} 
        />

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
      </PageBody>
    </Page>
  );
}

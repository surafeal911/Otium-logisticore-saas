import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  PropertyList,
  PropertyItem,
  Persona,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button
} from '@blinkdotnew/ui';
import { Truck, ArrowRight, CheckCircle, XCircle, Activity } from 'lucide-react';

interface CarrierDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier: any;
  profile: any;
  dispatchers: any[];
  selectedDispatcherId: string;
  onDispatcherChange: (id: string) => void;
  onTransfer: () => void;
  onUpdateStatus: (status: 'ACTIVE' | 'INACTIVE' | 'REMARKET') => void;
}

export function CarrierDetailModal({ 
  open, 
  onOpenChange, 
  carrier, 
  profile, 
  dispatchers, 
  selectedDispatcherId, 
  onDispatcherChange, 
  onTransfer, 
  onUpdateStatus 
}: CarrierDetailModalProps) {
  if (!carrier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border/50 overflow-hidden">
        <DialogHeader className="border-b border-border/50 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Truck className="text-primary" size={24} />
            </div>
            <div>
              <DialogTitle>{carrier.organization_name}</DialogTitle>
              <DialogDescription>MC: {carrier.mc_number}</DialogDescription>
            </div>
            <Badge 
              className="ml-auto" 
              variant={
                carrier.status === 'ACTIVE' ? 'success' : 
                carrier.status === 'PENDING' ? 'warning' : 
                carrier.status === 'REMARKET' ? 'info' : 
                'neutral'
              }
            >
              {carrier.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList className="mb-6">
            <TabsTrigger value="info">General Info</TabsTrigger>
            <TabsTrigger value="workflow">Workflow & Status</TabsTrigger>
            {carrier.dispatcher_id && <TabsTrigger value="dispatcher">Dispatcher Details</TabsTrigger>}
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <PropertyList>
              <PropertyItem label="Phone Number" value={carrier.phone_number} />
              <PropertyItem label="Zipcode" value={carrier.zipcode} />
              <PropertyItem label="Distance Type" value={carrier.distance_type} />
              <PropertyItem label="Truck Type" value={carrier.truck_type} />
              <PropertyItem label="Max Capacity" value={`${carrier.max_load_capacity} lbs`} />
              <PropertyItem label="Availability" value={new Date(carrier.availability_date || '').toLocaleDateString()} />
            </PropertyList>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Equipment Details</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">{carrier.equipment_details}</p>
            </div>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Original Source</h4>
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                  <Persona name={carrier.marketer?.full_name} subtitle="Marketer" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assigned Dispatcher</h4>
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                  {carrier.dispatcher ? (
                    <Persona name={carrier.dispatcher?.full_name} subtitle="Dispatcher" />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No dispatcher assigned yet</p>
                  )}
                </div>
              </div>
            </div>

            {profile?.role?.includes('SUPERVISOR') && (
              <div className="pt-6 border-t border-border/50 space-y-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold">
                    {carrier.dispatcher_id ? 'Reassign Dispatcher' : 'Assign to Dispatcher'}
                  </h4>
                  <p className="text-xs text-muted-foreground">List sorted for equal distribution (least loaded first).</p>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedDispatcherId} onValueChange={onDispatcherChange}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select a dispatcher" /></SelectTrigger>
                    <SelectContent>
                      {dispatchers.map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.full_name} ({d.count} active)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={onTransfer} disabled={!selectedDispatcherId || selectedDispatcherId === carrier.dispatcher_id} className="gap-2">
                    {carrier.dispatcher_id ? 'Reassign' : 'Assign'} <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {(profile?.role === 'DISPATCHER' || profile?.role === 'IT_DISPATCHER' || profile?.role?.includes('SUPERVISOR')) && (
              <div className="pt-6 border-t border-border/50">
                <h4 className="text-sm font-semibold mb-4">Management Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[140px] gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    onClick={() => onUpdateStatus('ACTIVE')}
                    disabled={carrier.status === 'ACTIVE'}
                  >
                    <CheckCircle size={16} /> Mark Active
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[140px] gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                    onClick={() => onUpdateStatus('REMARKET')}
                    disabled={carrier.status === 'REMARKET'}
                  >
                    <Activity size={16} /> Sent to Remarket
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[140px] gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    onClick={() => onUpdateStatus('INACTIVE')}
                    disabled={carrier.status === 'INACTIVE'}
                  >
                    <XCircle size={16} /> Mark Inactive
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {carrier.dispatcher_id && (
            <TabsContent value="dispatcher" className="space-y-6">
              <div className="p-6 bg-muted/30 rounded-3xl border border-border/50 space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Truck className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{carrier.dispatcher?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">Carrier successfully transferred on {new Date(carrier.transfer_timestamp).toLocaleDateString()}</p>
                </div>
                <div className="pt-4 flex justify-center gap-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  <div className="px-3 py-1 bg-background rounded-full border border-border/50">Batch Ops</div>
                  <div className="px-3 py-1 bg-background rounded-full border border-border/50">Live Tracking</div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
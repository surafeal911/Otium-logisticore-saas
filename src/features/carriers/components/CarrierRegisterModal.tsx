import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Button,
  toast
} from '@blinkdotnew/ui';
import { supabase } from '../../../lib/supabase';

interface CarrierRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onSuccess: () => void;
}

export function CarrierRegisterModal({ open, onOpenChange, profile, onSuccess }: CarrierRegisterModalProps) {
  const [formData, setFormData] = useState({
    organization_name: '',
    mc_number: '',
    zipcode: '',
    distance_type: 'OTR',
    truck_type: '',
    max_load_capacity: 0,
    availability_date: new Date().toISOString().split('T')[0],
    phone_number: '',
    equipment_details: '',
    marketer_comments: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('carriers').insert({
        ...formData,
        marketer_id: profile?.id,
        is_new_for_supervisor: profile?.role === 'MARKETING_SUPERVISOR' ? true : undefined,
      });

      if (error) throw error;
      toast.success('Carrier registered successfully');
      onOpenChange(false);
      onSuccess();
      // Reset form
      setFormData({
        organization_name: '',
        mc_number: '',
        zipcode: '',
        distance_type: 'OTR',
        truck_type: '',
        max_load_capacity: 0,
        availability_date: new Date().toISOString().split('T')[0],
        phone_number: '',
        equipment_details: '',
        marketer_comments: '',
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Register New Carrier</DialogTitle>
          <DialogDescription>Enter carrier details for initial processing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name</label>
              <Input 
                value={formData.organization_name} 
                onChange={e => setFormData({...formData, organization_name: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">MC Number</label>
              <Input 
                value={formData.mc_number} 
                onChange={e => setFormData({...formData, mc_number: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                value={formData.phone_number} 
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zipcode</label>
              <Input 
                value={formData.zipcode} 
                onChange={e => setFormData({...formData, zipcode: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Distance Type</label>
              <Select 
                value={formData.distance_type} 
                onValueChange={v => setFormData({...formData, distance_type: v})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTR">OTR</SelectItem>
                  <SelectItem value="Local Only">Local Only</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="LTL">LTL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Truck Type</label>
              <Input 
                value={formData.truck_type} 
                onChange={e => setFormData({...formData, truck_type: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ready Date</label>
              <Input 
                type="date"
                value={formData.availability_date} 
                onChange={e => setFormData({...formData, availability_date: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Load Capacity (lbs)</label>
              <Input 
                type="number"
                value={formData.max_load_capacity} 
                onChange={e => setFormData({...formData, max_load_capacity: parseInt(e.target.value) || 0})}
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Equipment Details</label>
            <Textarea 
              value={formData.equipment_details} 
              onChange={e => setFormData({...formData, equipment_details: e.target.value})}
              required 
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Submit Registration</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

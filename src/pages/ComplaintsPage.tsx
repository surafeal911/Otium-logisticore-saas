import { Page, PageHeader, PageTitle, PageDescription, PageBody, EmptyState, Card, CardHeader, CardTitle, CardContent, Button, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, toast, Badge } from '@blinkdotnew/ui';
import { AlertCircle, Send, ShieldAlert, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export function ComplaintsPage() {
  const { profile, user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New Complaint State
  const [newComplaint, setNewComplaint] = useState({
    text: '',
    type: 'WORK', // 'WORK' or 'PC'
    isAnonymous: true
  });

  useEffect(() => {
    fetchComplaints();
  }, [profile]);

  async function fetchComplaints() {
    if (!profile) return;
    try {
      setLoading(true);
      let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

      // Routing logic
      if (profile.role === 'ADMIN') {
        query = query.eq('type', 'WORK');
      } else if (profile.role === 'IT_DISPATCHER') {
        query = query.eq('type', 'PC');
      } else if (profile.role !== 'MARKETING_SUPERVISOR' && profile.role !== 'DISPATCHER_SUPERVISOR') {
        // Regular users only see what they sent? (if not anonymous)
        // For now, let's say supervisors/admins see all of their respective types
      }

      const { data, error } = await query;
      if (error) throw error;
      setComplaints(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.text.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('complaints').insert({
        complaint_text: newComplaint.text,
        type: newComplaint.type,
        is_anonymous: newComplaint.isAnonymous,
        sender_id: newComplaint.isAnonymous ? null : user?.id
      });

      if (error) throw error;
      toast.success('Complaint submitted successfully');
      setNewComplaint({ ...newComplaint, text: '' });
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showComplaintsList = profile?.role === 'ADMIN' || profile?.role === 'IT_DISPATCHER';

  return (
    <Page>
      <PageHeader>
        <PageTitle>Complaints & Feedback</PageTitle>
        <PageDescription>
          Submit issues to the relevant department. PC issues go to IT, work issues go to Admin.
        </PageDescription>
      </PageHeader>
      <PageBody className="space-y-8">
        {/* Submission Form */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send size={18} className="text-primary" />
              Submit a New Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Type</label>
                  <Select 
                    value={newComplaint.type} 
                    onValueChange={(v) => setNewComplaint({ ...newComplaint, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WORK">Work Related (to Admin)</SelectItem>
                      <SelectItem value="PC">PC / Technical Issue (to IT Support)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Privacy</label>
                  <Select 
                    value={newComplaint.isAnonymous ? 'true' : 'false'} 
                    onValueChange={(v) => setNewComplaint({ ...newComplaint, isAnonymous: v === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Anonymous Submission</SelectItem>
                      <SelectItem value="false">Identified (Include my profile)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your issue</label>
                <Textarea 
                  placeholder="Provide as much detail as possible..."
                  value={newComplaint.text}
                  onChange={(e) => setNewComplaint({ ...newComplaint, text: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit" loading={isSubmitting || undefined} className="w-full md:w-auto gap-2">
                <Send size={16} /> Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Complaints List (for IT/Admin) */}
        {showComplaintsList && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {profile.role === 'IT_DISPATCHER' ? <Monitor size={20} /> : <ShieldAlert size={20} />}
              {profile.role === 'IT_DISPATCHER' ? 'PC Issues for IT Support' : 'Work Related Reports for Admin'}
            </h3>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => <Card key={i} className="h-32 animate-pulse bg-muted" />)}
              </div>
            ) : complaints.length === 0 ? (
              <EmptyState 
                icon={<AlertCircle />} 
                title="No reports found" 
                description="Everything seems to be running smoothly."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <Card key={c.id} className="bg-card/30 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Badge variant={c.type === 'PC' ? 'info' : 'destructive'}>
                        {c.type === 'PC' ? 'Technical' : 'Workplace'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm italic text-foreground/80">"{c.complaint_text}"</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">
                        {c.is_anonymous ? 'Anonymous Report' : 'Identified User'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </PageBody>
    </Page>
  );
}

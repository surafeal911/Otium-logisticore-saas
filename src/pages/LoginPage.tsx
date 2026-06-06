import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Banner, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@blinkdotnew/ui';
import { supabase } from '../lib/supabase';
import { useNavigate } from '@tanstack/react-router';
import { Truck } from 'lucide-react';

export function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<string>('MARKETER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Create profile with selected role and name
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          employee_id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          internal_address: `@${email.split('@')[0]}.${role.toLowerCase()}`,
          role: role,
          full_name: fullName || email.split('@')[0],
        });

        if (profileError) throw profileError;
      }
      
      setError('Check your email for confirmation!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md relative bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
            <Truck className="text-primary-foreground" size={24} />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">LogistiCore ERP</CardTitle>
            <CardDescription className="text-slate-400">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your professional account'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === 'signin' ? handleLogin : handleSignUp} className="space-y-4">
            {error && (
              <Banner variant={error.includes('confirmation') ? 'info' : 'error'} className="mb-4">
                {error}
              </Banner>
            )}

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Position</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKETER">Marketing</SelectItem>
                      <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                      <SelectItem value="IT_DISPATCHER">IT (Support & Dispatcher)</SelectItem>
                      <SelectItem value="MARKETING_SUPERVISOR">Marketing Supervisor</SelectItem>
                      <SelectItem value="DISPATCHER_SUPERVISOR">Dispatcher Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-primary/50"
              />
            </div>

            <Button type="submit" loading={loading || undefined} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-slate-400">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {mode === 'signin' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

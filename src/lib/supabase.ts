import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bhclajxobknafovswcga.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2xhanhvYmtuYWZvdnN3Y2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTMyOTIsImV4cCI6MjA5NTcyOTI5Mn0.qqSJmtSqkKxDjMeQm_efV8AxwpYTNzmzllh8uwSxTIk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rokzxjuxifpxsytmqmvm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva3p4anV4aWZweHN5dG1xbXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTA5MDgsImV4cCI6MjA4NTg2NjkwOH0.T7jNATBa7SR9xrekdfCb5EAAgtLef9TG0yk0S_iJSFw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
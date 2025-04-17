// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ralnyboytitslkmbkfdl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbG55Ym95dGl0c2xrbWJrZmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzA2NjUsImV4cCI6MjA2MDQwNjY2NX0.wM-w29nmffwo6clHWGyP_d-pIXcSzVtceA-bXmYp_IY';

export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffsyzfphytscnqjqlwlt.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmc3l6ZnBoeXRzY25xanFsd2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTMxMzksImV4cCI6MjAzMzY4OTEzOX0.4HjLjpv8596eq-vexHkj_rMb0weVniCNxM5vIG7a854'; // Replace with your Supabase public anon key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

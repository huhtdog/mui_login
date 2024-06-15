import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL2;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY2;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

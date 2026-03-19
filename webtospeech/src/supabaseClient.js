import { createClient } from '@supabase/supabase-js'

// create-react-app exposes env vars through process.env
// (import.meta.env is used by Vite and will be undefined here)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // a missing key will cause a runtime error and blank page
  // log it so we can see what's wrong in the console
  console.error('Supabase environment variables not set:', {
    supabaseUrl,
    supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
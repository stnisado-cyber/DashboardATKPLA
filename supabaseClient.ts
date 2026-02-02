
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Menggunakan data yang diberikan oleh user
const supabaseUrl = 'https://rvcwuavtufabscutmwua.supabase.co';
const supabaseAnonKey = 'sb_publishable_2jelwVbTLjGZYhsiiP8-0w_RwC69cqS';

// Inisialisasi client Supabase
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase Client initialized with user credentials.");

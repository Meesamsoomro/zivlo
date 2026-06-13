import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: users, error } = await supabase.from('users').select('*');
  console.log("Users:", users);
  console.log("Error:", error);

  const { data: searches, error: searchErr } = await supabase.from('searches').select('*');
  console.log("Searches:", searches);
  console.log("Search error:", searchErr);
}
run();

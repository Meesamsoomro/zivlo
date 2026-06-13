import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dcfacdspdkdajjpxrxjr.supabase.co', 'sb_publishable_ElyL3fv3TlrxBJZM5JpYeQ_ob5lCtW2');

async function test() {
  const email = `test-${Date.now()}@example.com`;
  console.log('Inserting user:', email);
  
  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert([{ email, password: 'password', sender_name: 'test', pitch_context: 'test' }])
    .select('user_id')
    .single();
    
  if (userErr) {
    console.error('User insert error:', userErr);
    return;
  }
  
  console.log('User created:', user.user_id);
  
  const { data: search, error: searchErr } = await supabase
    .from('searches')
    .insert([{ user_id: user.user_id, business_type: 'test', location: 'test', leads: 0 }])
    .select('search_id')
    .single();
    
  if (searchErr) {
    console.error('Search insert error:', searchErr);
    return;
  }
  
  console.log('Search created:', search.search_id);
}
test();

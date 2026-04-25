import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dcylljsuucpznfqdmqgo.supabase.co';
const supabaseKey = 'sb_publishable_xVY9nMOvQYHLxp0SHFqZrw_bI-WH1yq';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function setupTables() {
  try {
    // Create favorites table
    const { error: favError } = await supabase.rpc('execute_sql', {
      sql: `CREATE TABLE IF NOT EXISTS public.favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (user_id, ad_id)
      );`
    });

    if (favError) console.log('Favorites creation:', favError);
    
    console.log('Setup complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

setupTables();

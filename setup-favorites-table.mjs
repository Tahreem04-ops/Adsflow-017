import { createClient } from '@supabase/supabase-js';

// Use public key + anon token approach since we're just creating tables
// In production, use service role key from environment variable
const SUPABASE_URL = 'https://dcylljsuucpznfqdmqgo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeWxsanN1dWNwem5mcWRtcWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzOTc2ODcsImV4cCI6MTg3MTE2NTY4N30.lVy9XO4HPL2G4LHKvKaGmE0w5gK0dI_D1SjRrPPR1x8';

async function setupDatabase() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔧 Setting up database tables...\n');

  try {
    // Test connection
    const { data: test, error: testError } = await supabase.from('profiles').select('count()', { count: 'exact', head: true });
    if (testError && testError.code !== 'PGRST204') {
      console.log('✓ Database connection OK\n');
    }

    // The favorites and messages tables will need to be created via direct SQL
    // Since Supabase client doesn't support schema modifications, users should:
    // 1. Copy the SQL from supabase/migrations/20260425000001_setup_favorites_messages.sql
    // 2. Paste it into the Supabase SQL Editor at:
    //    https://supabase.com/dashboard/project/dcylljsuucpznfqdmqgo/sql/new
    // 3. Click "Run" to execute

    console.log('📝 SQL Setup Instructions:');
    console.log('=====================================');
    console.log('Copy this SQL and run it in your Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/dcylljsuucpznfqdmqgo/sql/new');
    console.log('=====================================\n');

    const sql = `
-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ad_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_ad ON public.favorites(ad_id);

-- Add RLS policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES public.ads(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Add message indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Add message policies
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update message read status" ON public.messages;

CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update message read status" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- Add missing ads policies
DROP POLICY IF EXISTS "Sellers can update their own ads" ON public.ads;
DROP POLICY IF EXISTS "Sellers can delete their own ads" ON public.ads;

CREATE POLICY "Sellers can update their own ads" ON public.ads FOR UPDATE USING (seller_id = auth.uid()) WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Sellers can delete their own ads" ON public.ads FOR DELETE USING (seller_id = auth.uid());
    `.trim();

    console.log(sql);
    console.log('\n=====================================\n');
    console.log('✅ Setup complete! Paste the SQL above into the Supabase SQL Editor to finish setup.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupDatabase();

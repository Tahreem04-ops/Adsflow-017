-- This migration adds test data for development and testing
-- WARNING: Only run this on development databases!

-- Test sellers
INSERT INTO public.profiles (user_id, display_name, city, bio, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Ahmed Khan', 'Karachi', 'Premium phone seller', now(), now()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Fatima Ahmed', 'Lahore', 'Electronics expert', now(), now()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Test Buyer', 'Islamabad', 'Looking for great deals', now(), now())
ON CONFLICT DO NOTHING;

-- Test user roles
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'seller', now()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'seller', now()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'buyer', now())
ON CONFLICT DO NOTHING;

-- Test ads from seller 1
INSERT INTO public.ads (id, seller_id, title, description, price, currency, category, condition, location, images, status, is_featured, view_count, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'iPhone 14 Pro Max', 'Like new condition, 256GB, with original charger and cable. Mint condition, barely used.', 1200, 'USD', 'mobiles', 'like_new', 'Karachi, Pakistan', ARRAY['https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=600&fit=crop'], 'active', true, 45, now(), now()),
  ('22222222-2222-2222-2222-222222222222'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Sony PlayStation 5', 'Brand new sealed, comes with 2 controllers and 3 games included.', 800, 'USD', 'electronics', 'new', 'Karachi, Pakistan', ARRAY['https://images.unsplash.com/photo-1599592835882-3ec2621b70fc?w=800&h=600&fit=crop'], 'active', false, 23, now(), now()),
  ('33333333-3333-3333-3333-333333333333'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Samsung Galaxy Watch 5', 'Used for 2 months, excellent condition, all accessories included.', 250, 'USD', 'electronics', 'good', 'Karachi, Pakistan', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop'], 'active', false, 12, now(), now());

-- Test ads from seller 2
INSERT INTO public.ads (id, seller_id, title, description, price, currency, category, condition, location, images, status, is_featured, view_count, created_at, updated_at)
VALUES
  ('44444444-4444-4444-4444-444444444444'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, 'MacBook Pro 14" M2', 'Barely used, 10GB RAM, 512GB SSD, in perfect condition with box.', 1800, 'USD', 'electronics', 'like_new', 'Lahore, Pakistan', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'], 'active', true, 67, now(), now()),
  ('55555555-5555-5555-5555-555555555555'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, 'GoPro Hero 11', 'Used for travel, excellent video quality, comes with extra batteries and memory card.', 350, 'USD', 'cameras', 'good', 'Lahore, Pakistan', ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop'], 'active', false, 34, now(), now());

-- Test favorites (buyer favoriting some ads)
INSERT INTO public.favorites (id, user_id, ad_id, created_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, now())
ON CONFLICT DO NOTHING;

-- Test ad views (track who viewed which ads)
INSERT INTO public.ad_views (id, ad_id, viewer_id, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, now()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, now()),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, now())
ON CONFLICT DO NOTHING;

-- Test conversation (buyer contacted a seller)
INSERT INTO public.conversations (id, ad_id, buyer_id, seller_id, created_at, updated_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, now(), now())
ON CONFLICT DO NOTHING;

-- Test messages
INSERT INTO public.messages (id, conversation_id, sender_id, body, created_at)
SELECT
  gen_random_uuid(),
  c.id,
  '00000000-0000-0000-0000-000000000003'::uuid,
  'Hi, is this phone still available?',
  now()
FROM public.conversations c
LIMIT 1
ON CONFLICT DO NOTHING;

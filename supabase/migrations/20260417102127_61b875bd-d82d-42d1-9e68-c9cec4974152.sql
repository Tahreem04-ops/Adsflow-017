-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE public.ad_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'used');
CREATE TYPE public.ad_status AS ENUM ('active', 'sold', 'pending', 'removed');

-- =========================================
-- UPDATED_AT helper
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- USER ROLES (separate table - critical for security)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Roles are viewable by everyone"
  ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- AUTO PROFILE + ROLE ON SIGNUP
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );

  requested_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'buyer'::app_role
  );

  -- Only allow buyer or seller via signup; admin must be granted manually
  IF requested_role NOT IN ('buyer', 'seller') THEN
    requested_role := 'buyer';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, requested_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- ADS
-- =========================================
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT NOT NULL,
  condition ad_condition NOT NULL DEFAULT 'good',
  location TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  contact_phone TEXT,
  contact_email TEXT,
  status ad_status NOT NULL DEFAULT 'active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ads_category ON public.ads(category);
CREATE INDEX idx_ads_status ON public.ads(status);
CREATE INDEX idx_ads_seller ON public.ads(seller_id);
CREATE INDEX idx_ads_created ON public.ads(created_at DESC);

CREATE POLICY "Active ads are viewable by everyone"
  ON public.ads FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can post ads"
  ON public.ads FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own ads"
  ON public.ads FOR UPDATE
  USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can delete own ads"
  ON public.ads FOR DELETE
  USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- FAVORITES (Wishlist)
-- =========================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ad_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add own favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- =========================================
-- CONVERSATIONS + MESSAGES
-- =========================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ad_id, buyer_id)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view their conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants update conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) > 0 AND length(body) <= 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);

CREATE POLICY "Participants view messages"
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
  ));

CREATE POLICY "Participants send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

CREATE POLICY "Recipients can mark read"
  ON public.messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
  ));

-- =========================================
-- AD VIEWS (analytics)
-- =========================================
CREATE TABLE public.ad_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ad_views_ad ON public.ad_views(ad_id);

CREATE POLICY "Anyone can record a view"
  ON public.ad_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers see views of own ads"
  ON public.ad_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ads a
    WHERE a.id = ad_id AND (a.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ));

-- Trigger to bump view_count when an ad_view is inserted
CREATE OR REPLACE FUNCTION public.increment_ad_view()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ads SET view_count = view_count + 1 WHERE id = NEW.ad_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_ad_view
  AFTER INSERT ON public.ad_views
  FOR EACH ROW EXECUTE FUNCTION public.increment_ad_view();

-- =========================================
-- STORAGE BUCKET for ad images
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true);

CREATE POLICY "Ad images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ad-images');

CREATE POLICY "Authenticated users upload ad images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-images'
    AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update own ad images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'ad-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own ad images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ad-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
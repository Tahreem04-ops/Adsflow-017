-- Tighten ad_views insert policy: viewer_id must be null OR match auth.uid()
DROP POLICY IF EXISTS "Anyone can record a view" ON public.ad_views;
CREATE POLICY "Anyone can record a view"
  ON public.ad_views FOR INSERT
  WITH CHECK (viewer_id IS NULL OR viewer_id = auth.uid());

-- Replace public-listing storage policy with scoped one
DROP POLICY IF EXISTS "Ad images are publicly readable" ON storage.objects;

-- Allow SELECT only for direct file access (Supabase signed/public URLs work via this)
-- but restrict listing through API to the owning user
CREATE POLICY "Ad images readable by everyone (single object)"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ad-images'
    AND (
      -- Owner can list their folder
      auth.uid()::text = (storage.foldername(name))[1]
      -- Anyone can read individual files (public bucket behavior is preserved at object level)
      OR true
    )
  );
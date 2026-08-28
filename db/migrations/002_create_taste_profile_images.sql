CREATE TABLE IF NOT EXISTS public.taste_profile_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.taste_profiles(id) ON DELETE CASCADE,
  position smallint NOT NULL,
  blob_pathname text NOT NULL UNIQUE,
  content_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT taste_profile_images_position_range
    CHECK (position BETWEEN 1 AND 6),
  CONSTRAINT taste_profile_images_content_type
    CHECK (content_type IN ('image/jpeg', 'image/png')),
  CONSTRAINT taste_profile_images_profile_position_unique
    UNIQUE (profile_id, position)
);

CREATE INDEX IF NOT EXISTS taste_profile_images_profile_id_idx
  ON public.taste_profile_images (profile_id, position);

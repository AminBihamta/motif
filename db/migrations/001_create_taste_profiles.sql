CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.taste_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id uuid UNIQUE,
  user_id text UNIQUE,
  vibe_name text NOT NULL,
  description text NOT NULL,
  characteristics jsonb NOT NULL DEFAULT '[]'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  preference_insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  search_query text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT taste_profiles_owner_required
    CHECK (anonymous_id IS NOT NULL OR user_id IS NOT NULL),
  CONSTRAINT taste_profiles_characteristics_array
    CHECK (jsonb_typeof(characteristics) = 'array'),
  CONSTRAINT taste_profiles_colors_array
    CHECK (jsonb_typeof(colors) = 'array'),
  CONSTRAINT taste_profiles_preference_insights_array
    CHECK (jsonb_typeof(preference_insights) = 'array')
);

CREATE INDEX IF NOT EXISTS taste_profiles_updated_at_idx
  ON public.taste_profiles (updated_at DESC);

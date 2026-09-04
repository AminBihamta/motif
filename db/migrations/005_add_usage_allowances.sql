CREATE TABLE IF NOT EXISTS public.motif_usage_allowances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id uuid UNIQUE,
  user_id text UNIQUE,
  analyses_remaining smallint NOT NULL,
  searches_remaining smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT motif_usage_allowances_owner_required
    CHECK (anonymous_id IS NOT NULL OR user_id IS NOT NULL),
  CONSTRAINT motif_usage_allowances_analysis_non_negative
    CHECK (analyses_remaining >= 0),
  CONSTRAINT motif_usage_allowances_search_non_negative
    CHECK (searches_remaining >= 0)
);

CREATE TABLE IF NOT EXISTS public.motif_usage_reservations (
  id uuid PRIMARY KEY,
  allowance_id uuid NOT NULL REFERENCES public.motif_usage_allowances(id) ON DELETE CASCADE,
  usage_kind text NOT NULL CHECK (usage_kind IN ('analysis', 'search')),
  status text NOT NULL CHECK (status IN ('reserved', 'committed', 'released')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);

CREATE INDEX IF NOT EXISTS motif_usage_reservations_open_idx
  ON public.motif_usage_reservations (allowance_id, status, expires_at);

CREATE TABLE IF NOT EXISTS public.motif_guest_network_windows (
  network_hash text NOT NULL,
  issued_on date NOT NULL,
  guest_issuance_count smallint NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (network_hash, issued_on),
  CONSTRAINT motif_guest_network_windows_count_non_negative
    CHECK (guest_issuance_count >= 0)
);

CREATE INDEX IF NOT EXISTS motif_guest_network_windows_expiry_idx
  ON public.motif_guest_network_windows (expires_at);

CREATE TABLE IF NOT EXISTS public.motif_email_verification_tokens (
  token_hash text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS motif_email_verification_tokens_user_idx
  ON public.motif_email_verification_tokens (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.motif_password_reset_tokens (
  token_hash text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS motif_password_reset_tokens_user_id_idx
  ON public.motif_password_reset_tokens (user_id);

ALTER TABLE public.motif_usage_allowances
  ADD COLUMN IF NOT EXISTS period_starts_at timestamptz NOT NULL DEFAULT now();

UPDATE public.motif_usage_allowances
SET period_starts_at = created_at;

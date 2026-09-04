ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS password_hash text;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON public.users (lower(email))
  WHERE email IS NOT NULL;

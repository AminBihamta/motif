CREATE TABLE IF NOT EXISTS public.users (
  id serial PRIMARY KEY,
  name varchar(255),
  email varchar(255),
  "emailVerified" timestamptz,
  image text
);

CREATE TABLE IF NOT EXISTS public.accounts (
  id serial PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type varchar(255) NOT NULL,
  provider varchar(255) NOT NULL,
  "providerAccountId" varchar(255) NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  id_token text,
  scope text,
  session_state text,
  token_type text,
  CONSTRAINT accounts_provider_account_unique UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS public.sessions (
  id serial PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires timestamptz NOT NULL,
  "sessionToken" varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.verification_token (
  identifier text NOT NULL,
  expires timestamptz NOT NULL,
  token text NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE INDEX IF NOT EXISTS accounts_user_id_idx
  ON public.accounts ("userId");
CREATE INDEX IF NOT EXISTS sessions_user_id_idx
  ON public.sessions ("userId");

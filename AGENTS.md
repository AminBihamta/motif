<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Motif project context

Motif is a Next.js 16 App Router application that turns six user-selected
images into an AI-generated visual taste profile. The public homepage at `/`
is a minimal coming-soon page. The editorial “bold” homepage lives at
`/dev-home`; `/home-original` is an older visual homepage concept that remains
available for comparison.

## Important conventions

- Use `pnpm` for package management. The repository declares
  `packageManager: pnpm@10.15.0`.
- Keep secrets server-side. OpenRouter, Vercel Blob, Neon, and SearchApi access
  belongs in Server Actions, server-only libraries, or Route Handlers; never
  expose API keys to client components.
- Before changing Next.js code, read the relevant local guide under
  `node_modules/next/dist/docs/` as required by the generated guidance above.
- Client components are used where browser state, file previews, drag/drop,
  `useActionState`, or Motion animations are required. Server Components remain
  the default for pages and data reads.
- Preserve the Motif visual language: dark charcoal/black backgrounds, ivory
  type, red/blue accents, editorial oversized typography, and Motion-based
  reveals. Respect `useReducedMotion` for non-essential animation.
- Authentication uses Auth.js with Google OAuth, email/password Credentials,
  JWT sessions, and a Neon/Postgres adapter. Keep OAuth secrets and password
  hashes server-side and preserve the anonymous-profile claim flow.

## Application flow

1. `/` renders a minimal coming-soon homepage. `/dev-home` renders the editorial
   conversion homepage that drives visitors to `/find-my-vibe`.
2. `/find-my-vibe` renders `UploadForm`. The client accepts exactly six JPG or
   PNG files, validates each at 5 MB or less, supports individual and bulk
   selection plus drag/drop, and shows local previews.
3. Submitting the form calls the `analyzeImages` Server Action in
   `app/find-my-vibe/actions.tsx`. It validates the files again, sends all six
   images as base64 data URLs to OpenRouter using a strict JSON schema, uploads
   the originals privately to Vercel Blob, and saves the analysis plus image
   metadata in Neon/Postgres.
4. Ownership begins anonymously. `app/lib/taste-profile.ts` creates or reuses
   the `motif_anonymous_owner` HTTP-only cookie for one year. A profile may
   later be claimed by an Auth.js user id after Google sign-in.
5. On success the client navigates to `/my-vibe`. The page reads the profile
   server-side. Private evidence images are served through
   `/api/taste-images/[id]`, which checks the cookie owner or authenticated
   session user id and the image UUID before reading from Blob.
6. Google and email/password sign-in are handled by `auth.ts`, the credentials
   registration action, and `app/api/auth/[...nextauth]/route.ts`. The Auth.js
   migrations must be applied before sign-in is used. Verified members receive
   five analyses and five searches per rolling week via
   `app/lib/usage-allowance.ts`; guests receive one analysis and one search.
7. The result page can optionally search Amazon through SearchApi. The
   `searchProducts` Server Action combines the submitted object query with the
   generated vibe name, up to three characteristics, and up to two colors.

## Data and integrations

- `db/migrations/001_create_taste_profiles.sql` creates `taste_profiles` and
  `taste_profile_images`; there is no migration runner in this repository, so
  apply SQL migrations through the configured database tooling.
- `db/migrations/003_create_auth_tables.sql` creates the Auth.js users,
  accounts, sessions, and verification-token tables.
- `db/migrations/004_add_password_auth.sql` adds password hashes and the
  case-insensitive email uniqueness constraint.
- `db/migrations/005_add_usage_allowances.sql` creates usage allowance,
  reservation, guest network window, and email verification token tables.
- `db/migrations/006_add_usage_period.sql` adds `period_starts_at` so verified
  member allowances refresh on a rolling weekly period.
- Required environment variables for the analysis flow:
  `OPENROUTER_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and
  `NEON_CONNECTION_STRING`.
- `OPENROUTER_MODEL` is optional and defaults to
  `dots-studio/dots-3-note-preview:free`.
- Product search additionally requires `SEARCHAPI_API_KEY`. Optional Amazon
  settings are `SEARCHAPI_AMAZON_DOMAIN` (default `amazon.com`),
  `SEARCHAPI_AMAZON_SORT_BY` (default `featured`), `SEARCHAPI_LANGUAGE`,
  `SEARCHAPI_DELIVERY_COUNTRY`, `SEARCHAPI_POSTAL_CODE`,
  `SEARCHAPI_DELIVERY_CITY`, and `SEARCHAPI_DELIVERY_AREA`.
- `next.config.ts` raises the Server Action body size limit to 30 MB to allow
  six uploads of up to 5 MB each.

## Verification

Use the following checks after changes:

```bash
pnpm lint
pnpm build
```

For changes to upload, AI, database, Blob, or shopping behavior, manually
exercise the relevant flow with the required environment variables configured.

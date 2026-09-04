# Motif

Motif is an AI-powered visual taste decoder. A user uploads six images they
genuinely like, Motif analyzes the shared visual patterns, and the app returns
an editorial taste profile with characteristics, colors, preference insights,
saved visual evidence, and optional taste-shaped shopping results.

## Stack

- Next.js 16.3.1 App Router with React 19 and TypeScript
- Tailwind CSS 4 and `next/font` for the visual system
- Motion for client-side reveals and upload/loading states
- Neon Serverless Postgres for taste profiles and image metadata
- Vercel Blob for private uploaded images
- OpenRouter for multimodal image analysis
- SearchApi Amazon Search for optional product matching

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Minimal coming-soon homepage |
| `/dev-home` | Editorial homepage concept |
| `/home-original` | Older homepage concept kept for comparison |
| `/find-my-vibe` | Six-image upload and analysis form |
| `/my-vibe` | Server-rendered profile and saved evidence gallery |
| `/api/taste-images/:id` | Owner-checked private image proxy |
| `/signin` | Google or email/password sign-in and account creation |
| `/api/auth/[...nextauth]` | Auth.js OAuth and session handlers |

## Getting started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm lint
pnpm build
```

## Environment variables

Create a local `.env.local` with the server-side values below:

```text
OPENROUTER_API_KEY=...
BLOB_READ_WRITE_TOKEN=...
NEON_CONNECTION_STRING=...
SEARCHAPI_API_KEY=...
SEARCHAPI_AMAZON_DOMAIN=amazon.com
SEARCHAPI_AMAZON_SORT_BY=featured
SEARCHAPI_LANGUAGE=en_GB
OPENROUTER_MODEL=dots-studio/dots-3-note-preview:free
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
MOTIF_APP_URL=http://localhost:3000
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=hello@example.com
BREVO_SENDER_NAME=Motif
MOTIF_ABUSE_HMAC_SECRET=...
```

`OPENROUTER_MODEL` and the `SEARCHAPI_*` settings after `SEARCHAPI_API_KEY` are
optional. The analysis flow needs the first three values. Product search needs
`SEARCHAPI_API_KEY` in addition to a saved profile. Do not commit `.env.local`
or expose these values in client code.

Google sign-in requires an OAuth client in Google Cloud Console. Add
`http://localhost:3000/api/auth/callback/google` as a local redirect URI and
the equivalent production URL for the deployed site. `AUTH_SECRET` should be
a long random value generated for the deployment.

Email/password accounts require Brevo transactional-email credentials. New
users provide a name and password; passwords are hashed server-side and must
be verified through a 24-hour email link before the five analysis and five
search credits per week are granted. `MOTIF_ABUSE_HMAC_SECRET` is a server-only random
secret used to derive a rotating, non-reversible guest abuse signal; never
expose it to the browser.

## How the main flow works

1. `UploadForm` validates six JPG/PNG files in the browser, each no larger than
   5 MB, and supports individual selection, bulk selection, and drag/drop.
2. The `analyzeImages` Server Action validates the files again, sends all six
   images to OpenRouter, and expects strict JSON matching the `VibeAnalysis`
   shape in `app/lib/vibe-analysis.ts`.
3. The originals are uploaded with private access to Vercel Blob. The returned
   analysis and Blob path metadata are upserted into Postgres.
4. An HTTP-only `motif_anonymous_owner` cookie identifies the browser without
   requiring an account. Each guest receives one analysis and one product
   search. Motif stores only a rotating HMAC of a normalized network prefix and
   coarse user-agent family to rate-limit rapid creation of fresh guest IDs;
   it does not use browser fingerprinting. Re-running an analysis replaces that
   anonymous profile and removes its old image records and Blob objects.
5. Google and email/password sign-in use Auth.js JWT sessions backed by Neon
   user records. On a first sign-in, the current anonymous profile is claimed
   by the authenticated user when that account does not already have a profile.
   Google supplies the saved account name, email, and avatar; email/password
   registration stores the submitted name. Verified accounts receive five
   analyses and five searches per week, independent of any guest usage.
6. `/my-vibe` reads the profile server-side. Evidence images are only exposed
   through the owner-checking `/api/taste-images/[id]` Route Handler.
7. The product search form calls a Server Action that augments the user’s
   object query with terms from the generated taste profile before calling
   SearchApi's Amazon Search endpoint. Results link to Amazon pages; prices and
   availability may change.

## Database setup

Apply the SQL in `db/migrations/` to the configured Neon database. The
repository currently contains SQL migrations but no migration CLI or automatic
migration runner. The schema stores anonymous and authenticated profile
ownership, Auth.js users/accounts/sessions, JSON arrays for the generated
analysis, and up to six ordered image records per profile.

## Project structure

```text
app/
  page.tsx                         default homepage entrypoint
  dev-home/                        editorial homepage concept (dev)
  home-original/                   legacy homepage concept
  find-my-vibe/                    upload page and analysis Server Action
  my-vibe/                         result page and product-search Server Action
  components/                      shared UI, upload, results, and Motion code
  lib/                             database, profile, analysis, and search logic
  api/taste-images/[id]/           private Blob image Route Handler
db/migrations/                     Postgres schema
public/assets/                     visual references and decorative artwork
```

The generated Next.js guidance in `AGENTS.md` contains additional conventions
for future changes.

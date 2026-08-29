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
| `/` | Default bold editorial homepage |
| `/home-original` | Older homepage concept kept for comparison |
| `/find-my-vibe` | Six-image upload and analysis form |
| `/my-vibe` | Server-rendered profile and saved evidence gallery |
| `/api/taste-images/:id` | Owner-checked private image proxy |
| `/signin` | Visual sign-in mockup; authentication is not implemented |

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
```

`OPENROUTER_MODEL` and the `SEARCHAPI_*` settings after `SEARCHAPI_API_KEY` are
optional. The analysis flow needs the first three values. Product search needs
`SEARCHAPI_API_KEY` in addition to a saved profile. Do not commit `.env.local`
or expose these values in client code.

## How the main flow works

1. `UploadForm` validates six JPG/PNG files in the browser, each no larger than
   5 MB, and supports individual selection, bulk selection, and drag/drop.
2. The `analyzeImages` Server Action validates the files again, sends all six
   images to OpenRouter, and expects strict JSON matching the `VibeAnalysis`
   shape in `app/lib/vibe-analysis.ts`.
3. The originals are uploaded with private access to Vercel Blob. The returned
   analysis and Blob path metadata are upserted into Postgres.
4. An HTTP-only `motif_anonymous_owner` cookie identifies the browser without
   requiring an account. Re-running an analysis replaces that anonymous
   profile and removes its old image records and Blob objects.
5. `/my-vibe` reads the profile server-side. Evidence images are only exposed
   through the owner-checking `/api/taste-images/[id]` Route Handler.
6. The product search form calls a Server Action that augments the user’s
   object query with terms from the generated taste profile before calling
   SearchApi's Amazon Search endpoint. Results link to Amazon pages; prices and
   availability may change.

## Database setup

Apply the SQL in `db/migrations/` to the configured Neon database. The
repository currently contains SQL migrations but no migration CLI or automatic
migration runner. The schema stores one anonymous profile owner, JSON arrays
for the generated analysis, and up to six ordered image records per profile.

## Project structure

```text
app/
  page.tsx                         default homepage entrypoint
  home-bold/                       current editorial homepage
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

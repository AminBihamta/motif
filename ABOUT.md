# About Motif

Motif is an AI-powered visual taste decoder. You pick six images you genuinely love — interiors, clothes, art, objects, anything — and Motif reads the shared patterns. It returns a named vibe, color DNA, preference insights, and a saved gallery of your visual evidence. From that profile you can search for objects and get taste-shaped shopping results.

The product idea is simple: **you know it when you see it, but you often cannot name it.** Motif turns instinct into something searchable and reusable.

## Product flow

1. Land on the editorial homepage and start **Find my vibe**.
2. Upload exactly six JPG or PNG images (up to 5 MB each).
3. Motif analyzes the set with a multimodal model and saves a taste profile.
4. View **My vibe** — vibe name, traits, colors, insights, and private evidence images.
5. Optionally search Amazon with a query enriched by your vibe, traits, and colors.
6. Guests get one free analysis and one free search. Verified accounts unlock five of each per rolling week.

## How it was developed

Motif was built as a personal Next.js product focused on editorial design and a tight end-to-end loop: upload → analyze → profile → shop.

### Architecture

| Layer | Choice |
| --- | --- |
| App framework | Next.js 16 App Router, React 19, TypeScript |
| UI | Tailwind CSS 4, custom Motif type system, Motion animations |
| Auth | Auth.js (Google OAuth + email/password), JWT sessions |
| Database | Neon Serverless Postgres |
| Image storage | Vercel Blob (private uploads, owner-checked proxy) |
| AI analysis | OpenRouter multimodal chat completions |
| Product search | SearchApi Amazon Search |
| Email | Brevo transactional mail for verification |
| Analytics | Consent-gated PostHog and Google Analytics |
| Hosting | Vercel |

Secrets stay server-side in Server Actions and Route Handlers. Ownership starts anonymously via an HTTP-only cookie; signing in can claim that anonymous profile. Evidence images are never public Blob URLs — they are served only through an owner-checked API route.

### Design language

The UI is intentionally editorial rather than dashboard-like: charcoal/black grounds, ivory type, red and blue accents, oversized typography, hard borders, and Motion reveals that respect `prefers-reduced-motion`.

### Build milestones

Development moved roughly in this order:

1. Core upload and visual evidence flow
2. AI analysis into a structured taste profile
3. Private Blob storage and Neon persistence
4. Animated product shortlist / shopping beat
5. Auth, weekly usage allowances, and conversion surfaces
6. Editorial public homepage
7. Launch prep — legal pages, SEO, bot protection, consent-gated analytics
8. Conversion polish (including allowance invites that push guests toward signup)

## Links

### Motif

- **Live app:** [https://motif.aminbihamta.com](https://motif.aminbihamta.com)
- **Source code:** [https://github.com/AminBihamta/motif](https://github.com/AminBihamta/motif)
- **Find my vibe:** [https://motif.aminbihamta.com/find-my-vibe](https://motif.aminbihamta.com/find-my-vibe)
- **Sign in / create account:** [https://motif.aminbihamta.com/signin](https://motif.aminbihamta.com/signin)
- **Contact:** [https://motif.aminbihamta.com/contact](https://motif.aminbihamta.com/contact)

### Local development

- **Local app:** [http://localhost:3000](http://localhost:3000)
- Setup and environment details live in [`README.md`](./README.md)

### Stack & services

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Neon](https://neon.tech/)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Auth.js](https://authjs.dev/)
- [OpenRouter](https://openrouter.ai/)
- [SearchApi](https://www.searchapi.io/)
- [Motion](https://motion.dev/)
- [Brevo](https://www.brevo.com/)
- [PostHog](https://posthog.com/)

## Related docs in this repo

- [`README.md`](./README.md) — setup, env vars, and main flow
- [`GO_LIVE.md`](./GO_LIVE.md) — launch checklist
- [`AGENTS.md`](./AGENTS.md) — project conventions for contributors and coding agents

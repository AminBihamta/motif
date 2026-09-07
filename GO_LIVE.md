# Motif go-live checklist

Use this before Motif is publicly live. This is an operational checklist and owner notes — not the legal page copy itself.

Tick items as they land. Paths and env vars below match the current codebase.

---

## Priority summary

### Blockers

- [x] Privacy Policy (`/privacy`) published and linked from the site footer / sign-in
- [x] Terms of Use (`/terms`) published and linked
- [x] Amazon affiliate / sponsored disclosure — N/A (no affiliate links; plain outbound Amazon URLs)
- [x] Cookie / analytics consent strategy decided and implemented if shipping to EU/UK (PostHog currently loads without a consent gate)
- [x] Privacy / support contact email published
- [ ] Close `/shortlist` SearchApi usage hole (page searches without `reserveUsage`)
- [ ] Production env verified; `MOTIF_UNLIMITED_USAGE` **unset**
- [ ] Neon migrations `001`–`006` applied on production
- [ ] Google OAuth + Brevo callbacks pointed at the live HTTPS domain / `MOTIF_APP_URL`
- [x] Indexing posture decided (public launch: robots/sitemap/OG enabled; private routes noindexed)

### Should-fix

- [ ] Sign-in / sign-out in primary chrome
- [ ] Password reset **or** documented Google-only stance for v1
- [ ] Clear path for signed-in but unverified email users
- [x] Remove leftover routes (`/home-original`, redundant `/dev-home`; 308 → `/`)
- [ ] Tracked `.env.example` with all required keys (without secrets)
- [ ] Basic CI (`pnpm lint` + `pnpm build`)
- [ ] Update stale README / AGENTS homepage docs after launch decisions

### Nice-to-have

- [x] Amazon Associates tag — N/A (not monetizing via affiliates)
- [ ] Server-side error monitoring beyond PostHog client exceptions
- [x] Security headers / bot protection (CSP + hardening headers; Vercel BotID on abuse-prone actions)
- [x] Styled `error` / `not-found` pages
- [ ] Richer SEO (OG images, `metadataBase`, per-route copy)

---

## 1. Legal & compliance

### Privacy Policy (`/privacy`)

Draft and publish a policy that covers at least:

- [x] Uploaded images (six JPG/PNG evidence files, ≤ 5 MB each)
- [x] AI taste analysis via OpenRouter (images sent as base64 data URLs)
- [x] Taste profiles stored in Neon/Postgres
- [x] Private image storage in Vercel Blob; served only via owner-checked `/api/taste-images/[id]`
- [x] Auth.js sessions (Google OAuth and email/password), Brevo verification mail
- [x] Anonymous owner cookie (`motif_anonymous_owner`) and profile claim on sign-in
- [x] PostHog analytics / exception capture
- [x] Brevo transactional email (verification links)
- [x] SearchApi Amazon product search (query + taste-shaped terms)
- [x] Guest abuse signal: server-side HMAC of network prefix + coarse user-agent family (not browser fingerprinting) — see `app/lib/usage-allowance.ts`
- [x] Retention, deletion, and how users request erasure
- [x] International transfers / subprocessors list (Vercel, Neon, Blob, OpenRouter, SearchApi, Brevo, PostHog, Google)

### Terms of Use (`/terms`)

- [x] Acceptable use (no illegal content, no abuse of analysis/search allowances)
- [x] AI output disclaimer (vibe names, insights, and matches are approximate)
- [x] Amazon purchases happen on Amazon; Motif does not sell the products
- [x] Account / allowance rules (guest vs verified member weekly limits)
- [x] Limitation of liability appropriate for a consumer taste tool

### Amazon / commercial disclosure

- [x] **Decision:** no affiliate / Associates monetization for v1
- [x] Product cards use plain outbound Amazon links (`rel="noopener noreferrer"` only)
- [x] Terms state Motif does not use affiliate or sponsored product links

### Consent & contact

- [x] Cookie / analytics consent UX if required for target markets (PostHog init is gated in `app/lib/analytics-consent.ts` + `app/components/cookie-consent.tsx`)
- [x] Publish a privacy / support contact email for data requests (`aminbihamtawork@gmail.com`)

---

## 2. Cookies & tracking inventory

Classify each signal before launch. Necessary cookies typically do not need marketing consent; analytics usually does in EU/UK.

| Name / signal | Where | Type | Notes |
| --- | --- | --- | --- |
| `motif_anonymous_owner` | `app/lib/taste-profile.ts` | Necessary | HTTP-only, 1 year, `secure` in production; ties anonymous taste profile to the browser |
| Auth.js session cookies | Auth.js / `auth.ts` | Necessary | JWT session for signed-in users |
| PostHog cookies / local storage | `instrumentation-client.ts`, `app/lib/posthog.ts` | Analytics | Client analytics + `capture_exceptions`; requires consent strategy if regulated |
| Guest network HMAC | `app/lib/usage-allowance.ts` | Necessary (abuse) | Server-only hash using `MOTIF_ABUSE_HMAC_SECRET`; not stored as a browser cookie |

- [x] Cookie notice / banner matches this inventory
- [x] Privacy Policy lists the same cookies and purposes
- [ ] Confirm no unexpected third-party trackers beyond documented tools

---

## 3. Product & UX readiness

### Surface

- [x] Public homepage is the editorial conversion page at `/`
- [ ] `/find-my-vibe` → analyze → `/my-vibe` → search → `/shortlist` flow works end-to-end
- [x] Remove `/home-original` and `/dev-home` (permanent redirects to `/`)
- [ ] Footer / chrome links to Privacy, Terms, and Sign in where appropriate

### Auth & allowances

- [ ] Sign-in entry points visible in primary chrome
- [ ] Sign-out available for authenticated users
- [ ] Password reset shipped **or** Google-only documented for v1
- [ ] Unverified email users see a clear “verify to unlock weekly allowance” path (not a silent dead end)
- [ ] Guest limits still enforced in production: 1 analysis + 1 search
- [ ] Verified members: 5 analyses + 5 searches per rolling week
- [ ] **Fix:** `/shortlist?q=…` must not call SearchApi without usage reservation (`app/shortlist/page.tsx` currently bypasses `reserveUsage`; form path in `app/my-vibe/actions.ts` reserves correctly)

---

## 4. Security & abuse

### Production env (must be set; never commit values)

- [ ] `OPENROUTER_API_KEY`
- [ ] `OPENROUTER_MODEL` (optional; document the live model choice)
- [ ] `BLOB_READ_WRITE_TOKEN`
- [ ] `NEON_CONNECTION_STRING`
- [ ] `SEARCHAPI_API_KEY` (+ optional `SEARCHAPI_*` Amazon settings)
- [ ] `AUTH_SECRET`
- [ ] `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- [ ] `MOTIF_APP_URL` = production HTTPS origin
- [ ] `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME`
- [ ] `MOTIF_ABUSE_HMAC_SECRET`
- [ ] `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` / `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] **`MOTIF_UNLIMITED_USAGE` unset** (local unlimited bypass exists in `app/lib/usage-allowance.ts` when this is `1` or `NODE_ENV === "development"`)

### Database

- [ ] `db/migrations/001_create_taste_profiles.sql`
- [ ] `db/migrations/002_create_taste_profile_images.sql`
- [ ] `db/migrations/003_create_auth_tables.sql`
- [ ] `db/migrations/004_add_password_auth.sql`
- [ ] `db/migrations/005_add_usage_allowances.sql`
- [ ] `db/migrations/006_add_usage_period.sql` (`period_starts_at` required)

### Auth & hardening

- [ ] Google Cloud OAuth client includes production redirect: `https://<domain>/api/auth/callback/google`
- [ ] Brevo sender domain / SPF / DKIM verified for deliverability
- [ ] Revisit `allowDangerousEmailAccountLinking` in `auth.ts`
- [x] App-level security headers in `next.config.ts` + Vercel BotID on analyze/search/contact/auth actions
- [ ] Enable **BotID Deep Analysis** in Vercel project Firewall → Rules (dashboard)
- [ ] Optional: WAF rate limits on `/shortlist` and `/api/*` (upgrade CLI ≥59 or configure in dashboard)

---

## 5. SEO / discovery posture

**Current state (public launch):**

- Root metadata allows indexing (`index` / `follow`) with Open Graph + Twitter cards
- `app/robots.ts` allows `/` and disallows private / archive routes
- `app/sitemap.ts` lists public marketing + legal URLs
- `metadataBase` resolves from `MOTIF_APP_URL` (fallback: Vercel production host)

### Invite-only / soft launch

- [x] ~~Keep noindex + disallow-all~~ — flipped to public indexing

### Public marketing launch

- [x] Flip layout robots to allow indexing
- [x] Update `app/robots.ts` allow rules
- [x] Add `sitemap.ts` (or equivalent)
- [x] Set `metadataBase`, Open Graph, and Twitter cards
- [x] Per-route titles/descriptions for `/`, `/find-my-vibe`, `/my-vibe`, `/signin`, `/shortlist`
- [ ] Submit Search Console / equivalent after go-live
- [x] Noindex private routes: `/my-vibe`, `/shortlist`

---

## 6. Observability & QA

### Analytics & errors

- [ ] PostHog project token + host configured for production
- [ ] Confirm key events still fire (analysis started, product opened, auth flows)
- [ ] Decide whether client `capture_exceptions` is enough or add server monitoring

### Pre-launch smoke (run against production or production-like preview)

- [ ] Upload six valid images on `/find-my-vibe`
- [ ] Land on `/my-vibe` with vibe name, colors, characteristics, evidence gallery
- [ ] Evidence images load via `/api/taste-images/[id]` for owner only
- [ ] Product search from `/my-vibe` reserves usage and opens `/shortlist`
- [ ] Shortlist links open Amazon in a new tab
- [ ] Guest allowance blocks a second analysis/search with a clear message
- [ ] Google sign-in works; anonymous profile claims when expected
- [ ] Email/password register → Brevo verify link → weekly member allowance unlocks
- [ ] Signed-out browser cannot fetch another user’s taste images

### Engineering gate

- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Optional: GitHub Action (or equivalent) running lint + build on PRs

---

## 7. Ops / launch day

- [ ] Vercel project linked; production domain + SSL verified
- [ ] All production env vars reviewed in Vercel (no local-only overrides)
- [ ] Cost alerts or spend caps for OpenRouter and SearchApi
- [ ] On-call owner identified for launch window
- [ ] Rollback plan: previous Vercel deployment + known-good env snapshot
- [ ] Post-launch: update `README.md` / `AGENTS.md` so they match the live homepage and launch posture
- [ ] After launch: monitor error rates, allowance exhaustion, and SearchApi spend for 24–48h

---

## Quick reference — critical code

| Topic | Location |
| --- | --- |
| Homepage | `app/page.tsx` |
| Analysis action | `app/find-my-vibe/actions.tsx` |
| Usage allowances | `app/lib/usage-allowance.ts` |
| Anonymous cookie | `app/lib/taste-profile.ts` |
| Private image proxy | `app/api/taste-images/[id]/route.ts` |
| Product search action | `app/my-vibe/actions.ts` |
| Shortlist page (usage hole) | `app/shortlist/page.tsx` |
| PostHog init | `app/lib/analytics-consent.ts`, `app/components/cookie-consent.tsx` |
| Privacy / Terms / Cookies | `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/cookies/page.tsx` |
| Robots / noindex | `app/robots.ts`, `app/layout.tsx` |
| SQL migrations | `db/migrations/` |

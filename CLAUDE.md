# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Production landing page for Tiger Esports, a Vietnamese cyber game (gaming café) chain in Thanh Hóa & Sầm Sơn. Next.js App Router + TypeScript strict + TailwindCSS. UI copy is Vietnamese; identifiers (files, components, variables) are English.

The site started as a static-data-only "Phase 1" and has since grown a Supabase-backed CMS ("Phase 2A/2B/2C") for admin-managed content, while preserving the static data as a fallback so the public site keeps working with zero backend configuration.

## Commands

```bash
npm install
npm run dev            # local dev server, http://localhost:3000
npm run lint           # eslint . --max-warnings=0 (must be zero warnings)
npm run type-check     # tsc --noEmit
npm run build          # next build
npm run check:phase2a  # readiness check for Supabase migrations/env (also aliased as check:phase2b)
```

There is no test suite (no test runner configured). Before considering a change complete, run `lint`, `type-check`, and `build`, and fix any failures — this matches the project's own required workflow (see `AGENTS.md`).

## Architecture

### Content flow: static fallback → Supabase override

This is the central pattern of the codebase. `services/contentService.ts` (`getSiteContent()`) is the single entry point every page calls for data:

1. It first builds a `fallback: SiteContent` object entirely from static files in `data/` (branches, pricing, promotions, tournaments, pcTiers, hallOfFame, socialLinks, siteContent).
2. It then calls `getSupabaseContent()` from `services/supabaseContentService.ts`. If Supabase isn't configured (`lib/supabase/config.ts` → `isSupabaseConfigured()`) or the query throws, the static fallback is returned as-is.
3. If Supabase data is available, each field is merged in independently (`remote.branches ?? fallback.branches`, etc.) — so Supabase can populate some resources while others still fall back to static data. This is per-field, not all-or-nothing.

`getSupabaseContent()` only ever selects rows that are `published = true AND verified = true` (and, for hall-of-fame members, `consent_confirmed = true`). It hand-maps every raw Supabase row to the app's typed shape via `map*`/`safe*` helper functions that validate/sanitize each field (e.g. `safeImage` only accepts `/images/...` local paths or `https://*.supabase.co/storage/v1/object/public/...` URLs; `safeUrl` only accepts http/https).

When adding a new content type, follow this same shape: static data in `data/`, a `map*`/`safe*` row transformer in `supabaseContentService.ts`, a merge line in `contentService.ts`, and a type in `types/content.ts` (re-exported from `types/index.ts`).

### Image availability guard

Static images referenced by `data/*.ts` are checked against the filesystem at request time (`getAvailableImage` in `contentService.ts` uses `existsSync` against `public/`) — if the file doesn't exist, the image is nulled out rather than rendering a broken `<img>`. Don't assume a `src` string in `data/` is safe to render without this guard already being applied by `getSiteContent()`.

### Pages

- `app/page.tsx` — the single-page landing site. Composes all sections from `components/sections/*` in order, driven entirely by the `SiteContent` returned from `getSiteContent()`. `revalidate = 60` (ISR).
- `app/giai-dau/[slug]/page.tsx` — individual tournament detail page, sourced via `getPublishedTournamentBySlug()`. Falls back to a synthesized `TournamentEvent` built from static `hallOfFame.tournaments` data when Supabase has nothing (or isn't configured) for that slug.
- `app/admin/*` — the CMS. `/admin/login`, `/admin/dashboard` (protected).

### Admin CMS (Supabase-backed)

- Auth/authorization: `middleware.ts` (matcher `/admin/:path*`) calls `lib/supabase/middleware.ts` → `updateSession()`, which redirects to `/admin/login` if Supabase isn't configured or the user has no session, for any `/admin/dashboard/*` route.
- `app/admin/actions.ts` are all `"use server"` mutations. Every mutating action calls `requireAdmin()`, which re-checks the session **and** membership in the `admin_users` table (session alone isn't enough).
- `saveContent`/`deleteContent` are generic over a fixed `resources` tuple (`branches`, `promotions`, `tournaments`, `hall_of_fame_members`, `site_images`, `gallery_items`, `pc_tiers`, `faq_items`) — `buildPayload()` has a per-resource branch that maps form fields to DB columns, applies resource-specific validation (e.g. promotions require price for `combo` type; tournaments with `registration_open` require a `registration_url`; hall-of-fame members require `consent_confirmed` before `published`).
- Media uploads go through `uploadResourceMedia()`: files are uploaded to a resource-specific Supabase Storage bucket first, then the resulting public URL is written into the form payload before the DB write. If the subsequent DB write fails, uploaded files are cleaned up (storage `remove()`) to avoid orphaned objects.
- `components/admin/ResourceManager.tsx` is a generic CRUD list/form UI driven by an `AdminField[]` schema (per resource, defined in the dashboard page) — grouped into `main`/`media`/`status`/`details` sections. Adding an editable field to a resource means: add a DB column (migration), add it to the relevant `AdminField[]` list, and add it to `buildPayload()`'s mapping for that resource.
- Publishing rule enforced both client-side (`ResourceManager`) and server-side (`validateCommon` in `actions.ts` + DB triggers in the hardening migration): a record cannot be `published` without also being `verified`. Members additionally require `consent_confirmed`.

### Supabase client usage

Three separate client constructors, each for a distinct execution context — don't mix them up:
- `lib/supabase/client.ts` — browser client (`"use client"`, `createBrowserClient`).
- `lib/supabase/server.ts` — server components/actions (`createServerClient` + Next `cookies()`).
- `lib/supabase/middleware.ts` — edge middleware session refresh, operates on `NextRequest`/`NextResponse` cookies directly.

`lib/supabase/config.ts` centralizes env reads and the "is Supabase actually configured" check (`isSupabaseConfigured()` — rejects missing vars, placeholder values, and non-`*.supabase.co` URLs). Always gate Supabase calls through this rather than checking env vars directly, since the app must run with zero Supabase config using only static data.

### Database migrations

`supabase/migrations/*.sql`, applied manually in filename order via the Supabase SQL Editor (no migration runner is wired up) — see README.md for the exact order and `npm run check:phase2a` for a readiness check. Every table has RLS policies restricting public reads to `published AND verified` rows and restricting writes to members of `admin_users`.

### Data/type organization (from AGENTS.md conventions)

- Content data → `data/*.ts` (static fallback source of truth). `data-sample/` holds earlier example/reference data and is excluded from the TS build (`tsconfig.json` excludes it) — treat it as non-authoritative reference, not live code.
- Types/interfaces → `types/content.ts`, re-exported through `types/index.ts`. Import from `@/types`, not `@/types/content`.
- Reusable UI primitives → `components/ui/`.
- Page sections → `components/sections/` (one component per landing-page section, composed in `app/page.tsx`).
- Admin-only UI → `components/admin/`.
- Don't hardcode pricing/branch/promotion/config data directly in components — it must come through `data/` + the service layer so Phase 2 (Supabase) can override it transparently.

## Conventions

- Path alias `@/*` maps to repo root (`tsconfig.json`).
- TypeScript strict mode; ESLint must pass with zero warnings (`--max-warnings=0`).
- No unused/dead code, no stray `console.log`.
- Never put a `service_role` Supabase key in frontend code/env — only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are used client-side.

-- Phase 2B hardening: separate upcoming, completed summaries, and Hall of Fame selection.
-- Safe to run multiple times; does not remove existing tournament data.

alter table public.tournaments
  add column if not exists show_in_hall_of_fame boolean not null default false,
  add column if not exists summary_title text,
  add column if not exists summary_content text,
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists facebook_post_url text;

create index if not exists tournaments_public_status_hof_idx
  on public.tournaments (status, show_in_hall_of_fame, starts_at, held_on)
  where published = true and verified = true;

comment on column public.tournaments.show_in_hall_of_fame is
  'When true, a completed published+verified tournament can appear in the public Hall of Fame. Completed tournaments are not automatically honored.';
comment on column public.tournaments.summary_title is 'Optional title for completed tournament recap/detail page.';
comment on column public.tournaments.summary_content is 'Optional body content for completed tournament recap/detail page.';
comment on column public.tournaments.highlights is 'For tournaments, stores recap highlights as a JSON string array. For promotions, stores combo highlights.';
comment on column public.tournaments.facebook_post_url is 'Optional public Facebook post URL for tournament recap.';

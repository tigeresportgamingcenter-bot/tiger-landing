-- Adds Liên Minh Huyền Thoại (LoL) to tournaments and a weekly/monthly leaderboard per branch.
-- Safe to run more than once. Run in the Supabase SQL Editor, then reload the admin dashboard.

alter table public.tournaments drop constraint if exists tournaments_game_check;
alter table public.tournaments
  add constraint tournaments_game_check
  check (game in ('FC Online','Valorant','TFT','AOE','LoL'));

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  branch_slug text not null,
  period_type text not null check (period_type in ('week','month')),
  period_start date not null,
  rank smallint not null check (rank between 1 and 5),
  display_name text not null,
  points integer not null default 0 check (points >= 0),
  source text not null default 'manual' check (source in ('manual','sync')),
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_slug, period_type, period_start, rank)
);

comment on column public.leaderboard_entries.period_start is 'Week: the Monday of the week. Month: the first day of the month.';
comment on column public.leaderboard_entries.source is 'manual = typed in admin; sync = written by an automated job.';
comment on column public.leaderboard_entries.consent_confirmed is 'Player agreed to appear publicly. Rows without consent are never shown.';

create index if not exists leaderboard_entries_public_idx
  on public.leaderboard_entries (period_type, period_start desc, branch_slug, rank)
  where published and verified and consent_confirmed;

alter table public.leaderboard_entries enable row level security;

drop policy if exists "Public reads consented leaderboard" on public.leaderboard_entries;
create policy "Public reads consented leaderboard"
  on public.leaderboard_entries for select
  using (published = true and verified = true and consent_confirmed = true);

drop policy if exists "Admins manage leaderboard" on public.leaderboard_entries;
create policy "Admins manage leaderboard"
  on public.leaderboard_entries for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists set_leaderboard_entries_updated_at on public.leaderboard_entries;
create trigger set_leaderboard_entries_updated_at
  before update on public.leaderboard_entries
  for each row execute function public.set_updated_at();

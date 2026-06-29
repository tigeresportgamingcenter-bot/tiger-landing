alter table public.tournaments
  add column if not exists status text not null default 'completed',
  add column if not exists registration_url text,
  add column if not exists registration_open boolean not null default false,
  add column if not exists entry_fee integer,
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists rules text;

alter table public.tournaments
  drop constraint if exists tournaments_status_check;
alter table public.tournaments
  add constraint tournaments_status_check check (status in ('upcoming','registration_open','ongoing','completed')) not valid;
alter table public.tournaments
  add constraint tournaments_entry_fee_nonnegative check (entry_fee is null or entry_fee >= 0) not valid;
alter table public.tournaments
  add constraint tournaments_registration_requires_url check (not registration_open or registration_url is not null) not valid;

create table if not exists public.pc_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  cpu text not null,
  gpu text not null,
  ram text not null,
  monitor text not null,
  mainboard text,
  storage text,
  peripherals text,
  note text,
  branch_scope text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pc_tiers enable row level security;
drop trigger if exists set_pc_tiers_updated_at on public.pc_tiers;
create trigger set_pc_tiers_updated_at
before update on public.pc_tiers
for each row execute function public.set_updated_at();

create policy "Public reads published pc tiers"
on public.pc_tiers for select
using (published and verified);

create policy "Admins manage pc tiers"
on public.pc_tiers for all
using (public.is_admin())
with check (public.is_admin());

alter table public.pc_tiers
  add constraint pc_tiers_publish_requires_verification check (not published or verified) not valid;

create index if not exists tournaments_public_status_idx
  on public.tournaments (status, registration_open, starts_at, held_on)
  where published and verified;

create index if not exists pc_tiers_public_sort_idx
  on public.pc_tiers (sort_order)
  where published and verified;

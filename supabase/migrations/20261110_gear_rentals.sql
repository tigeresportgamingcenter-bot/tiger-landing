-- Gear available to rent at the counter. Safe to run more than once.
-- Nothing is public until an admin turns on both "published" and "verified".

create table if not exists public.gear_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  category text not null default 'other' check (category in ('mouse','keyboard','headset','controller','mousepad','combo','other')),
  description text,
  specs text[] not null default '{}',
  price integer check (price is null or price >= 0),
  price_unit text not null default 'hour' check (price_unit in ('hour','day','turn')),
  note text,
  branch_scope text,
  image_url text,
  image_alt text,
  out_of_stock boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gear_items_publish_requires_verification check (not published or verified)
);

comment on column public.gear_items.price is 'Rental price in VND for one price_unit. Null means "ask at the counter".';
comment on column public.gear_items.out_of_stock is 'True shows the item as temporarily out of stock instead of hiding it.';

create index if not exists gear_items_public_sort_idx
  on public.gear_items (sort_order, created_at)
  where published and verified;

alter table public.gear_items enable row level security;

drop policy if exists "Public reads published gear" on public.gear_items;
create policy "Public reads published gear"
  on public.gear_items for select
  using (published = true and verified = true);

drop policy if exists "Admins manage gear" on public.gear_items;
create policy "Admins manage gear"
  on public.gear_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- Databases created from an earlier version of this file get the same shape here.
alter table public.gear_items add column if not exists specs text[] not null default '{}';
alter table public.gear_items drop constraint if exists gear_items_category_check;
alter table public.gear_items add constraint gear_items_category_check
  check (category in ('mouse','keyboard','headset','controller','mousepad','combo','other'));

comment on column public.gear_items.description is 'Why a customer should rent it: the benefit in plain words.';
comment on column public.gear_items.specs is 'Up to five short spec lines shown on the card.';

drop trigger if exists set_gear_items_updated_at on public.gear_items;
create trigger set_gear_items_updated_at
  before update on public.gear_items
  for each row execute function public.set_updated_at();

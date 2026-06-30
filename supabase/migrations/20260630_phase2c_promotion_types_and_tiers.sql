-- Phase 2C: Promotion types and top-up bonus tiers.
-- Safe to run multiple times. Does not drop or rewrite existing promotion data.

alter table public.promotions
  add column if not exists promotion_type text not null default 'combo';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'promotions_promotion_type_check'
      and conrelid = 'public.promotions'::regclass
  ) then
    alter table public.promotions
      add constraint promotions_promotion_type_check
      check (promotion_type in ('combo', 'topup_bonus', 'gift', 'event', 'discount', 'other'))
      not valid;
  end if;
end $$;

alter table public.promotions validate constraint promotions_promotion_type_check;

create table if not exists public.promotion_tiers (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  pay_amount integer not null check (pay_amount > 0),
  receive_amount integer not null check (receive_amount > 0),
  bonus_amount integer not null default 0 check (bonus_amount >= 0),
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotion_tiers_receive_gte_pay check (receive_amount >= pay_amount)
);

create index if not exists promotion_tiers_promotion_sort_idx
  on public.promotion_tiers (promotion_id, sort_order);

alter table public.promotion_tiers enable row level security;

drop policy if exists "Public reads published promotion tiers" on public.promotion_tiers;
create policy "Public reads published promotion tiers"
on public.promotion_tiers
for select
using (
  exists (
    select 1
    from public.promotions p
    where p.id = promotion_tiers.promotion_id
      and p.published = true
      and p.verified = true
  )
);

drop policy if exists "Admins manage promotion tiers" on public.promotion_tiers;
create policy "Admins manage promotion tiers"
on public.promotion_tiers
for all
using (public.is_admin())
with check (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_promotion_tiers_updated_at on public.promotion_tiers;
create trigger set_promotion_tiers_updated_at
before update on public.promotion_tiers
for each row
execute function public.set_updated_at();

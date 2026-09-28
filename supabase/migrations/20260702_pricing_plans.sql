create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  tier text not null,
  price_per_hour numeric not null default 0 check (price_per_hour >= 0),
  night_combo_price numeric check (night_combo_price >= 0),
  note text not null default '',
  branch_scope text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_plans enable row level security;
drop trigger if exists set_pricing_plans_updated_at on public.pricing_plans;
create trigger set_pricing_plans_updated_at
before update on public.pricing_plans
for each row execute function public.set_updated_at();

create policy "Public reads published pricing"
on public.pricing_plans for select
using (published and verified);

create policy "Admins manage pricing"
on public.pricing_plans for all
using (public.is_admin())
with check (public.is_admin());

alter table public.pricing_plans
  add constraint pricing_plans_publish_requires_verification check (not published or verified) not valid;

create index if not exists pricing_plans_public_sort_idx
  on public.pricing_plans (branch_scope, sort_order)
  where published and verified;

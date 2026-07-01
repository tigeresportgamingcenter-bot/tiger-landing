-- Editable public FAQ for Tiger Esports. Safe and backward-compatible.

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faq_items_sort_order_idx
  on public.faq_items (sort_order, created_at);

create index if not exists faq_items_public_visibility_idx
  on public.faq_items (published, verified);

alter table public.faq_items enable row level security;

drop policy if exists "Public reads published FAQ" on public.faq_items;
create policy "Public reads published FAQ"
  on public.faq_items for select
  using (published = true and verified = true);

drop policy if exists "Admins manage FAQ" on public.faq_items;
create policy "Admins manage FAQ"
  on public.faq_items for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

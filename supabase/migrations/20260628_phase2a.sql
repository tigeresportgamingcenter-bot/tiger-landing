create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  area text not null,
  address text not null,
  map_url text,
  phone text,
  opening_hours text,
  status text not null default 'unverified' check (status in ('active','temporarily-closed','unverified')),
  description text not null default '',
  image_url text,
  image_alt text,
  sort_order integer not null default 0,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price integer not null default 0 check (price >= 0),
  highlights jsonb not null default '[]'::jsonb,
  note text not null default '',
  image_url text,
  valid_from date,
  valid_until date,
  featured boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  game text not null check (game in ('FC Online','Valorant','TFT','AOE')),
  description text not null default '',
  held_on date,
  branch_name text,
  placements jsonb not null default '[]'::jsonb,
  image_url text,
  image_alt text,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hall_of_fame_members (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  tier text check (tier in ('Diamond','Platinum','Gold')),
  period_label text,
  image_url text,
  image_alt text,
  consent_confirmed boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_key text unique not null,
  bucket text not null,
  object_path text not null,
  public_url text not null,
  alt_text text not null,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  image_alt text not null,
  bucket text not null,
  sort_order integer not null default 0,
  published boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$ declare table_name text; begin
  foreach table_name in array array['branches','promotions','tournaments','hall_of_fame_members','site_images','gallery_items'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create policy "Public reads published branches" on public.branches for select using (published and verified);
create policy "Public reads published promotions" on public.promotions for select using (published and verified);
create policy "Public reads published tournaments" on public.tournaments for select using (published and verified);
create policy "Public reads consented members" on public.hall_of_fame_members for select using (published and verified and consent_confirmed);
create policy "Public reads published site images" on public.site_images for select using (published and verified);
create policy "Public reads published gallery" on public.gallery_items for select using (published and verified);

create policy "Admins manage branches" on public.branches for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage tournaments" on public.tournaments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage members" on public.hall_of_fame_members for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage site images" on public.site_images for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage gallery" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());
alter table public.admin_users enable row level security;
create policy "Admins read own membership" on public.admin_users for select using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('hero','hero',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('branches','branches',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('community','community',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('hall-of-fame','hall-of-fame',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('members','members',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload public content images" on storage.objects for insert to authenticated
with check (bucket_id in ('hero','branches','community','hall-of-fame','members') and public.is_admin());
create policy "Admins update public content images" on storage.objects for update to authenticated
using (bucket_id in ('hero','branches','community','hall-of-fame','members') and public.is_admin())
with check (bucket_id in ('hero','branches','community','hall-of-fame','members') and public.is_admin());
create policy "Admins delete public content images" on storage.objects for delete to authenticated
using (bucket_id in ('hero','branches','community','hall-of-fame','members') and public.is_admin());

-- Sau khi tạo user trong Authentication > Users, cấp quyền admin bằng UID:
-- insert into public.admin_users (user_id) values ('USER_UUID_HERE');

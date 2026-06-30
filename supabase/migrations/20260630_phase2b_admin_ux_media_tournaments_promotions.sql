-- Phase 2B Admin UX + media/tournament/promotion readiness.
-- Idempotent and backward-compatible. Does not delete existing data.

alter table public.promotions
  add column if not exists branch_scope text;

alter table public.tournaments
  add column if not exists image_url text,
  add column if not exists image_alt text,
  add column if not exists video_url text,
  add column if not exists video_provider text,
  add column if not exists poster_url text,
  add column if not exists registration_url text,
  add column if not exists registration_open boolean not null default false,
  add column if not exists status text not null default 'upcoming',
  add column if not exists entry_fee integer,
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists rules text,
  add column if not exists summary_title text,
  add column if not exists summary_content text,
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists facebook_post_url text,
  add column if not exists show_in_hall_of_fame boolean not null default false;

alter table public.tournaments drop constraint if exists tournaments_status_check;
alter table public.tournaments add constraint tournaments_status_check
  check (status in ('upcoming','registration_open','ongoing','completed')) not valid;

alter table public.tournaments drop constraint if exists tournaments_video_provider_check;
alter table public.tournaments add constraint tournaments_video_provider_check
  check (video_provider is null or video_provider in ('upload','youtube','facebook','external')) not valid;

alter table public.gallery_items
  alter column image_url drop not null,
  alter column image_alt drop not null,
  add column if not exists media_type text not null default 'image',
  add column if not exists video_url text,
  add column if not exists video_provider text,
  add column if not exists poster_url text,
  add column if not exists caption text;

alter table public.gallery_items drop constraint if exists gallery_items_media_type_check;
alter table public.gallery_items add constraint gallery_items_media_type_check
  check (media_type in ('image','video')) not valid;

alter table public.gallery_items drop constraint if exists gallery_items_video_provider_check;
alter table public.gallery_items add constraint gallery_items_video_provider_check
  check (video_provider is null or video_provider in ('upload','youtube','facebook','external')) not valid;

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

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pc_tiers' and policyname = 'Public reads published pc tiers') then
    create policy "Public reads published pc tiers" on public.pc_tiers for select using (published and verified);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pc_tiers' and policyname = 'Admins manage pc tiers') then
    create policy "Admins manage pc tiers" on public.pc_tiers for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 26214400, array['video/mp4','video/webm'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public reads videos') then
    create policy "Public reads videos" on storage.objects for select using (bucket_id = 'videos');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins upload videos') then
    create policy "Admins upload videos" on storage.objects for insert to authenticated with check (bucket_id = 'videos' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins update videos') then
    create policy "Admins update videos" on storage.objects for update to authenticated using (bucket_id = 'videos' and public.is_admin()) with check (bucket_id = 'videos' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins delete videos') then
    create policy "Admins delete videos" on storage.objects for delete to authenticated using (bucket_id = 'videos' and public.is_admin());
  end if;
end $$;

create index if not exists promotions_public_validity_idx
  on public.promotions (featured, valid_from, valid_until)
  where published = true and verified = true;

create index if not exists tournaments_public_status_hof_idx
  on public.tournaments (status, show_in_hall_of_fame, starts_at, held_on)
  where published = true and verified = true;

create index if not exists gallery_items_public_media_idx
  on public.gallery_items (media_type, sort_order)
  where published = true and verified = true;

create index if not exists pc_tiers_public_sort_idx
  on public.pc_tiers (sort_order)
  where published = true and verified = true;

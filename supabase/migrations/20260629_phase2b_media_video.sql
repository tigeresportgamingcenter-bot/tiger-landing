-- Phase 2B: media/video for gallery and tournaments. Idempotent and backward-compatible.

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
alter table public.gallery_items drop constraint if exists gallery_items_media_required_check;
alter table public.gallery_items add constraint gallery_items_media_required_check
  check ((media_type = 'image' and image_url is not null) or (media_type = 'video' and video_url is not null)) not valid;

alter table public.tournaments
  add column if not exists video_url text,
  add column if not exists video_provider text,
  add column if not exists poster_url text;

alter table public.tournaments drop constraint if exists tournaments_video_provider_check;
alter table public.tournaments add constraint tournaments_video_provider_check
  check (video_provider is null or video_provider in ('upload','youtube','facebook','external')) not valid;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos','videos',true,26214400,array['video/mp4','video/webm'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload public videos" on storage.objects;
create policy "Admins upload public videos" on storage.objects for insert to authenticated
with check (bucket_id = 'videos' and public.is_admin());
drop policy if exists "Admins update public videos" on storage.objects;
create policy "Admins update public videos" on storage.objects for update to authenticated
using (bucket_id = 'videos' and public.is_admin())
with check (bucket_id = 'videos' and public.is_admin());
drop policy if exists "Admins delete public videos" on storage.objects;
create policy "Admins delete public videos" on storage.objects for delete to authenticated
using (bucket_id = 'videos' and public.is_admin());

create index if not exists gallery_items_public_media_idx
  on public.gallery_items (media_type, sort_order)
  where published and verified;

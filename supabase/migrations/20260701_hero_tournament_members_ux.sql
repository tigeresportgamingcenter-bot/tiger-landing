-- Hero video, structured tournament content and monthly member ranking.
-- Backward-compatible: no existing rows are removed or rewritten.

alter table public.site_images
  add column if not exists media_type text not null default 'image',
  add column if not exists video_url text,
  add column if not exists video_provider text,
  add column if not exists poster_url text;

alter table public.site_images alter column public_url drop not null;
alter table public.site_images alter column object_path drop not null;

alter table public.site_images drop constraint if exists site_images_media_type_check;
alter table public.site_images add constraint site_images_media_type_check
  check (media_type in ('image', 'video')) not valid;

alter table public.site_images drop constraint if exists site_images_video_provider_check;
alter table public.site_images add constraint site_images_video_provider_check
  check (video_provider is null or video_provider in ('upload', 'youtube', 'facebook', 'external')) not valid;

alter table public.tournaments
  add column if not exists format text,
  add column if not exists prize_pool text,
  add column if not exists prize_first text,
  add column if not exists prize_second text,
  add column if not exists prize_third text;

alter table public.hall_of_fame_members
  add column if not exists honor_month date,
  add column if not exists member_points integer not null default 0,
  add column if not exists note text,
  add column if not exists sort_order integer not null default 0;

alter table public.hall_of_fame_members drop constraint if exists hall_of_fame_members_points_nonnegative;
alter table public.hall_of_fame_members add constraint hall_of_fame_members_points_nonnegative
  check (member_points >= 0) not valid;

create index if not exists hall_of_fame_members_public_ranking_idx
  on public.hall_of_fame_members (honor_month desc, member_points desc, sort_order asc)
  where published and verified and consent_confirmed;

comment on column public.site_images.media_type is 'Use image or video. hero-main is the public hero media record.';
comment on column public.hall_of_fame_members.honor_month is 'Store the first day of the honor month, e.g. 2026-07-01.';
comment on column public.hall_of_fame_members.member_points is 'Non-sensitive display points used only for public ranking.';

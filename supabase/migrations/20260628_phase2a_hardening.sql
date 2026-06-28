-- Defense-in-depth: các constraint NOT VALID không phá dữ liệu cũ,
-- nhưng vẫn áp dụng cho mọi INSERT/UPDATE mới.
alter table public.branches
  add constraint branches_publish_requires_verification check (not published or verified) not valid;
alter table public.promotions
  add constraint promotions_publish_requires_verification check (not published or verified) not valid;
alter table public.tournaments
  add constraint tournaments_publish_requires_verification check (not published or verified) not valid;
alter table public.site_images
  add constraint site_images_publish_requires_verification check (not published or verified) not valid;
alter table public.gallery_items
  add constraint gallery_publish_requires_verification check (not published or verified) not valid;
alter table public.hall_of_fame_members
  add constraint members_publish_requires_consent check (not published or (verified and consent_confirmed)) not valid;

alter table public.site_images
  add constraint site_images_known_bucket check (bucket in ('hero','branches','community','hall-of-fame','members')) not valid;
alter table public.gallery_items
  add constraint gallery_known_bucket check (bucket in ('hero','branches','community','hall-of-fame','members')) not valid;

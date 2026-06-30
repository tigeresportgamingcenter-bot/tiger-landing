-- Phase 2C hotfix: top-up promotions do not use combo price.
-- Keep existing promotion data. Do not drop/reset tables.

alter table public.promotions
  alter column price drop not null;

-- Deadline for registering to a tournament. Optional: empty means "no deadline", exactly as before.
-- Safe to run more than once. To undo: alter table public.tournaments drop column registration_closes_at;

alter table public.tournaments
  add column if not exists registration_closes_at timestamptz;

comment on column public.tournaments.registration_closes_at is
  'When registration closes. The website shows a countdown to it and closes the register button after it passes.';

-- Complaint intake and handling. Safe to run more than once.
-- Customers never read this table directly: they submit and track through two RPC functions.
-- Only admins can read or update rows.

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  phone text not null,
  branch_slug text,
  category text not null check (category in ('service','equipment','billing','tournament','hygiene','other')),
  content text not null check (char_length(content) between 10 and 2000),
  consent_confirmed boolean not null default false check (consent_confirmed),
  status text not null default 'new' check (status in ('new','in_progress','resolved','rejected')),
  assigned_to text,
  internal_note text,
  public_response text,
  responded_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.complaints.internal_note is 'Staff only. Never returned by track_complaint.';
comment on column public.complaints.public_response is 'Shown to the customer who knows the code and phone number.';

create index if not exists complaints_status_created_idx on public.complaints (status, created_at desc);
create index if not exists complaints_phone_created_idx on public.complaints (phone, created_at desc);

alter table public.complaints enable row level security;

drop policy if exists "Admins manage complaints" on public.complaints;
create policy "Admins manage complaints"
  on public.complaints for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists set_complaints_updated_at on public.complaints;
create trigger set_complaints_updated_at
  before update on public.complaints
  for each row execute function public.set_updated_at();

create or replace function public.submit_complaint(
  p_name text, p_phone text, p_branch text, p_category text, p_content text, p_consent boolean
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_code text;
begin
  if p_consent is not true then raise exception 'consent_required'; end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 or char_length(p_name) > 80 then raise exception 'invalid_name'; end if;
  if char_length(v_phone) < 9 or char_length(v_phone) > 12 then raise exception 'invalid_phone'; end if;
  if char_length(trim(coalesce(p_content, ''))) < 10 or char_length(p_content) > 2000 then raise exception 'invalid_content'; end if;
  if p_category not in ('service','equipment','billing','tournament','hygiene','other') then raise exception 'invalid_category'; end if;
  if (select count(*) from public.complaints where phone = v_phone and created_at > now() - interval '1 day') >= 3 then
    raise exception 'rate_limited';
  end if;
  loop
    v_code := 'KN-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.complaints where code = v_code);
  end loop;
  insert into public.complaints (code, customer_name, phone, branch_slug, category, content, consent_confirmed)
  values (v_code, trim(p_name), v_phone, nullif(trim(coalesce(p_branch, '')), ''), p_category, trim(p_content), true);
  return v_code;
end;
$$;

create or replace function public.track_complaint(p_code text, p_phone text)
returns table (status text, public_response text, created_at timestamptz, responded_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select c.status, c.public_response, c.created_at, c.responded_at
  from public.complaints c
  where c.code = upper(trim(p_code))
    and c.phone = regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')
  limit 1;
$$;

revoke all on function public.submit_complaint(text, text, text, text, text, boolean) from public;
revoke all on function public.track_complaint(text, text) from public;
grant execute on function public.submit_complaint(text, text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.track_complaint(text, text) to anon, authenticated;

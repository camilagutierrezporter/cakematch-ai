-- CakeMatch AI Week 4 saved marketing assets.
-- Private account-owned content; no anonymous access is granted.
-- Before use, enable Email sign-in in Supabase Auth and allow the app's
-- /marketing redirect URL in the project's Auth URL Configuration.
-- Run this file in Supabase Dashboard -> SQL Editor -> New query -> Run.

create table if not exists public.marketing_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  asset_type text not null
    check (asset_type in ('landing_copy', 'social_post', 'video_script', 'campaign_calendar')),
  title text not null
    check (char_length(trim(title)) between 1 and 160),
  content text not null
    check (char_length(trim(content)) between 1 and 30000)
);

comment on table public.marketing_assets is
  'CakeMatch AI Week 4 saved marketing content, private to the authenticated owner.';

create index if not exists marketing_assets_owner_created_idx
  on public.marketing_assets (user_id, created_at desc);

alter table public.marketing_assets enable row level security;

revoke all on table public.marketing_assets from anon, authenticated;
grant select, insert, delete on table public.marketing_assets to authenticated;

drop policy if exists "Owners can read their marketing assets" on public.marketing_assets;
create policy "Owners can read their marketing assets"
  on public.marketing_assets
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Owners can insert their marketing assets" on public.marketing_assets;
create policy "Owners can insert their marketing assets"
  on public.marketing_assets
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Owners can delete their marketing assets" on public.marketing_assets;
create policy "Owners can delete their marketing assets"
  on public.marketing_assets
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- CakeMatch AI Week 5 private design chat storage.
-- Enable Anonymous Sign-Ins in Supabase Auth before using this feature.
-- Run in Supabase Dashboard -> SQL Editor after reviewing the schema and RLS.
-- The browser app uses only the existing public publishable key, never a service-role key.
-- Restrictive policies below prevent any other permissive policy on these tables
-- from widening access beyond the row owner.

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  feeling text not null
    check (feeling in ('Romantic', 'Fun', 'Luxurious', 'Nostalgic', 'Surprising')),
  unique_detail text not null
    check (unique_detail in ('Personal details', 'Flowers', 'Textures', 'Special decorations', 'Creative shape')),
  inspiration text not null
    check (inspiration in ('Pinterest idea', 'Favorite color palette', 'Personal memory', 'Special theme')),
  design_description text not null
    check (char_length(trim(design_description)) between 1 and 2000),
  guardrail_categories text[] not null default '{}'
    check (
      cardinality(guardrail_categories) <= 6
      and guardrail_categories <@ array[
        'allergy_safety', 'feasibility', 'exact_price',
        'availability', 'ordering', 'other'
      ]::text[]
    ),
  transcript jsonb not null
    check (
      jsonb_typeof(transcript) = 'array'
      and jsonb_array_length(transcript) between 1 and 64
      and octet_length(transcript::text) <= 32000
    ),
  unique (id, owner_id)
);

comment on table public.chat_sessions is
  'Owner-private CakeMatch AI Week 5 design chats. Transcript contains only fixed prompts, selected options, and generated messages.';

create index if not exists chat_sessions_owner_updated_idx
  on public.chat_sessions (owner_id, updated_at desc);

create table if not exists public.chat_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null,
  design_version text not null default 'week5-design-v1'
    check (design_version = 'week5-design-v1'),
  vote text not null check (vote in ('up', 'down')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_feedback_session_owner_fk
    foreign key (session_id, owner_id)
    references public.chat_sessions (id, owner_id)
    on delete cascade,
  constraint chat_feedback_one_vote_per_owner_session
    unique (owner_id, session_id)
);

comment on table public.chat_feedback is
  'One current thumbs-up/down vote per owner and saved design chat.';

alter table public.chat_sessions enable row level security;
alter table public.chat_feedback enable row level security;

revoke all on table public.chat_sessions, public.chat_feedback from public, anon, authenticated;
grant select, insert, update, delete on table public.chat_sessions to authenticated;
grant select, insert, update, delete on table public.chat_feedback to authenticated;

drop policy if exists "Owners can read design chats" on public.chat_sessions;
create policy "Owners can read design chats"
  on public.chat_sessions for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Owners can create design chats" on public.chat_sessions;
create policy "Owners can create design chats"
  on public.chat_sessions for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can update design chats" on public.chat_sessions;
create policy "Owners can update design chats"
  on public.chat_sessions for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can delete design chats" on public.chat_sessions;
create policy "Owners can delete design chats"
  on public.chat_sessions for delete to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design chat reads to owner" on public.chat_sessions;
create policy "Restrict design chat reads to owner"
  on public.chat_sessions as restrictive for select to public
  using ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design chat inserts to owner" on public.chat_sessions;
create policy "Restrict design chat inserts to owner"
  on public.chat_sessions as restrictive for insert to public
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design chat updates to owner" on public.chat_sessions;
create policy "Restrict design chat updates to owner"
  on public.chat_sessions as restrictive for update to public
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design chat deletes to owner" on public.chat_sessions;
create policy "Restrict design chat deletes to owner"
  on public.chat_sessions as restrictive for delete to public
  using ((select auth.uid()) = owner_id);

drop policy if exists "Owners can read design feedback" on public.chat_feedback;
create policy "Owners can read design feedback"
  on public.chat_feedback for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Owners can create design feedback" on public.chat_feedback;
create policy "Owners can create design feedback"
  on public.chat_feedback for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can update design feedback" on public.chat_feedback;
create policy "Owners can update design feedback"
  on public.chat_feedback for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Owners can delete design feedback" on public.chat_feedback;
create policy "Owners can delete design feedback"
  on public.chat_feedback for delete to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design feedback reads to owner" on public.chat_feedback;
create policy "Restrict design feedback reads to owner"
  on public.chat_feedback as restrictive for select to public
  using ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design feedback inserts to owner" on public.chat_feedback;
create policy "Restrict design feedback inserts to owner"
  on public.chat_feedback as restrictive for insert to public
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design feedback updates to owner" on public.chat_feedback;
create policy "Restrict design feedback updates to owner"
  on public.chat_feedback as restrictive for update to public
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Restrict design feedback deletes to owner" on public.chat_feedback;
create policy "Restrict design feedback deletes to owner"
  on public.chat_feedback as restrictive for delete to public
  using ((select auth.uid()) = owner_id);

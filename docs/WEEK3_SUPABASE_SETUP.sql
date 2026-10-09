-- Week 3 demo data is non-sensitive and contains pricing assumptions only.
-- This intentionally mirrors the public insert/select approach used by the student project.
create table if not exists public.pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 60),
  scenario_type text not null check (scenario_type in ('Conservador', 'Optimista')),
  customer_counts jsonb not null,
  monthly_prices jsonb not null,
  monthly_revenue numeric not null check (monthly_revenue >= 0),
  annual_revenue numeric not null check (annual_revenue >= 0)
);

alter table public.pricing_scenarios enable row level security;

grant select, insert, delete on table public.pricing_scenarios to anon, authenticated;

drop policy if exists "Public can read pricing scenarios" on public.pricing_scenarios;
create policy "Public can read pricing scenarios"
  on public.pricing_scenarios for select to anon, authenticated using (true);

drop policy if exists "Public can insert pricing scenarios" on public.pricing_scenarios;
create policy "Public can insert pricing scenarios"
  on public.pricing_scenarios for insert to anon, authenticated with check (true);

drop policy if exists "Public can delete pricing scenarios" on public.pricing_scenarios;
create policy "Public can delete pricing scenarios"
  on public.pricing_scenarios for delete to anon, authenticated using (true);

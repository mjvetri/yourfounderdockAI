create table if not exists public.market_validations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('competitors', 'interviews', 'surveys', 'landing')),
  context text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.market_validations enable row level security;

drop policy if exists "own market validations" on public.market_validations;
create policy "own market validations" on public.market_validations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
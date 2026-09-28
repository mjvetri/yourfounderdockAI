create table if not exists public.gtm_strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  setup jsonb not null default '{}'::jsonb,
  strategy jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idea_id)
);

alter table public.gtm_strategies enable row level security;

create policy "own gtm strategies" on public.gtm_strategies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists gtm_strategies_user_idea_idx
  on public.gtm_strategies(user_id, idea_id);

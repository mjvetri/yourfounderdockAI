create table if not exists public.canvases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('lean', 'vision', 'team')),
  title text not null,
  data jsonb not null default '{}'::jsonb,
  analysis jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.canvases enable row level security;

drop policy if exists "own canvases" on public.canvases;
create policy "own canvases" on public.canvases
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists canvases_user_type_updated_idx
  on public.canvases(user_id, type, updated_at desc);

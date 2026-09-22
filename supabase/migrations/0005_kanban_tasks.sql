create table if not exists public.kanban_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tag text not null default 'General',
  title text not null,
  status text not null default 'todo' check (status in ('todo', 'in-progress', 'done')),
  created_at timestamptz not null default now()
);

alter table public.kanban_tasks enable row level security;

drop policy if exists "own kanban tasks" on public.kanban_tasks;
create policy "own kanban tasks" on public.kanban_tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
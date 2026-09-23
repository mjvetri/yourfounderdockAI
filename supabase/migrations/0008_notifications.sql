create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('roadmap', 'chat', 'task', 'system')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "own notifications" on public.notifications;
create policy "own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);
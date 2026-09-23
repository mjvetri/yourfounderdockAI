create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'New Chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_messages
  add column if not exists session_id uuid references public.chat_sessions(id) on delete cascade;

alter table public.chat_sessions enable row level security;

drop policy if exists "own chat sessions" on public.chat_sessions;
create policy "own chat sessions" on public.chat_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists chat_sessions_user_updated_idx
  on public.chat_sessions(user_id, updated_at desc);

create index if not exists chat_messages_session_created_idx
  on public.chat_messages(session_id, created_at);
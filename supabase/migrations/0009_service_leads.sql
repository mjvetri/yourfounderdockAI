create table if not exists public.service_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references public.chat_sessions(id) on delete set null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.service_leads enable row level security;

drop policy if exists "own service leads" on public.service_leads;
create policy "own service leads" on public.service_leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists service_leads_user_created_idx
  on public.service_leads(user_id, created_at desc);

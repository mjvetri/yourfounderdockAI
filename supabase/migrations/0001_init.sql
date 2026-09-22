-- ============================================================
-- Founder OS / YourFounderDock — initial schema
-- Run this in Supabase SQL editor, or via `supabase db push`
-- ============================================================

-- Profiles: one row per authenticated user, extends auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  plan text not null default 'free', -- 'free' | 'pro'
  created_at timestamptz not null default now()
);

-- Ideas: the "kernel object" — one row per idea a founder adds
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null default 'software', -- 'software' | 'hardware'
  status text not null default 'draft',      -- 'draft' | 'validating' | 'building' | 'launched'
  progress int not null default 0,
  created_at timestamptz not null default now()
);

-- Validations: AI validation report tied to an idea
create table if not exists public.validations (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  verdict text,
  tech_stack jsonb,
  risks jsonb,
  next_steps jsonb,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

-- Roadmap items: phases + tasks generated for an idea
create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  phase text not null,
  tasks jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Chat messages: FounderBot conversation history, per idea
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'model')),
  text text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — every table is locked to its owner
-- ============================================================
alter table public.profiles enable row level security;
alter table public.ideas enable row level security;
alter table public.validations enable row level security;
alter table public.roadmap_items enable row level security;
alter table public.chat_messages enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own ideas" on public.ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own validations" on public.validations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own roadmap items" on public.roadmap_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own chat messages" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

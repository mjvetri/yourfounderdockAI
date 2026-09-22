-- Persistent file metadata and private Storage bucket.
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id uuid references public.ideas(id) on delete set null,
  file_name text not null,
  storage_path text not null unique,
  file_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('founder-files', 'founder-files', false)
on conflict (id) do nothing;

alter table public.files enable row level security;

drop policy if exists "own files" on public.files;
create policy "own files" on public.files
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "upload own founder files" on storage.objects;
create policy "upload own founder files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'founder-files'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "read own founder files" on storage.objects;
create policy "read own founder files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'founder-files'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "delete own founder files" on storage.objects;
create policy "delete own founder files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'founder-files'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

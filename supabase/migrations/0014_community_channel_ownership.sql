alter table public.community_channels
  add column created_by uuid references auth.users(id) on delete set null;

drop policy if exists "insert community channels" on public.community_channels;
drop policy if exists "channels writable" on public.community_channels;
drop policy if exists "insert own community channels" on public.community_channels;

create policy "insert own community channels"
  on public.community_channels
  for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "delete own community channels" on public.community_channels;

create policy "delete own community channels"
  on public.community_channels
  for delete
  to authenticated
  using (auth.uid() = created_by);

create index if not exists community_channels_created_by_idx
  on public.community_channels(created_by);

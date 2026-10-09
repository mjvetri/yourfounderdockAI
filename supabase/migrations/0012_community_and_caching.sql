alter table public.canvases
  add column if not exists analysis_input_hash text;

alter table public.gtm_strategies
  add column if not exists input_hash text;

create table if not exists public.community_channels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.community_channels(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  sender_name text not null,
  sender_avatar text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete cascade not null,
  reported_user_id uuid references auth.users(id) on delete cascade not null,
  channel_id uuid references public.community_channels(id) on delete cascade not null,
  message_id uuid references public.community_messages(id) on delete cascade not null,
  message_text text not null,
  reason text not null check (reason in ('spam', 'abusive', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_blocks (
  blocker_id uuid references auth.users(id) on delete cascade not null,
  blocked_id uuid references auth.users(id) on delete cascade not null,
  blocked_name text,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.ai_usage (
  user_id uuid references auth.users(id) on delete cascade not null,
  feature text not null,
  day text not null,
  used int not null default 0,
  primary key (user_id, feature, day)
);

alter table public.community_channels enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_blocks enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "read community channels" on public.community_channels;
create policy "read community channels" on public.community_channels
  for select using (true);

drop policy if exists "read community messages" on public.community_messages;
create policy "read community messages" on public.community_messages
  for select using (true);

drop policy if exists "insert own community messages" on public.community_messages;
create policy "insert own community messages" on public.community_messages
  for insert with check (auth.uid() = user_id);

drop policy if exists "delete own community messages" on public.community_messages;
create policy "delete own community messages" on public.community_messages
  for delete using (auth.uid() = user_id);

drop policy if exists "insert own community reports" on public.community_reports;
create policy "insert own community reports" on public.community_reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "read own community blocks" on public.community_blocks;
create policy "read own community blocks" on public.community_blocks
  for select using (auth.uid() = blocker_id);

drop policy if exists "insert own community blocks" on public.community_blocks;
create policy "insert own community blocks" on public.community_blocks
  for insert with check (auth.uid() = blocker_id);

drop policy if exists "delete own community blocks" on public.community_blocks;
create policy "delete own community blocks" on public.community_blocks
  for delete using (auth.uid() = blocker_id);

create or replace function public.report_community_message(p_message_id uuid, p_reason text)
returns void
language plpgsql
security definer
as $$
declare
  v_message public.community_messages%rowtype;
begin
  select * into v_message
  from public.community_messages
  where id = p_message_id;

  if v_message.id is null then
    raise exception 'Message not found';
  end if;

  insert into public.community_reports (
    reporter_id,
    reported_user_id,
    channel_id,
    message_id,
    message_text,
    reason
  ) values (
    auth.uid(),
    v_message.user_id,
    v_message.channel_id,
    v_message.id,
    v_message.body,
    p_reason
  );
end;
$$;

create or replace function public.consume_ai_quota(p_user_id uuid, p_feature text, p_limit int)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_day text := to_char(now(), 'YYYY-MM-DD');
  v_used int;
begin
  insert into public.ai_usage (user_id, feature, day, used)
  values (p_user_id, p_feature, v_day, 1)
  on conflict (user_id, feature, day)
  do update set used = public.ai_usage.used + 1;

  select used into v_used
  from public.ai_usage
  where user_id = p_user_id and feature = p_feature and day = v_day;

  if v_used > p_limit then
    update public.ai_usage
    set used = used - 1
    where user_id = p_user_id and feature = p_feature and day = v_day;

    return jsonb_build_object(
      'allowed', false,
      'used', v_used,
      'limit', p_limit,
      'feature', p_feature,
      'day', v_day
    );
  end if;

  return jsonb_build_object(
    'allowed', true,
    'used', v_used,
    'limit', p_limit,
    'feature', p_feature,
    'day', v_day
  );
end;
$$;

create or replace function public.refund_ai_quota(p_user_id uuid, p_feature text)
returns void
language plpgsql
security definer
as $$
declare
  v_day text := to_char(now(), 'YYYY-MM-DD');
  v_used int;
begin
  update public.ai_usage
  set used = used - 1
  where user_id = p_user_id and feature = p_feature and day = v_day;

  select used into v_used
  from public.ai_usage
  where user_id = p_user_id and feature = p_feature and day = v_day;

  if v_used is not null and v_used <= 0 then
    delete from public.ai_usage
    where user_id = p_user_id and feature = p_feature and day = v_day;
  end if;
end;
$$;

create index if not exists community_messages_channel_created_idx
  on public.community_messages(channel_id, created_at desc);

create index if not exists community_reports_message_idx
  on public.community_reports(message_id, created_at desc);

create index if not exists community_blocks_blocker_idx
  on public.community_blocks(blocker_id, blocked_id);

create index if not exists ai_usage_user_feature_day_idx
  on public.ai_usage(user_id, feature, day);

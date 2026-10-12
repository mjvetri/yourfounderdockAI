-- All users share one beta limit. Dates are calculated in IST to match the UI.
drop function if exists public.consume_ai_quota(uuid, text, int);
create or replace function public.consume_ai_quota(p_user_id uuid, p_feature text, p_limit int)
returns jsonb language plpgsql security definer as $$
declare
  v_day text := to_char(now() at time zone 'Asia/Kolkata', 'YYYY-MM-DD');
  v_used int;
begin
  select count(*) into v_used from public.ai_usage
  where user_id = p_user_id
    and created_at >= date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata';
  if v_used >= p_limit then
    return jsonb_build_object('allowed', false, 'used', v_used, 'limit', p_limit, 'feature', p_feature, 'day', v_day);
  end if;
  insert into public.ai_usage (user_id, feature) values (p_user_id, p_feature);
  v_used := v_used + 1;
  return jsonb_build_object('allowed', true, 'used', v_used, 'limit', p_limit, 'feature', p_feature, 'day', v_day);
end;
$$;

create or replace function public.refund_ai_quota(p_user_id uuid, p_feature text)
returns void language plpgsql security definer as $$
declare
  v_day text := to_char(now() at time zone 'Asia/Kolkata', 'YYYY-MM-DD');
  v_used int;
begin
  delete from public.ai_usage
  where id = (
    select id from public.ai_usage
    where user_id = p_user_id and feature = p_feature
      and created_at >= date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata'
    order by created_at desc
    limit 1
  );
end;
$$;

create or replace function public.my_ai_usage_today()
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::integer from public.ai_usage
  where user_id = auth.uid()
    and created_at >= date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata';
$$;

grant execute on function public.my_ai_usage_today() to authenticated;

create extension if not exists pgcrypto;

create table if not exists public.mural_messages (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 2 and 40),
  city text null check (city is null or char_length(city) <= 80),
  state text null check (state is null or state ~ '^[A-Z]{2}$'),
  message text not null check (char_length(message) between 10 and 500),
  status text not null default 'published'
    check (status in ('published', 'hidden', 'removed')),
  reports_count integer not null default 0 check (reports_count >= 0),
  content_fingerprint text null check (
    content_fingerprint is null or content_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  source_fingerprint text null check (
    source_fingerprint is null or source_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mural_messages_published_order_idx
  on public.mural_messages (created_at desc, id desc)
  where status = 'published';
create index if not exists mural_messages_duplicate_idx
  on public.mural_messages (content_fingerprint, created_at desc)
  where content_fingerprint is not null;
create index if not exists mural_messages_admin_idx
  on public.mural_messages (status, created_at desc, id desc);

create or replace function public.set_mural_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger mural_messages_updated_at
before update on public.mural_messages
for each row execute function public.set_mural_updated_at();

create table if not exists public.mural_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.mural_messages(id) on delete cascade,
  reason text not null check (
    reason in ('spam', 'harassment', 'inappropriate', 'personal_information', 'other')
  ),
  details text null check (details is null or char_length(details) <= 300),
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'dismissed')),
  source_fingerprint text null check (
    source_fingerprint is null or source_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  created_at timestamptz not null default now()
);

create index if not exists mural_reports_review_idx
  on public.mural_reports (status, created_at desc, id desc);
create index if not exists mural_reports_message_idx
  on public.mural_reports (message_id, created_at desc);

create table if not exists public.mural_rate_limits (
  scope text not null check (scope in ('publish', 'report', 'admin_login')),
  source_fingerprint text not null check (source_fingerprint ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (scope, source_fingerprint)
);

alter table public.mural_messages enable row level security;
alter table public.mural_reports enable row level security;
alter table public.mural_rate_limits enable row level security;

revoke all on public.mural_messages from public, anon, authenticated;
revoke all on public.mural_reports from public, anon, authenticated;
revoke all on public.mural_rate_limits from public, anon, authenticated;
grant select on public.mural_messages to service_role;
grant insert, update, delete on public.mural_messages to service_role;
grant select, insert, update, delete on public.mural_reports to service_role;
grant select, insert, update, delete on public.mural_rate_limits to service_role;

create or replace function public.consume_mural_rate_limit(
  p_scope text,
  p_source_fingerprint text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
  v_now timestamptz := clock_timestamp();
begin
  if p_scope not in ('publish', 'report', 'admin_login')
    or p_source_fingerprint !~ '^[a-f0-9]{64}$'
    or p_limit < 1 or p_limit > 100
    or p_window_seconds < 1 or p_window_seconds > 604800 then
    raise exception 'invalid rate limit arguments';
  end if;

  insert into public.mural_rate_limits (
    scope, source_fingerprint, window_started_at, request_count
  ) values (p_scope, p_source_fingerprint, v_now, 1)
  on conflict (scope, source_fingerprint) do update
  set request_count = case
        when public.mural_rate_limits.window_started_at
          <= v_now - make_interval(secs => p_window_seconds)
        then 1
        else public.mural_rate_limits.request_count + 1
      end,
      window_started_at = case
        when public.mural_rate_limits.window_started_at
          <= v_now - make_interval(secs => p_window_seconds)
        then v_now
        else public.mural_rate_limits.window_started_at
      end
  returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

create or replace function public.publish_mural_message(
  p_nickname text,
  p_city text,
  p_state text,
  p_message text,
  p_content_fingerprint text,
  p_source_fingerprint text,
  p_flagged boolean default false,
  p_rate_limit integer default 3,
  p_rate_window_seconds integer default 600
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_message public.mural_messages%rowtype;
begin
  if p_content_fingerprint !~ '^[a-f0-9]{64}$'
    or p_source_fingerprint !~ '^[a-f0-9]{64}$'
    or p_rate_limit < 1 or p_rate_limit > 20
    or p_rate_window_seconds < 60 or p_rate_window_seconds > 86400 then
    raise exception 'invalid fingerprint';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_content_fingerprint, 0));

  if not public.consume_mural_rate_limit(
    'publish', p_source_fingerprint, p_rate_limit, p_rate_window_seconds
  ) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  if exists (
    select 1 from public.mural_messages
    where content_fingerprint = p_content_fingerprint
      and created_at > clock_timestamp() - interval '24 hours'
  ) then
    return jsonb_build_object('ok', false, 'code', 'duplicate');
  end if;

  insert into public.mural_messages (
    nickname, city, state, message, status,
    content_fingerprint, source_fingerprint
  ) values (
    p_nickname, p_city, p_state, p_message,
    case when p_flagged then 'hidden' else 'published' end,
    p_content_fingerprint, p_source_fingerprint
  )
  returning * into v_message;

  return jsonb_build_object(
    'ok', true,
    'message', jsonb_build_object(
      'id', v_message.id,
      'nickname', v_message.nickname,
      'city', v_message.city,
      'state', v_message.state,
      'message', v_message.message,
      'status', v_message.status,
      'created_at', v_message.created_at
    )
  );
end;
$$;

create or replace function public.submit_mural_report(
  p_message_id uuid,
  p_reason text,
  p_details text,
  p_source_fingerprint text,
  p_auto_hide_threshold integer default 8,
  p_rate_limit integer default 5,
  p_rate_window_seconds integer default 86400
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_report_id uuid;
  v_unique_sources integer;
  v_message_status text;
begin
  if p_reason not in (
      'spam', 'harassment', 'inappropriate', 'personal_information', 'other'
    )
    or p_source_fingerprint !~ '^[a-f0-9]{64}$'
    or p_auto_hide_threshold < 5 or p_auto_hide_threshold > 20
    or p_rate_limit < 1 or p_rate_limit > 50
    or p_rate_window_seconds < 60 or p_rate_window_seconds > 604800 then
    raise exception 'invalid report arguments';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_message_id::text, 1));

  if not public.consume_mural_rate_limit(
    'report', p_source_fingerprint, p_rate_limit, p_rate_window_seconds
  ) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  if not exists (
    select 1 from public.mural_messages
    where id = p_message_id and status = 'published'
  ) then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if exists (
    select 1 from public.mural_reports
    where message_id = p_message_id
      and source_fingerprint = p_source_fingerprint
      and created_at > clock_timestamp() - interval '30 days'
  ) then
    return jsonb_build_object('ok', false, 'code', 'duplicate');
  end if;

  insert into public.mural_reports (
    message_id, reason, details, source_fingerprint
  ) values (p_message_id, p_reason, p_details, p_source_fingerprint)
  returning id into v_report_id;

  select count(distinct source_fingerprint)::integer
  into v_unique_sources
  from public.mural_reports
  where message_id = p_message_id
    and source_fingerprint is not null
    and created_at > clock_timestamp() - interval '30 days';

  update public.mural_messages
  set reports_count = v_unique_sources,
      status = case
        when v_unique_sources >= p_auto_hide_threshold then 'hidden'
        else status
      end,
      updated_at = clock_timestamp()
  where id = p_message_id
  returning status into v_message_status;

  return jsonb_build_object(
    'ok', true,
    'report_id', v_report_id,
    'auto_hidden', v_message_status = 'hidden'
  );
end;
$$;

create or replace function public.cleanup_mural_private_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.mural_messages
  set content_fingerprint = null,
      source_fingerprint = null
  where created_at < clock_timestamp() - interval '30 days'
    and (content_fingerprint is not null or source_fingerprint is not null);

  update public.mural_reports
  set source_fingerprint = null
  where created_at < clock_timestamp() - interval '30 days'
    and source_fingerprint is not null;

  delete from public.mural_rate_limits
  where window_started_at < clock_timestamp() - interval '8 days';

  delete from public.mural_reports
  where created_at < clock_timestamp() - interval '180 days';
end;
$$;

revoke all on function public.consume_mural_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.publish_mural_message(text, text, text, text, text, text, boolean, integer, integer)
  from public, anon, authenticated;
revoke all on function public.submit_mural_report(uuid, text, text, text, integer, integer, integer)
  from public, anon, authenticated;
revoke all on function public.cleanup_mural_private_data()
  from public, anon, authenticated;
grant execute on function public.consume_mural_rate_limit(text, text, integer, integer)
  to service_role;
grant execute on function public.publish_mural_message(text, text, text, text, text, text, boolean, integer, integer)
  to service_role;
grant execute on function public.submit_mural_report(uuid, text, text, text, integer, integer, integer)
  to service_role;
grant execute on function public.cleanup_mural_private_data()
  to service_role;

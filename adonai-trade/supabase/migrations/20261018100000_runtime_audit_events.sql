-- Adonai Trade runtime audit ledger. Apply only after review in the target Supabase project.
create table if not exists adonai_trade.runtime_audit_events (
  event_id uuid primary key,
  created_at timestamptz not null,
  service text not null,
  service_version text not null,
  correlation_id uuid,
  task_id uuid,
  market text,
  decision text not null check (decision in ('blocked', 'no_order', 'proposal_only')),
  reason_codes jsonb not null check (jsonb_typeof(reason_codes) = 'array'),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object')
);

alter table adonai_trade.runtime_audit_events enable row level security;
-- Preserve existing schema access for unrelated Trade integrations; grant only what the service role needs for this ledger.
grant usage on schema adonai_trade to service_role;
revoke all on table adonai_trade.runtime_audit_events from public, anon, authenticated, service_role;
grant select, insert on table adonai_trade.runtime_audit_events to service_role;

create or replace function adonai_trade.reject_runtime_audit_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'runtime audit events are append-only';
end;
$$;

revoke all on function adonai_trade.reject_runtime_audit_mutation() from public, anon, authenticated;
grant execute on function adonai_trade.reject_runtime_audit_mutation() to service_role;

drop trigger if exists runtime_audit_events_append_only on adonai_trade.runtime_audit_events;
create trigger runtime_audit_events_append_only
before update or delete on adonai_trade.runtime_audit_events
for each row execute function adonai_trade.reject_runtime_audit_mutation();

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
revoke all on table adonai_trade.runtime_audit_events from public, anon, authenticated;
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

drop trigger if exists runtime_audit_events_append_only on adonai_trade.runtime_audit_events;
create trigger runtime_audit_events_append_only
before update or delete on adonai_trade.runtime_audit_events
for each row execute function adonai_trade.reject_runtime_audit_mutation();

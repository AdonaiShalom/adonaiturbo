-- Add a tamper-evident SHA-256 chain to the existing append-only runtime audit ledger.
-- Existing rows are deterministically backfilled in created_at/event_id order.
alter table adonai_trade.runtime_audit_events
  add column chain_seq bigint,
  add column prev_hash text,
  add column event_hash text;

alter table adonai_trade.runtime_audit_events
  disable trigger runtime_audit_events_append_only;

do $$
declare
  r adonai_trade.runtime_audit_events%rowtype;
  v_seq bigint := 0;
  v_prev text := null;
  v_payload jsonb;
  v_hash text;
begin
  for r in select * from adonai_trade.runtime_audit_events order by created_at, event_id loop
    v_seq := v_seq + 1;
    v_payload := (to_jsonb(r) - 'prev_hash' - 'event_hash') || jsonb_build_object('chain_seq', v_seq);
    v_hash := encode(extensions.digest(convert_to(coalesce(v_prev, 'GENESIS') || '|' || v_payload::text, 'UTF8'), 'sha256'), 'hex');
    update adonai_trade.runtime_audit_events
       set chain_seq = v_seq, prev_hash = v_prev, event_hash = v_hash
     where event_id = r.event_id;
    v_prev := v_hash;
  end loop;
end;
$$;

alter table adonai_trade.runtime_audit_events enable trigger runtime_audit_events_append_only;
alter table adonai_trade.runtime_audit_events
  alter column chain_seq set not null,
  alter column event_hash set not null;
alter table adonai_trade.runtime_audit_events
  add constraint runtime_audit_events_chain_seq_unique unique (chain_seq),
  add constraint runtime_audit_events_event_hash_sha256 check (event_hash ~ '^[0-9a-f]{64}$'),
  add constraint runtime_audit_events_prev_hash_sha256 check (prev_hash is null or prev_hash ~ '^[0-9a-f]{64}$');

create or replace function adonai_trade.chain_runtime_audit_insert()
returns trigger language plpgsql
set search_path = pg_catalog, adonai_trade, extensions
as $$
declare v_prev text; v_seq bigint; v_payload jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended('adonai_trade.runtime_audit_events', 0));
  select chain_seq, event_hash into v_seq, v_prev
    from adonai_trade.runtime_audit_events order by chain_seq desc limit 1;
  if not found then v_seq := 0; v_prev := null; end if;
  new.chain_seq := v_seq + 1;
  new.prev_hash := v_prev;
  v_payload := to_jsonb(new) - 'prev_hash' - 'event_hash';
  new.event_hash := encode(extensions.digest(convert_to(coalesce(v_prev, 'GENESIS') || '|' || v_payload::text, 'UTF8'), 'sha256'), 'hex');
  return new;
end;
$$;
revoke all on function adonai_trade.chain_runtime_audit_insert() from public, anon, authenticated;
create trigger runtime_audit_events_chain_insert
before insert on adonai_trade.runtime_audit_events
for each row execute function adonai_trade.chain_runtime_audit_insert();

create or replace function adonai_trade.verify_runtime_audit_chain()
returns jsonb language plpgsql stable
set search_path = pg_catalog, adonai_trade, extensions
as $$
declare
  r adonai_trade.runtime_audit_events%rowtype;
  v_expected_prev text := null;
  v_expected_hash text;
  v_checked bigint := 0;
  v_payload jsonb;
begin
  for r in select * from adonai_trade.runtime_audit_events order by chain_seq loop
    v_checked := v_checked + 1;
    if r.chain_seq <> v_checked then
      return jsonb_build_object('ok', false, 'checked', v_checked - 1, 'event_id', r.event_id, 'reason', 'chain_sequence_gap');
    end if;
    if r.prev_hash is distinct from v_expected_prev then
      return jsonb_build_object('ok', false, 'checked', v_checked - 1, 'event_id', r.event_id, 'reason', 'previous_hash_mismatch');
    end if;
    v_payload := to_jsonb(r) - 'prev_hash' - 'event_hash';
    v_expected_hash := encode(extensions.digest(convert_to(coalesce(v_expected_prev, 'GENESIS') || '|' || v_payload::text, 'UTF8'), 'sha256'), 'hex');
    if r.event_hash is distinct from v_expected_hash then
      return jsonb_build_object('ok', false, 'checked', v_checked - 1, 'event_id', r.event_id, 'reason', 'event_hash_mismatch');
    end if;
    v_expected_prev := r.event_hash;
  end loop;
  return jsonb_build_object('ok', true, 'checked', v_checked, 'head_hash', v_expected_prev);
end;
$$;
revoke all on function adonai_trade.verify_runtime_audit_chain() from public, anon, authenticated;
grant execute on function adonai_trade.verify_runtime_audit_chain() to service_role;

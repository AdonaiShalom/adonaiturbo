
-- Additional integrity guards for the Adonai Trade excellence registry.
-- Apply after 20261017145301_adonai_trade_excellence_backlog_and_evidence.
-- No trading, integration_status, or user data tables are modified.

create or replace function adonai_trade.excellence_work_items_before_write()
returns trigger
language plpgsql
set search_path = pg_catalog, adonai_trade
as $$
begin
  new.updated_at := pg_catalog.now();

  if new.status = 'verified' then
    if not exists (
      select 1 from adonai_trade.excellence_evidence e
      where e.work_item_id = new.id
        and e.verified = true
        and e.source_reference is not null
        and pg_catalog.btrim(e.source_reference) <> ''
    ) then
      raise exception 'Cannot mark work item % verified without reviewed evidence with a source reference', new.work_key
        using errcode = '23514';
    end if;
    new.verified_at := coalesce(new.verified_at, pg_catalog.now());
  else
    new.verified_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists excellence_work_items_before_write_trg on adonai_trade.excellence_work_items;
create trigger excellence_work_items_before_write_trg
before insert or update on adonai_trade.excellence_work_items
for each row execute function adonai_trade.excellence_work_items_before_write();

alter table adonai_trade.excellence_evidence
  drop constraint if exists excellence_evidence_verified_source_check;
alter table adonai_trade.excellence_evidence
  add constraint excellence_evidence_verified_source_check
  check (verified = false or (source_reference is not null and pg_catalog.btrim(source_reference) <> ''));

create or replace function adonai_trade.excellence_evidence_append_only()
returns trigger
language plpgsql
set search_path = pg_catalog, adonai_trade
as $$
begin
  raise exception 'Evidence rows are append-only; create a new evidence record instead of modifying/deleting history'
    using errcode = '55000';
end;
$$;

drop trigger if exists excellence_evidence_append_only_trg on adonai_trade.excellence_evidence;
create trigger excellence_evidence_append_only_trg
before update or delete on adonai_trade.excellence_evidence
for each row execute function adonai_trade.excellence_evidence_append_only();

revoke update, delete, truncate, references, trigger
  on adonai_trade.excellence_evidence from service_role;
grant select, insert on adonai_trade.excellence_evidence to service_role;

comment on function adonai_trade.excellence_work_items_before_write() is
  'Maintains updated_at and prevents verified status without reviewed evidence.';
comment on function adonai_trade.excellence_evidence_append_only() is
  'Makes evidence history append-only for normal database operations.';

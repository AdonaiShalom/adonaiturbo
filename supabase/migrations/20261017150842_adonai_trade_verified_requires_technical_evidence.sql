-- Tighten completion semantics: planning/documentary evidence alone cannot verify a task.
-- Apply after the two Adonai Trade excellence registry migrations.

create or replace function adonai_trade.excellence_work_items_before_write()
returns trigger
language plpgsql
set search_path = pg_catalog, adonai_trade
as $$
begin
  new.updated_at := pg_catalog.now();

  if new.status = 'verified' then
    if not exists (
      select 1
      from adonai_trade.excellence_evidence e
      where e.work_item_id = new.id
        and e.verified = true
        and e.evidence_type in (
          'automated_test',
          'manual_test',
          'security_review',
          'benchmark',
          'deployment_check'
        )
        and e.source_reference is not null
        and pg_catalog.btrim(e.source_reference) <> ''
    ) then
      raise exception 'Cannot mark work item % verified without reviewed technical/test evidence with a source reference', new.work_key
        using errcode = '23514';
    end if;
    new.verified_at := coalesce(new.verified_at, pg_catalog.now());
  else
    new.verified_at := null;
  end if;

  return new;
end;
$$;

comment on function adonai_trade.excellence_work_items_before_write() is
  'Maintains updated_at and requires reviewed technical/test evidence with provenance before verified status. Documentary evidence alone is insufficient.';

-- Verified evidence must be technical/test evidence; documents alone cannot satisfy a task gate.
alter table adonai_trade.excellence_evidence
  drop constraint if exists excellence_evidence_verified_type_check;
alter table adonai_trade.excellence_evidence
  add constraint excellence_evidence_verified_type_check
  check (
    verified = false
    or (
      evidence_type in ('automated_test','manual_test','security_review','benchmark','deployment_check')
      and source_reference is not null
      and pg_catalog.btrim(source_reference) <> ''
    )
  );

comment on constraint excellence_evidence_verified_type_check
  on adonai_trade.excellence_evidence is
  'Verified evidence must be technical/test evidence with provenance; documentary records cannot prove task completion.';

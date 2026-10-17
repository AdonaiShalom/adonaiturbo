-- pgTAP regression tests for Adonai Trade excellence registry.
-- Run in a disposable Supabase test database after applying migrations.
begin;
select plan(12);

select has_table('adonai_trade', 'excellence_work_items', 'work-item registry exists');
select has_table('adonai_trade', 'excellence_evidence', 'evidence registry exists');
select ok((select relrowsecurity from pg_class where oid='adonai_trade.excellence_work_items'::regclass), 'RLS enabled on work items');
select ok((select relrowsecurity from pg_class where oid='adonai_trade.excellence_evidence'::regclass), 'RLS enabled on evidence');
select ok(not has_table_privilege('anon','adonai_trade.excellence_work_items','SELECT'), 'anon cannot read work items');
select ok(not has_table_privilege('authenticated','adonai_trade.excellence_work_items','SELECT'), 'authenticated cannot read work items directly');
select ok(has_table_privilege('service_role','adonai_trade.excellence_work_items','SELECT'), 'service role can read work items');
select ok(not has_table_privilege('service_role','adonai_trade.excellence_evidence','UPDATE'), 'service role cannot update evidence');
select ok(not has_table_privilege('service_role','adonai_trade.excellence_evidence','DELETE'), 'service role cannot delete evidence');
select ok(exists(select 1 from pg_trigger where tgname='excellence_work_items_before_write_trg' and not tgisinternal), 'work item integrity trigger exists');
select ok(exists(select 1 from pg_trigger where tgname='excellence_evidence_append_only_trg' and not tgisinternal), 'append-only evidence trigger exists');

-- Behavior tests execute in this transaction and are rolled back at the end.
select throws_ok(
  $$update adonai_trade.excellence_work_items set status='verified' where work_key='AT-006'$$,
  '23514', null,
  'cannot verify a work item without verified evidence'
);
rollback;

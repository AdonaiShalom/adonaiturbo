'use strict';
const assert = require('node:assert/strict');
const { createSupabaseAuditLedger } = require('../../runtime/audit-ledger.cjs');

async function main() {
  assert.equal(createSupabaseAuditLedger({}), null, 'missing credentials must disable the adapter');
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'http://example.com', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null, 'non-TLS remote endpoint must be rejected');

  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 201 };
  };
  const ledger = createSupabaseAuditLedger({
    SUPABASE_URL: 'https://project.supabase.co/',
    SUPABASE_SERVICE_ROLE_KEY: 'test-only-secret'
  }, fetchImpl);
  assert.ok(ledger);
  assert.equal(await ledger.check(), true);
  const result = await ledger.append({
    envelope: {
      correlation_id: '00000000-0000-4000-8000-000000000001',
      task_id: '00000000-0000-4000-8000-000000000002',
      market: 'CRYPTO'
    },
    decision: { decision: 'blocked', reason_codes: ['paper_mode_required'] },
    requestId: 'request-test'
  });
  assert.equal(result.persisted, true);
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /select=event_id&limit=1$/);
  assert.equal(calls[1].init.method, 'POST');
  assert.equal(calls[1].init.headers.prefer, 'return=minimal');
  const event = JSON.parse(calls[1].init.body);
  assert.equal(event.decision, 'blocked');
  assert.deepEqual(event.reason_codes, ['paper_mode_required']);
  assert.equal(event.details.execution_performed, false);
  assert.equal(event.details.mode, 'paper');
  assert.equal(event.correlation_id, '00000000-0000-4000-8000-000000000001');
  assert.equal(calls[1].init.headers.authorization, 'Bearer test-only-secret');
  console.log('PASS: Supabase audit adapter fails closed without config and emits append-only paper audit records');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

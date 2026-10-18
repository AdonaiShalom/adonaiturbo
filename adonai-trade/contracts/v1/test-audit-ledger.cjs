'use strict';
const assert = require('node:assert/strict');
const { createSupabaseAuditLedger } = require('../../runtime/audit-ledger.cjs');

async function main() {
  assert.equal(createSupabaseAuditLedger({}), null, 'missing credentials must disable the adapter');
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'http://example.com', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null, 'non-TLS remote endpoint must be rejected');
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'ftp://localhost', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null, 'non-HTTP schemes must be rejected even for loopback hostnames');
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'https://user:pass@project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null, 'URL userinfo must be rejected');
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'https://project.supabase.co?redirect=elsewhere', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null, 'URL query parameters must be rejected');
  assert.ok(createSupabaseAuditLedger({ SUPABASE_URL: 'http://127.0.0.1:54321', SUPABASE_SERVICE_ROLE_KEY: 'x' }, async () => ({ ok: true, status: 200 })), 'local HTTP is allowed for development');

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
  assert.equal(calls[0].init.headers['accept-profile'], 'adonai_trade');
  assert.equal(calls[1].init.method, 'POST');
  assert.equal(calls[1].init.headers.prefer, 'return=minimal');
  assert.equal(calls[1].init.headers['content-profile'], 'adonai_trade');
  const event = JSON.parse(calls[1].init.body);
  assert.equal(event.decision, 'blocked');
  assert.deepEqual(event.reason_codes, ['paper_mode_required']);
  assert.equal(event.details.execution_performed, false);
  assert.equal(event.details.mode, 'paper');
  assert.equal(event.correlation_id, '00000000-0000-4000-8000-000000000001');
  assert.equal(calls[1].init.headers.authorization, 'Bearer test-only-secret');

  await assert.rejects(() => ledger.append({ decision: { decision: 'execute_order', reason_codes: [] } }), /invalid_audit_decision/, 'ledger must reject execution decisions before writing');
  assert.equal(calls.length, 2, 'invalid decision must not trigger a network write');

  const failingLedger = createSupabaseAuditLedger({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-only-secret' }, async () => ({ ok: false, status: 503 }));
  await assert.rejects(() => failingLedger.check(), /audit_store_http_503/, 'ledger readiness must fail when persistence is unavailable');
  await assert.rejects(() => failingLedger.append({ decision: { decision: 'no_order', reason_codes: ['test'] } }), /audit_store_http_503/, 'failed persistence must not be reported as success');
  console.log('PASS: Supabase audit adapter fails closed without config and emits append-only paper audit records');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

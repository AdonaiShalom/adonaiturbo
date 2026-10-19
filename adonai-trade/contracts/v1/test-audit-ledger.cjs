'use strict';
const assert = require('node:assert/strict');
const { createSupabaseAuditLedger } = require('../../runtime/audit-ledger.cjs');

async function main() {
  assert.equal(createSupabaseAuditLedger({}), null);
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'http://example.com', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null);
  assert.equal(createSupabaseAuditLedger({ SUPABASE_URL: 'https://user:pass@project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'x' }), null);
  const calls = [];
  const env = { SUPABASE_URL: 'https://project.supabase.co/', SUPABASE_SERVICE_ROLE_KEY: 'test-only-secret' };
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/rpc/verify_runtime_audit_chain')) {
      return { ok: true, status: 200, json: async () => ({ ok: true, checked: 4, head_hash: 'a'.repeat(64) }) };
    }
    return { ok: true, status: 201 };
  };
  const ledger = createSupabaseAuditLedger(env, fetchImpl);
  assert.ok(ledger);
  assert.equal(await ledger.check(), true);
  assert.match(calls[0].url, /rpc\/verify_runtime_audit_chain$/);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['accept-profile'], 'adonai_trade');
  const result = await ledger.append({
    envelope: { correlation_id: '00000000-0000-4000-8000-000000000001', task_id: '00000000-0000-4000-8000-000000000002', market: 'CRYPTO' },
    decision: { decision: 'blocked', reason_codes: ['paper_mode_required'] },
    requestId: 'request-test'
  });
  assert.equal(result.persisted, true);
  assert.equal(result.chain_verified, true);
  assert.equal(result.chain_checked, 4);
  assert.equal(calls.length, 3);
  assert.equal(calls[1].init.method, 'POST');
  assert.match(calls[1].url, /runtime_audit_events$/);
  assert.equal(calls[1].init.headers.prefer, 'return=minimal');
  assert.equal(calls[1].init.headers['content-profile'], 'adonai_trade');
  assert.equal(calls[1].init.headers.authorization, 'Bearer test-only-secret');
  const event = JSON.parse(calls[1].init.body);
  assert.equal(event.decision, 'blocked');
  assert.deepEqual(event.reason_codes, ['paper_mode_required']);
  assert.equal(event.details.execution_performed, false);
  assert.equal(event.details.mode, 'paper');
  assert.equal(event.correlation_id, '00000000-0000-4000-8000-000000000001');
  assert.match(calls[2].url, /rpc\/verify_runtime_audit_chain$/);
  await assert.rejects(() => ledger.append({ decision: { decision: 'execute_order', reason_codes: [] } }), /invalid_audit_decision/);
  assert.equal(calls.length, 3);

  const corrupt = createSupabaseAuditLedger(env, async () => ({
    ok: true, status: 200, json: async () => ({ ok: false, checked: 1, reason: 'event_hash_mismatch' })
  }));
  await assert.rejects(() => corrupt.check(), /audit_chain_verification_failed/);
  const failing = createSupabaseAuditLedger(env, async () => ({ ok: false, status: 503 }));
  await assert.rejects(() => failing.check(), /audit_store_http_503/);
  await assert.rejects(() => failing.append({ decision: { decision: 'no_order', reason_codes: ['test'] } }), /audit_store_http_503/);
  process.stdout.write('PASS audit ledger: SHA-256 chain verification, append-only paper records, invalid-decision rejection, and fail-closed errors\n');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

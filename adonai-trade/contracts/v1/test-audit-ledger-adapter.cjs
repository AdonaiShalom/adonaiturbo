'use strict';

const assert = require('node:assert/strict');
const { createSupabaseAuditLedger } = require('../../runtime/audit-ledger.cjs');

async function main() {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({ url, init });
    return { ok: true, status: 201 };
  };
  const env = {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-key-not-a-secret'
  };
  const ledger = createSupabaseAuditLedger(env, fakeFetch);
  assert.ok(ledger, 'valid HTTPS configuration creates an audit ledger');
  assert.equal(await ledger.check(), true);
  assert.equal(requests[0].init.method, 'GET');
  assert.equal(requests[0].init.headers['accept-profile'], 'adonai_trade');
  assert.match(requests[0].url, /runtime_audit_events\?select=event_id&limit=1$/);

  const result = await ledger.append({
    envelope: { correlation_id: '11111111-1111-4111-8111-111111111111', task_id: '22222222-2222-4222-8222-222222222222', market: 'CRYPTO' },
    decision: { decision: 'proposal_only', reason_codes: ['paper_only'] },
    requestId: 'request-test'
  });
  assert.equal(result.persisted, true);
  assert.ok(result.event_id);
  const post = requests[1];
  assert.equal(post.init.method, 'POST');
  assert.equal(post.init.headers['content-profile'], 'adonai_trade');
  assert.equal(post.init.headers.prefer, 'return=minimal');
  const event = JSON.parse(post.init.body);
  assert.equal(event.event_id, result.event_id);
  assert.equal(event.service, 'adonai-trade');
  assert.equal(event.correlation_id, '11111111-1111-4111-8111-111111111111');
  assert.equal(event.task_id, '22222222-2222-4222-8222-222222222222');
  assert.equal(event.market, 'CRYPTO');
  assert.equal(event.decision, 'proposal_only');
  assert.equal(event.details.mode, 'paper');
  assert.equal(event.details.execution_performed, false);
  assert.equal(event.details.request_id, 'request-test');

  await assert.rejects(
    ledger.append({ decision: { decision: 'execute_order', reason_codes: [] } }),
    /invalid_audit_decision/
  );
  assert.equal(requests.length, 2, 'invalid decisions must not issue network requests');

  const failing = createSupabaseAuditLedger(env, async () => ({ ok: false, status: 403 }));
  await assert.rejects(failing.check(), /audit_store_http_403/);
  const missing = createSupabaseAuditLedger({}, fakeFetch);
  assert.equal(missing, null, 'missing configuration fails closed');
  const insecure = createSupabaseAuditLedger({ SUPABASE_URL: 'http://example.com', SUPABASE_SERVICE_ROLE_KEY: 'x' }, fakeFetch);
  assert.equal(insecure, null, 'non-local HTTP endpoint is rejected');

  process.stdout.write('PASS audit-ledger adapter: schema profile, append payload, paper-only fields, invalid-decision rejection, HTTP failure, and fail-closed configuration\\n');
}

main().catch((error) => {
  process.stderr.write((error && error.stack || String(error)) + '\\n');
  process.exitCode = 1;
});

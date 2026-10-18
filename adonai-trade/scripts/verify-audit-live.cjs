'use strict';

// Explicit operator-run smoke test. It writes one harmless paper/no_order audit event.
// It never places an order and refuses to run unless the operator opts in explicitly.
const assert = require('node:assert/strict');
const { createSupabaseAuditLedger } = require('../runtime/audit-ledger.cjs');

async function main() {
  if (process.env.ADONAI_TRADE_CONFIRM_LIVE_AUDIT !== 'YES') {
    throw new Error('Set ADONAI_TRADE_CONFIRM_LIVE_AUDIT=YES to authorize one persistent test audit event.');
  }
  const env = process.env;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in this private server environment.');
  }
  const ledger = createSupabaseAuditLedger(env);
  if (!ledger) throw new Error('Supabase audit ledger configuration is invalid; no event written.');
  await ledger.check();

  const result = await ledger.append({
    envelope: { market: 'AUDIT_SMOKE_TEST' },
    decision: { decision: 'no_order', reason_codes: ['operator_initiated_audit_smoke_test'] },
    requestId: 'audit-smoke-' + new Date().toISOString()
  });
  assert.equal(result.persisted, true);
  assert.ok(result.event_id);

  const baseUrl = env.SUPABASE_URL.replace(/\\/+$/, '');
  const response = await fetch(baseUrl + '/rest/v1/runtime_audit_events?select=event_id,decision,reason_codes,details&event_id=eq.' + encodeURIComponent(result.event_id), {
    method: 'GET',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: 'Bearer ' + env.SUPABASE_SERVICE_ROLE_KEY,
      accept: 'application/json',
      'accept-profile': 'adonai_trade'
    },
    signal: AbortSignal.timeout(4000)
  });
  if (!response.ok) throw new Error('audit_verification_http_' + response.status + '; event id=' + result.event_id);
  const rows = await response.json();
  assert.equal(rows.length, 1, 'inserted audit event must be readable by the service role');
  assert.equal(rows[0].event_id, result.event_id);
  assert.equal(rows[0].decision, 'no_order');
  assert.deepEqual(rows[0].reason_codes, ['operator_initiated_audit_smoke_test']);
  assert.equal(rows[0].details.execution_performed, false);
  process.stdout.write(JSON.stringify({
    status: 'verified',
    event_id: result.event_id,
    decision: rows[0].decision,
    execution_performed: rows[0].details.execution_performed
  }) + '\\n');
}
main().catch((error) => {
  process.stderr.write(String(error.message || error) + '\\n');
  process.exitCode = 1;
});

'use strict';
const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-21T12:00:00.000Z');
  for (const env of [{}, { OPEN_FOMO_API_KEY: 'test-placeholder-not-a-secret' }]) {
    const server = createServer({ now: () => nowMs, auditLedger: null, env });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    try {
      const response = await fetch('http://127.0.0.1:' + server.address().port + '/api/v1/smart-money/status');
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const body = await response.json();
      assert.equal(body.status, 'unavailable');
      assert.equal(body.mode, 'paper');
      assert.equal(body.execution_enabled, false);
      assert.deepEqual(body.events, []);
      assert.deepEqual(body.rankings, []);
      assert.ok(body.reason_codes.includes('smart_money_adapter_not_implemented'));
      assert.ok(body.reason_codes.includes('source_data_not_verified'));
      assert.equal(body.provider_configured, Boolean(env.OPEN_FOMO_API_KEY));
    } finally {
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  }
  console.log('Smart Money endpoint: PASS (fail-closed; empty unverified feed; no execution)');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\\n'); process.exitCode = 1; });

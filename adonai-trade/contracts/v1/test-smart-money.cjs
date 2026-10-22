'use strict';
const assert = require('node:assert/strict');
const { getSmartMoneyLeaderboard } = require('../../runtime/smart-money.cjs');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-21T12:00:00.000Z');
  const apiKey = 'test-only-not-a-real-key';
  const goodFetch = async (url, options) => {
    assert.match(url, /^https:\/\/getfomoapi\.fun\/api\/leaderboard\/24h\?limit=10$/);
    assert.equal(options.method, 'GET');
    assert.equal(options.headers.accept, 'application/json');
    assert.equal(options.headers['X-API-Key'], apiKey);
    return { ok: true, json: async () => ({
      success: true,
      responseObject: { leaderboard: [{ id: 'sample-id', displayName: 'Sample Trader', userHandle: 'sample', solana: 'SampleWallet', evm: '0xsample', pnl24h: 123, totalVolume: 456 }] }
    }) };
  };
  const noKey = await getSmartMoneyLeaderboard({ fetchImpl: goodFetch, apiKey: '', nowMs });
  assert.equal(noKey.status, 'unavailable');
  assert.ok(noKey.reason_codes.includes('provider_api_key_not_configured'));

  const good = await getSmartMoneyLeaderboard({ fetchImpl: goodFetch, apiKey, nowMs });
  assert.equal(good.status, 'available');
  assert.equal(good.rankings.length, 1);
  assert.equal(good.rankings[0].handle, 'sample');
  assert.equal(good.rankings[0].pnl_usd, 123);
  assert.equal(good.execution_enabled, false);
  assert.equal(good.stale, null);

  const badSchema = await getSmartMoneyLeaderboard({ apiKey, fetchImpl: async () => ({ ok: true, json: async () => ({ hello: 'world' }) }), nowMs });
  assert.equal(badSchema.status, 'unavailable');
  assert.deepEqual(badSchema.rankings, []);
  assert.ok(badSchema.reason_codes.includes('provider_schema_unrecognized'));

  const failed = await getSmartMoneyLeaderboard({ apiKey, fetchImpl: async () => { throw new Error('offline'); }, nowMs });
  assert.equal(failed.status, 'unavailable');
  assert.deepEqual(failed.rankings, []);
  assert.equal((await getSmartMoneyLeaderboard({ apiKey, fetchImpl: goodFetch, window: 'invalid', nowMs })).status, 'unavailable');

  const server = createServer({ now: () => nowMs, auditLedger: null, env: { OPEN_FOMO_API_KEY: apiKey }, fetchImpl: goodFetch });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const response = await fetch('http://127.0.0.1:' + server.address().port + '/api/v1/smart-money/leaderboard?window=24h');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'available');
    assert.equal(body.execution_enabled, false);
    assert.equal(body.rankings[0].handle, 'sample');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
  console.log('Smart Money provider contract: PASS (documented URL, API-key header, schema validation, fail-closed errors, HTTP route, no execution)');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

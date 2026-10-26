'use strict';
const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-26T15:00:00.000Z');
  const server = createServer({
    now: () => nowMs,
    auditLedger: { async check() { return true; }, async append() { return { persisted: true }; } },
    fetchImpl: async (url, options = {}) => {
      assert.equal(options.method, 'GET');
      const parsed = new URL(url);
      assert.equal(parsed.origin, 'https://demo-fapi.binance.com');
      assert.equal(parsed.pathname, '/fapi/v1/ticker/24hr');
      return {
        ok: true, status: 200,
        headers: { get: () => '120' },
        async json() { return { symbol: 'BTCUSDT', lastPrice: '67123.45', closeTime: nowMs - 1000 }; }
      };
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const response = await fetch(base + '/api/v1/markets/crypto-perp-demo-quote?symbol=BTCUSDT');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'verified');
    assert.equal(body.desk, 'CRYPTO_PERP_DEMO');
    assert.equal(body.source, 'binance_futures_demo_24hr');
    assert.equal(body.price, 67123.45);
    assert.equal(body.execution_enabled, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
  process.stdout.write('PASS: read-only HTTP endpoint for Binance Futures Demo quote.\\n');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\\n'); process.exitCode = 1; });

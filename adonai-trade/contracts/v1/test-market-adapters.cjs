'use strict';
const assert = require('node:assert/strict');
const { getQuote } = require('../../runtime/market-adapters.cjs');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-18T12:00:00.000Z');
  const fetchMock = async (url, options = {}) => {
    assert.equal(options.method, 'GET');
    const u = new URL(url);
    if (u.hostname === 'api.binance.com') return { ok: true, status: 200, async json() { return { lastPrice: '67123.45', closeTime: nowMs - 1000 }; } };
    if (u.hostname === 'api.frankfurter.dev') return { ok: true, status: 200, async json() { return { date: '2026-10-18', rates: { USD: 1.08 } }; } };
    if (u.hostname === 'brapi.dev') {
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      return { ok: true, status: 200, async json() { return { results: [{ regularMarketPrice: 38.5, regularMarketTime: Math.floor((nowMs - 2000) / 1000) }] }; } };
    }
    if (u.hostname === 'www.alphavantage.co') return { ok: true, status: 200, async json() { return { 'Global Quote': { '05. price': '123.4', '07. latest trading day': '2026-10-17' } }; } };
    throw new Error('unexpected provider');
  };
  const crypto = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: fetchMock, nowMs });
  assert.equal(crypto.status, 'verified'); assert.equal(crypto.price, 67123.45); assert.equal(crypto.execution_enabled, false);
  const forex = await getQuote({ desk: 'FOREX', symbol: 'EURUSD', fetchImpl: fetchMock, nowMs });
  assert.equal(forex.status, 'stale'); assert.equal(forex.reason_code, 'quote_stale', 'daily reference rates must not be mislabeled as live quotes');
  const b3 = await getQuote({ desk: 'B3', symbol: 'PETR4', env: { BRAPI_TOKEN: 'test-token' }, fetchImpl: fetchMock, nowMs });
  assert.equal(b3.status, 'verified'); assert.equal(b3.currency, 'BRL');
  const international = await getQuote({ desk: 'INTERNATIONAL', symbol: 'IBM', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: fetchMock, nowMs });
  assert.equal(international.status, 'unverified'); assert.equal(international.reason_code, 'provider_intraday_timestamp_unavailable');
  const missing = await getQuote({ desk: 'B3', symbol: 'PETR4', env: {}, fetchImpl: fetchMock, nowMs });
  assert.equal(missing.status, 'unavailable'); assert.equal(missing.reason_code, 'brapi_token_not_configured');
  const invalid = await getQuote({ desk: 'CRYPTO', symbol: '../BTC', fetchImpl: fetchMock, nowMs });
  assert.equal(invalid.status, 'unavailable'); assert.equal(invalid.reason_code, 'invalid_crypto_symbol');
  const badPrice = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: true, async json() { return { lastPrice: 'NaN', closeTime: nowMs }; } }), nowMs });
  assert.equal(badPrice.status, 'unverified'); assert.equal(badPrice.reason_code, 'invalid_provider_price');

  const server = createServer({ now: () => nowMs, auditLedger: null, env: {}, fetchImpl: fetchMock });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const response = await fetch(base + '/api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'verified');
    assert.equal(body.execution_enabled, false);
    const unavailable = await fetch(base + '/api/v1/markets/quote?desk=B3&symbol=PETR4');
    assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).reason_code, 'brapi_token_not_configured');
    console.log('PASS: quote adapters, timestamp freshness, credentials gating, fail-closed validation, and read-only HTTP endpoint');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

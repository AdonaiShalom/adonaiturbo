'use strict';
const assert = require('node:assert/strict');
const { getBinanceFuturesDemoQuote } = require('../../runtime/market-adapters.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-26T15:00:00.000Z');
  const fetchMock = async (url, options = {}) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://demo-fapi.binance.com');
    assert.equal(parsed.pathname, '/fapi/v1/ticker/24hr');
    assert.equal(parsed.searchParams.get('symbol'), 'BTCUSDT');
    assert.equal(options.method, 'GET');
    return {
      ok: true,
      status: 200,
      headers: { get: () => '120' },
      async json() {
        return { symbol: 'BTCUSDT', lastPrice: '67123.45', closeTime: nowMs - 1000 };
      }
    };
  };
  const result = await getBinanceFuturesDemoQuote({ symbol: 'BTCUSDT', fetchImpl: fetchMock, nowMs });
  assert.equal(result.status, 'verified');
  assert.equal(result.desk, 'CRYPTO_PERP_DEMO');
  assert.equal(result.symbol, 'BTCUSDT');
  assert.equal(result.price, 67123.45);
  assert.equal(result.source, 'binance_futures_demo_24hr');
  assert.equal(result.observed_at, new Date(nowMs - 1000).toISOString());
  assert.equal(result.execution_enabled, false);

  const mismatch = await getBinanceFuturesDemoQuote({
    symbol: 'BTCUSDT', nowMs,
    fetchImpl: async () => ({ ok: true, status: 200, headers: { get: () => '100' }, async json() { return { symbol: 'ETHUSDT', lastPrice: '3000', closeTime: nowMs }; } })
  });
  assert.equal(mismatch.status, 'unverified');
  assert.equal(mismatch.reason_code, 'provider_symbol_mismatch');

  const missingTimestamp = await getBinanceFuturesDemoQuote({
    symbol: 'BTCUSDT', nowMs,
    fetchImpl: async () => ({ ok: true, status: 200, headers: { get: () => '100' }, async json() { return { symbol: 'BTCUSDT', lastPrice: '67123.45' }; } })
  });
  assert.equal(missingTimestamp.status, 'unverified');
  assert.equal(missingTimestamp.reason_code, 'provider_timestamp_missing');

  const httpFailure = await getBinanceFuturesDemoQuote({
    symbol: 'BTCUSDT', nowMs,
    fetchImpl: async () => ({ ok: false, status: 503, headers: { get: () => '0' } })
  });
  assert.equal(httpFailure.status, 'unavailable');
  assert.equal(httpFailure.reason_code, 'provider_http_503');
  assert.equal(httpFailure.execution_enabled, false);

  const invalid = await getBinanceFuturesDemoQuote({ symbol: 'BTC/USDT', fetchImpl: fetchMock, nowMs });
  assert.equal(invalid.status, 'unavailable');
  assert.equal(invalid.reason_code, 'invalid_crypto_symbol');
  process.stdout.write('PASS: Binance Futures Demo quote adapter contract; read-only, symbol/timestamp/failure checks.\\n');
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\\n'); process.exitCode = 1; });

'use strict';
const assert = require('node:assert/strict');
const { getQuote, MAX_RESPONSE_BYTES } = require('../../runtime/market-adapters.cjs');
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
    if (u.hostname === 'www.alphavantage.co') { assert.equal(u.searchParams.get('interval'),'1min'); if(u.searchParams.get('function')==='FX_INTRADAY') return {ok:true,status:200,async json(){return {'Meta Data':{'6. Time Zone':'US/Eastern'},'Time Series FX (1min)':{'2026-10-18 07:59:00':{'4. close':'1.08'}}};}}; assert.equal(u.searchParams.get('function'),'TIME_SERIES_INTRADAY'); return { ok: true, status: 200, async json() { return { 'Meta Data': {'6. Time Zone':'US/Eastern'}, 'Time Series (1min)': {'2026-10-18 07:59:00': {'4. close':'123.4'}} }; } }; }
    throw new Error('unexpected provider');
  };
  const crypto = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: fetchMock, nowMs });
  assert.equal(crypto.status, 'verified'); assert.equal(crypto.price, 67123.45); assert.equal(crypto.execution_enabled, false);
  const forex = await getQuote({ desk: 'FOREX', symbol: 'EURUSD', fetchImpl: fetchMock, nowMs });
  assert.equal(forex.status, 'unverified'); assert.equal(forex.reason_code, 'daily_reference_not_intraday', 'daily reference rates must not be mislabeled as live quotes');
  const forexIntraday = await getQuote({ desk: 'FOREX', symbol: 'EURUSD', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: fetchMock, nowMs });
  assert.equal(forexIntraday.status, 'verified'); assert.equal(forexIntraday.price, 1.08); assert.equal(forexIntraday.currency, 'USD'); assert.equal(forexIntraday.source, 'alphavantage_fx_intraday_1min'); assert.equal(forexIntraday.observed_at, '2026-10-18T11:59:00.000Z');
  const invalidDailyForex = await getQuote({ desk: 'FOREX', symbol: 'EURUSD', fetchImpl: async () => ({ ok: true, status: 200, async json() { return { date: 'not-a-date', rates: { USD: -1 } }; } }), nowMs });
  assert.equal(invalidDailyForex.status, 'unverified'); assert.equal(invalidDailyForex.reason_code, 'invalid_daily_reference_data');
  const impossibleDailyForex = await getQuote({ desk: 'FOREX', symbol: 'EURUSD', fetchImpl: async () => ({ ok: true, status: 200, async json() { return { date: '2026-02-31', rates: { USD: 1.08 } }; } }), nowMs });
  assert.equal(impossibleDailyForex.status, 'unverified'); assert.equal(impossibleDailyForex.reason_code, 'invalid_daily_reference_data');
  const b3 = await getQuote({ desk: 'B3', symbol: 'PETR4', env: { BRAPI_TOKEN: 'test-token' }, fetchImpl: fetchMock, nowMs });
  assert.equal(b3.status, 'verified'); assert.equal(b3.currency, 'BRL');
  const international = await getQuote({ desk: 'INTERNATIONAL', symbol: 'IBM', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: fetchMock, nowMs });
  assert.equal(international.status, 'verified'); assert.equal(international.price, 123.4); assert.equal(international.source, 'alphavantage_intraday_1min'); assert.equal(international.observed_at, '2026-10-18T11:59:00.000Z'); assert.equal(international.execution_enabled, false);
  const badInternationalPrice = await getQuote({ desk: 'INTERNATIONAL', symbol: 'IBM', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: async () => ({ ok: true, status: 200, async json() { return { 'Meta Data': {'6. Time Zone':'US/Eastern'}, 'Time Series (1min)': {'2026-10-18 07:59:00': {'4. close':'-1'}} }; } }), nowMs });
  assert.equal(badInternationalPrice.status, 'unverified'); assert.equal(badInternationalPrice.reason_code, 'invalid_provider_price');
  const badInternationalDate = await getQuote({ desk: 'INTERNATIONAL', symbol: 'IBM', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: async () => ({ ok: true, status: 200, async json() { return { 'Meta Data': {'6. Time Zone':'US/Eastern'}, 'Time Series (1min)': {'2026-02-31 07:59:00': {'4. close':'123.4'}} }; } }), nowMs });
  assert.equal(badInternationalDate.status, 'unverified'); assert.equal(badInternationalDate.reason_code, 'invalid_provider_timestamp_or_timezone');
  const staleInternational = await getQuote({ desk: 'INTERNATIONAL', symbol: 'IBM', env: { ALPHAVANTAGE_API_KEY: 'test-key' }, fetchImpl: async () => ({ ok: true, status: 200, async json() { return { 'Meta Data': {'6. Time Zone':'US/Eastern'}, 'Time Series (1min)': {'2026-10-18 07:56:00': {'4. close':'123.4'}} }; } }), nowMs });
  assert.equal(staleInternational.status, 'stale'); assert.equal(staleInternational.reason_code, 'quote_stale');
  const missing = await getQuote({ desk: 'B3', symbol: 'PETR4', env: {}, fetchImpl: fetchMock, nowMs });
  assert.equal(missing.status, 'unavailable'); assert.equal(missing.reason_code, 'brapi_token_not_configured');
  const invalid = await getQuote({ desk: 'CRYPTO', symbol: 'BTC_USDT', fetchImpl: fetchMock, nowMs });
  assert.equal(invalid.status, 'unavailable'); assert.equal(invalid.reason_code, 'invalid_crypto_symbol');
  const unknownDesk = await getQuote({ desk: 'MARS', symbol: 'BTCUSDT', fetchImpl: fetchMock, nowMs });
  assert.equal(unknownDesk.status, 'unavailable'); assert.equal(unknownDesk.reason_code, 'unknown_market_desk');
  const futureQuote = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: true, status: 200, async json() { return { lastPrice: '10', closeTime: nowMs + 120000 }; } }), nowMs });
  assert.equal(futureQuote.status, 'unverified'); assert.equal(futureQuote.reason_code, 'provider_timestamp_in_future');
  const badPrice = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: true, status: 200, async json() { return { lastPrice: 'NaN', closeTime: nowMs }; } }), nowMs });
  assert.equal(badPrice.status, 'unverified'); assert.equal(badPrice.reason_code, 'invalid_provider_price');
  const providerError = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: false, status: 429, async json() { return {}; } }), nowMs });
  assert.equal(providerError.status, 'unavailable'); assert.equal(providerError.reason_code, 'provider_http_429', 'provider throttling should be distinguishable from network failure');
  const oversizedDeclared = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: true, status: 200, headers: { get: (name) => name === 'content-length' ? String(MAX_RESPONSE_BYTES + 1) : null }, async json() { throw new Error('must not parse oversized response'); } }), nowMs });
  assert.equal(oversizedDeclared.status, 'unavailable'); assert.equal(oversizedDeclared.reason_code, 'provider_response_too_large');
  const oversizedBody = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async () => ({ ok: true, status: 200, async json() { return { payload: 'x'.repeat(MAX_RESPONSE_BYTES + 1) }; } }), nowMs });
  assert.equal(oversizedBody.status, 'unavailable'); assert.equal(oversizedBody.reason_code, 'provider_response_too_large');
  let oversizedStreamCancelled = false;
  const oversizedStreaming = await getQuote({ desk: 'CRYPTO', symbol: 'BTCUSDT', fetchImpl: async (_url, options) => {
    assert.equal(options.redirect, 'error', 'provider redirects must not be followed');
    assert.ok(options.signal instanceof AbortSignal, 'provider request must have an abort signal');
    return { ok: true, status: 200, headers: { get: () => null }, body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_RESPONSE_BYTES + 1)); }, cancel() { oversizedStreamCancelled = true; } }) };
  }, nowMs });
  assert.equal(oversizedStreaming.status, 'unavailable'); assert.equal(oversizedStreaming.reason_code, 'provider_response_too_large');
  assert.equal(oversizedStreamCancelled, true, 'oversized streaming body must be cancelled before buffering');

  const server = createServer({ now: () => nowMs, auditLedger: null, env: {}, fetchImpl: fetchMock, quoteRateLimit: 3 });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const response = await fetch(base + '/api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store', 'market quotes must not be cached by browsers or intermediaries');
    const body = await response.json();
    assert.equal(body.status, 'verified');
    assert.equal(body.execution_enabled, false);
    const unavailable = await fetch(base + '/api/v1/markets/quote?desk=B3&symbol=PETR4');
    assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).reason_code, 'brapi_token_not_configured');
    const unknown = await fetch(base + '/api/v1/markets/quote?desk=MARS&symbol=BTCUSDT');
    assert.equal(unknown.status, 503);
    assert.equal((await unknown.json()).reason_code, 'unknown_market_desk');
    const limited = await fetch(base + '/api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT');
    assert.equal(limited.status, 429);
    assert.equal((await limited.json()).reason_codes[0], 'quote_rate_limit_exceeded');
    assert.equal(limited.headers.get('retry-after'), '60');
    assert.equal(limited.headers.get('ratelimit-limit'), '3');
    assert.equal(limited.headers.get('ratelimit-remaining'), '0');
    console.log('PASS: quote freshness, invalid responses, provider size limits, rate limiting, credential gating, and read-only HTTP endpoint');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

'use strict';

const TIMEOUT_MS = 5000;
const MAX_RESPONSE_BYTES = 1024 * 1024;
const MAX_AGE_MS = 120000;
const DESK_IDS = new Set(['CRYPTO', 'FOREX', 'B3', 'INTERNATIONAL']);

function safeTimestamp(value) {
  const n = Date.parse(value);
  return Number.isFinite(n) ? new Date(n).toISOString() : null;
}
function quote(status, extra = {}) {
  return { status, mode: 'read_only', execution_enabled: false, ...extra };
}
async function getJson(fetchImpl, url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, { method: 'GET', headers: { accept: 'application/json', ...headers }, signal: controller.signal, redirect: 'error' });
    if (!response.ok) throw new Error('provider_http_' + response.status);
    const declaredLength = Number(response.headers && response.headers.get && response.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) throw Object.assign(new Error('provider_response_too_large'), { code: 'PROVIDER_RESPONSE_TOO_LARGE' });
    // Real fetch responses stream. Enforce a byte limit before buffering/parsing JSON.
    if (response.body && typeof response.body.getReader === 'function') {
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_RESPONSE_BYTES) {
            await reader.cancel().catch(() => {});
            throw Object.assign(new Error('provider_response_too_large'), { code: 'PROVIDER_RESPONSE_TOO_LARGE' });
          }
          chunks.push(value);
        }
      } finally {
        try { reader.releaseLock(); } catch {}
      }
      const merged = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
      return JSON.parse(new TextDecoder().decode(merged));
    }
    // Small compatibility path for injected test doubles without a stream body.
    const data = await response.json();
    if (Buffer.byteLength(JSON.stringify(data), 'utf8') > MAX_RESPONSE_BYTES) throw Object.assign(new Error('provider_response_too_large'), { code: 'PROVIDER_RESPONSE_TOO_LARGE' });
    return data;
  } finally { clearTimeout(timer); }
}
function freshQuote({ desk, symbol, price, currency, source, observedAt, nowMs }) {
  const timestamp = safeTimestamp(observedAt);
  if (!timestamp) return quote('unverified', { desk, symbol, source, reason_code: 'provider_timestamp_missing' });
  const ageMs = nowMs - Date.parse(timestamp);
  if (ageMs < -30000) return quote('unverified', { desk, symbol, source, observed_at: timestamp, reason_code: 'provider_timestamp_in_future' });
  if (ageMs > MAX_AGE_MS) return quote('stale', { desk, symbol, source, observed_at: timestamp, age_ms: ageMs, reason_code: 'quote_stale' });
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return quote('unverified', { desk, symbol, source, observed_at: timestamp, reason_code: 'invalid_provider_price' });
  return quote('verified', { desk, symbol, price: n, currency, source, observed_at: timestamp, age_ms: Math.max(0, ageMs), provider_timestamp_verified: true });
}
async function getQuote({ desk, symbol, env = process.env, fetchImpl = globalThis.fetch, nowMs = Date.now() }) {
  const id = String(desk || '').toUpperCase();
  const normalizedSymbol = String(symbol || '').trim().toUpperCase();
  if (!DESK_IDS.has(id)) return quote('unavailable', { reason_code: 'unknown_market_desk' });
  if (!/^[A-Z0-9._-]{3,20}$/.test(normalizedSymbol)) return quote('unavailable', { reason_code: 'invalid_symbol' });
  if (typeof fetchImpl !== 'function') return quote('unavailable', { reason_code: 'fetch_unavailable' });
  try {
    if (id === 'CRYPTO') {
      if (!/^[A-Z0-9]{5,15}$/.test(normalizedSymbol)) return quote('unavailable', { reason_code: 'invalid_crypto_symbol' });
      const data = await getJson(fetchImpl, 'https://api.binance.com/api/v3/ticker/24hr?symbol=' + encodeURIComponent(normalizedSymbol));
      return freshQuote({ desk: id, symbol: normalizedSymbol, price: data.lastPrice, currency: normalizedSymbol.endsWith('USDT') ? 'USDT' : 'quote_currency_in_symbol', source: 'binance_spot_24hr', observedAt: Number.isFinite(Number(data.closeTime)) ? new Date(Number(data.closeTime)).toISOString() : null, nowMs });
    }
    if (id === 'FOREX') {
      const match = normalizedSymbol.match(/^([A-Z]{3})[-_]?([A-Z]{3})$/);
      if (!match) return quote('unavailable', { reason_code: 'invalid_forex_pair' });
      const [, base, target] = match;
      const data = await getJson(fetchImpl, 'https://api.frankfurter.dev/v1/latest?base=' + base + '&symbols=' + target);
      const referenceDate = /^\d{4}-\d{2}-\d{2}$/.test(String(data.date || '')) ? data.date : null;
      const referencePrice = Number(data.rates && data.rates[target]);
      const parsedReferenceDate = referenceDate ? new Date(referenceDate + 'T00:00:00Z') : null;
      const validCalendarDate = Boolean(parsedReferenceDate && Number.isFinite(parsedReferenceDate.getTime()) && parsedReferenceDate.toISOString().slice(0, 10) === referenceDate);
      if (!validCalendarDate || !Number.isFinite(referencePrice) || referencePrice <= 0) {
        return quote('unverified', { desk: id, symbol: base + '/' + target, source: 'frankfurter_ecb_reference', reason_code: 'invalid_daily_reference_data' });
      }
      // Frankfurter/BCE provides daily reference rates, not an intraday market quote.
      return quote('unverified', { desk: id, symbol: base + '/' + target, price: referencePrice, currency: target, source: 'frankfurter_ecb_reference', provider_trading_day: referenceDate, reason_code: 'daily_reference_not_intraday' });
    }
    if (id === 'B3') {
      if (!env.BRAPI_TOKEN) return quote('unavailable', { desk: id, symbol: normalizedSymbol, reason_code: 'brapi_token_not_configured' });
      const data = await getJson(fetchImpl, 'https://brapi.dev/api/quote/' + encodeURIComponent(normalizedSymbol), { Authorization: 'Bearer ' + env.BRAPI_TOKEN });
      const item = Array.isArray(data.results) ? data.results[0] : null;
      if (!item) return quote('unavailable', { desk: id, symbol: normalizedSymbol, source: 'brapi', reason_code: 'provider_quote_missing' });
      return freshQuote({ desk: id, symbol: normalizedSymbol, price: item.regularMarketPrice, currency: 'BRL', source: 'brapi', observedAt: item.regularMarketTime ? new Date(item.regularMarketTime * 1000).toISOString() : null, nowMs });
    }
    if (!env.ALPHAVANTAGE_API_KEY) return quote('unavailable', { desk: id, symbol: normalizedSymbol, reason_code: 'international_provider_not_configured' });
    const data = await getJson(fetchImpl, 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + encodeURIComponent(normalizedSymbol) + '&apikey=' + encodeURIComponent(env.ALPHAVANTAGE_API_KEY));
    const item = data['Global Quote'];
    if (!item || !item['05. price'] || !item['07. latest trading day']) return quote('unavailable', { desk: id, symbol: normalizedSymbol, source: 'alphavantage', reason_code: 'provider_quote_missing' });
    const internationalPrice = Number(item['05. price']);
    const tradingDay = String(item['07. latest trading day']);
    const parsedTradingDay = /^\d{4}-\d{2}-\d{2}$/.test(tradingDay) ? new Date(tradingDay + 'T00:00:00Z') : null;
    const validTradingDay = Boolean(parsedTradingDay && Number.isFinite(parsedTradingDay.getTime()) && parsedTradingDay.toISOString().slice(0, 10) === tradingDay);
    if (!Number.isFinite(internationalPrice) || internationalPrice <= 0 || !validTradingDay) return quote('unverified', { desk: id, symbol: normalizedSymbol, source: 'alphavantage_global_quote', reason_code: 'invalid_provider_quote_data' });
    return quote('unverified', { desk: id, symbol: normalizedSymbol, source: 'alphavantage_global_quote', price: internationalPrice, provider_trading_day: tradingDay, reason_code: 'provider_intraday_timestamp_unavailable' });
  } catch (error) {
    const reason = error && error.code === 'PROVIDER_RESPONSE_TOO_LARGE' ? 'provider_response_too_large' : error && error.name === 'AbortError' ? 'provider_timeout' : 'provider_request_failed';
    return quote('unavailable', { desk: id, symbol: normalizedSymbol, reason_code: reason });
  }
}
module.exports = { getQuote, MAX_AGE_MS, TIMEOUT_MS, MAX_RESPONSE_BYTES };

'use strict';

const TIMEOUT_MS = 5000;
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
    const response = await fetchImpl(url, {
      method: 'GET',
      headers: { accept: 'application/json', ...headers },
      signal: controller.signal,
      redirect: 'error'
    });
    if (!response.ok) throw new Error('provider_http_' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
function validatePrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) throw new Error('invalid_provider_price');
  return n;
}
function freshQuote({ desk, symbol, price, currency, source, observedAt, nowMs }) {
  const timestamp = safeTimestamp(observedAt);
  if (!timestamp) return quote('unverified', { desk, symbol, source, reason_code: 'provider_timestamp_missing' });
  const ageMs = Math.max(0, nowMs - Date.parse(timestamp));
  if (ageMs > MAX_AGE_MS) {
    return quote('stale', { desk, symbol, source, observed_at: timestamp, age_ms: ageMs, reason_code: 'quote_stale' });
  }
  return quote('verified', {
    desk, symbol, price: validatePrice(price), currency, source,
    observed_at: timestamp, age_ms: ageMs, provider_timestamp_verified: true
  });
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
      const data = await getJson(fetchImpl, 'https://api.binance.com/api/v3/ticker/price?symbol=' + encodeURIComponent(normalizedSymbol));
      return freshQuote({ desk: id, symbol: normalizedSymbol, price: data.price, currency: normalizedSymbol.endsWith('USDT') ? 'USDT' : 'quote_currency_in_symbol', source: 'binance_spot', observedAt: new Date(nowMs).toISOString(), nowMs });
    }
    if (id === 'FOREX') {
      const match = normalizedSymbol.match(/^([A-Z]{3})[-_]?([A-Z]{3})$/);
      if (!match) return quote('unavailable', { reason_code: 'invalid_forex_pair' });
      const [, base, target] = match;
      const data = await getJson(fetchImpl, 'https://api.frankfurter.dev/v1/latest?base=' + base + '&symbols=' + target);
      const rate = data.rates && data.rates[target];
      return freshQuote({ desk: id, symbol: base + '/' + target, price: rate, currency: target, source: 'frankfurter_ecb_reference', observedAt: data.date, nowMs });
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
    return freshQuote({ desk: id, symbol: normalizedSymbol, price: item['05. price'], currency: 'provider_reported', source: 'alphavantage_global_quote', observedAt: item['07. latest trading day'] + 'T23:59:59Z', nowMs });
  } catch (error) {
    return quote('unavailable', {
      desk: id, symbol: normalizedSymbol,
      reason_code: error && error.name === 'AbortError' ? 'provider_timeout' :
        error && error.message === 'invalid_provider_price' ? 'invalid_provider_price' : 'provider_request_failed'
    });
  }
}

module.exports = { getQuote, MAX_AGE_MS, TIMEOUT_MS };

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

function zonedLocalTimestampToIso(value, timeZone) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match || typeof timeZone !== 'string' || !timeZone) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  const targetMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const check = new Date(targetMs);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day ||
      check.getUTCHours() !== hour || check.getUTCMinutes() !== minute || check.getUTCSeconds() !== second) return null;
  let candidate = targetMs;
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  } catch { return null; }
  for (let i = 0; i < 4; i++) {
    const fields = {};
    for (const part of formatter.formatToParts(new Date(candidate))) if (part.type !== 'literal') fields[part.type] = Number(part.value);
    const represented = Date.UTC(fields.year, fields.month - 1, fields.day, fields.hour, fields.minute, fields.second);
    const delta = targetMs - represented;
    if (!delta) break;
    candidate += delta;
  }
  const finalFields = {};
  for (const part of formatter.formatToParts(new Date(candidate))) if (part.type !== 'literal') finalFields[part.type] = Number(part.value);
  if (finalFields.year !== year || finalFields.month !== month || finalFields.day !== day ||
      finalFields.hour !== hour || finalFields.minute !== minute || finalFields.second !== second) return null;
  return new Date(candidate).toISOString();
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
      if (env.ALPHAVANTAGE_API_KEY) {
        const data = await getJson(fetchImpl, 'https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=' + base + '&to_symbol=' + target + '&interval=1min&outputsize=compact&apikey=' + encodeURIComponent(env.ALPHAVANTAGE_API_KEY));
        const metadata = data['Meta Data'];
        const series = data['Time Series FX (1min)'];
        if (!metadata || !series || typeof series !== 'object') return quote('unavailable', { desk: id, symbol: base + '/' + target, source: 'alphavantage_fx_intraday_1min', reason_code: data.Note || data.Information ? 'provider_limit_or_error' : 'provider_quote_missing' });
        const timestamps = Object.keys(series).sort().reverse();
        const latestTimestamp = timestamps[0];
        const row = latestTimestamp ? series[latestTimestamp] : null;
        const observedAt = zonedLocalTimestampToIso(latestTimestamp, metadata['6. Time Zone']);
        if (!row || !observedAt) return quote('unverified', { desk: id, symbol: base + '/' + target, source: 'alphavantage_fx_intraday_1min', reason_code: 'invalid_provider_timestamp_or_timezone' });
        return freshQuote({ desk: id, symbol: base + '/' + target, price: row['4. close'], currency: target, source: 'alphavantage_fx_intraday_1min', observedAt, nowMs });
      }
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
      const marketTime = item.regularMarketTime;
      let observedAt = null;
      if (typeof marketTime === 'number' && Number.isFinite(marketTime)) {
        const milliseconds = marketTime * 1000;
        if (Number.isFinite(milliseconds) && Math.abs(milliseconds) <= 8640000000000000) {
          observedAt = new Date(milliseconds).toISOString();
        }
      } else if (typeof marketTime === 'string') {
        observedAt = safeTimestamp(marketTime);
      }
      return freshQuote({ desk: id, symbol: normalizedSymbol, price: item.regularMarketPrice, currency: 'BRL', source: 'brapi', observedAt, nowMs });
    }
    if (!env.ALPHAVANTAGE_API_KEY) return quote('unavailable', { desk: id, symbol: normalizedSymbol, reason_code: 'international_provider_not_configured' });
    const data = await getJson(fetchImpl, 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + encodeURIComponent(normalizedSymbol) + '&interval=1min&outputsize=compact&apikey=' + encodeURIComponent(env.ALPHAVANTAGE_API_KEY));
    const metadata = data['Meta Data'];
    const series = data['Time Series (1min)'];
    if (!metadata || !series || typeof series !== 'object') return quote('unavailable', { desk: id, symbol: normalizedSymbol, source: 'alphavantage_intraday_1min', reason_code: data.Note || data.Information ? 'provider_limit_or_error' : 'provider_quote_missing' });
    const timestamps = Object.keys(series).sort().reverse();
    const latestTimestamp = timestamps[0];
    const row = latestTimestamp ? series[latestTimestamp] : null;
    const observedAt = zonedLocalTimestampToIso(latestTimestamp, metadata['6. Time Zone']);
    if (!row || !observedAt) return quote('unverified', { desk: id, symbol: normalizedSymbol, source: 'alphavantage_intraday_1min', reason_code: 'invalid_provider_timestamp_or_timezone' });
    return freshQuote({ desk: id, symbol: normalizedSymbol, price: row['4. close'], currency: 'USD', source: 'alphavantage_intraday_1min', observedAt, nowMs });
  } catch (error) {
    const reason = error && error.code === 'PROVIDER_RESPONSE_TOO_LARGE' ? 'provider_response_too_large' : error && error.name === 'AbortError' ? 'provider_timeout' : error && /^provider_http_[0-9]{3}$/.test(error.message) ? error.message : 'provider_request_failed';
    return quote('unavailable', { desk: id, symbol: normalizedSymbol, reason_code: reason });
  }
}
module.exports = { getQuote, MAX_AGE_MS, TIMEOUT_MS, MAX_RESPONSE_BYTES };

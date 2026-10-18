'use strict';

const SOURCE_URL = 'https://api.alternative.me/fng/?limit=1&format=json';
const SOURCE_PAGE = 'https://alternative.me/crypto/fear-and-greed-index/';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 5000;
const MAX_RESPONSE_BYTES = 64 * 1024;

async function getFearGreed(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  if (typeof fetchImpl !== 'function') {
    return unavailable('fetch_unavailable');
  }
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = setTimeout(() => { if (controller) controller.abort(); }, TIMEOUT_MS);
  try {
    const init = { method: 'GET', headers: { accept: 'application/json' }, redirect: 'error' };
    if (controller) init.signal = controller.signal;
    const response = await fetchImpl(SOURCE_URL, init);
    if (!response || response.ok !== true) return unavailable('provider_http_error');
    const declaredLength = Number(response.headers && response.headers.get && response.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) return unavailable('provider_response_too_large');
    let payload;
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
            return unavailable('provider_response_too_large');
          }
          chunks.push(value);
        }
      } finally { try { reader.releaseLock(); } catch {} }
      const merged = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
      payload = JSON.parse(new TextDecoder().decode(merged));
    } else {
      payload = await response.json();
      if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_RESPONSE_BYTES) return unavailable('provider_response_too_large');
    }
    const row = payload && Array.isArray(payload.data) ? payload.data[0] : null;
    const value = row && Number(row.value);
    const observedMs = row && /^\d{9,12}$/.test(String(row.timestamp || ''))
      ? Number(row.timestamp) * 1000 : NaN;
    if (!Number.isInteger(value) || value < 0 || value > 100 ||
        !Number.isFinite(observedMs) || observedMs <= 0) {
      return unavailable('invalid_provider_payload');
    }
    const ageMs = nowMs - observedMs;
    if (ageMs < 0) return unavailable('provider_timestamp_in_future');
    const classification = String(row.value_classification || '').trim();
    return Object.freeze({
      source: 'alternative.me',
      source_url: SOURCE_PAGE,
      status: ageMs <= MAX_AGE_MS ? 'verified' : 'stale',
      value,
      classification: classification || 'not_reported',
      observed_at: new Date(observedMs).toISOString(),
      age_seconds: Math.floor(ageMs / 1000),
      scale: Object.freeze({ min: 0, max: 100 }),
      frequency: 'daily',
      interpretation: 'sentiment_only_not_profit_probability',
      mode: 'paper',
      execution_enabled: false
    });
  } catch (error) {
    return unavailable(controller && controller.signal.aborted ? 'provider_timeout' : 'provider_unreachable');
  } finally {
    clearTimeout(timer);
  }
}

function unavailable(reason) {
  return Object.freeze({
    source: 'alternative.me',
    source_url: SOURCE_PAGE,
    status: 'unavailable',
    reason_code: reason,
    value: null,
    classification: null,
    observed_at: null,
    age_seconds: null,
    scale: Object.freeze({ min: 0, max: 100 }),
    frequency: 'daily',
    interpretation: 'sentiment_only_not_profit_probability',
    mode: 'paper',
    execution_enabled: false
  });
}

module.exports = { getFearGreed, SOURCE_URL, SOURCE_PAGE, MAX_AGE_MS, TIMEOUT_MS, MAX_RESPONSE_BYTES };

'use strict';

const SOURCE_URL = 'https://api.alternative.me/fng/?limit=1&format=json';
const SOURCE_PAGE = 'https://alternative.me/crypto/fear-and-greed-index/';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function getFearGreed(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  if (typeof fetchImpl !== 'function') {
    return unavailable('fetch_unavailable');
  }
  try {
    const response = await fetchImpl(SOURCE_URL, {
      method: 'GET',
      headers: { accept: 'application/json' }
    });
    if (!response || response.ok !== true) return unavailable('provider_http_error');
    const payload = await response.json();
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
  } catch {
    return unavailable('provider_unreachable');
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

module.exports = { getFearGreed, SOURCE_URL, SOURCE_PAGE, MAX_AGE_MS };

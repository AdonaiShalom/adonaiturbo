'use strict';
const assert = require('node:assert/strict');
const { getFearGreed, SOURCE_URL, MAX_AGE_MS, MAX_RESPONSE_BYTES } = require('../../runtime/fear-greed.cjs');
const { createServer } = require('../../runtime/server.cjs');

async function main() {
  const nowMs = Date.parse('2026-10-18T12:00:00.000Z');
  const fetchOk = async (url, options) => {
    assert.equal(url, SOURCE_URL);
    assert.equal(options.method, 'GET');
    return { ok: true, async json() { return { data: [{ value: '63', value_classification: 'Greed', timestamp: String(Math.floor((nowMs - 3600000) / 1000)) }] }; } };
  };
  const fresh = await getFearGreed({ fetchImpl: fetchOk, nowMs });
  assert.equal(fresh.status, 'verified');
  assert.equal(fresh.value, 63);
  assert.equal(fresh.classification, 'Greed');
  assert.equal(fresh.execution_enabled, false);
  assert.equal(fresh.frequency, 'daily');

  const stale = await getFearGreed({ nowMs, fetchImpl: async () => ({ ok: true, async json() { return { data: [{ value: '50', timestamp: String(Math.floor((nowMs - MAX_AGE_MS - 1000) / 1000)) }] }; } }) });
  assert.equal(stale.status, 'stale');
  assert.equal(stale.value, 50);

  const invalid = await getFearGreed({ nowMs, fetchImpl: async () => ({ ok: true, async json() { return { data: [{ value: '101', timestamp: String(Math.floor(nowMs / 1000)) }] }; } }) });
  assert.equal(invalid.status, 'unavailable');
  assert.equal(invalid.value, null);

  const future = await getFearGreed({ nowMs, fetchImpl: async () => ({ ok: true, async json() { return { data: [{ value: '44', timestamp: String(Math.floor((nowMs + 60000) / 1000)) }] }; } }) });
  assert.equal(future.reason_code, 'provider_timestamp_in_future');

  const oversized = await getFearGreed({ nowMs, fetchImpl: async (_url, options) => {
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, headers: { get: (name) => name === 'content-length' ? String(MAX_RESPONSE_BYTES + 1) : null }, async json() { throw new Error('must not parse oversized body'); } };
  } });
  assert.equal(oversized.status, 'unavailable');
  assert.equal(oversized.reason_code, 'provider_response_too_large');

  const oversizedBody = await getFearGreed({ nowMs, fetchImpl: async () => ({ ok: true, async json() { return { data: [{ value: '63', timestamp: String(Math.floor(nowMs / 1000)) }], payload: 'x'.repeat(MAX_RESPONSE_BYTES + 1) }; } }) });
  assert.equal(oversizedBody.status, 'unavailable');
  assert.equal(oversizedBody.reason_code, 'provider_response_too_large');

  const unavailable = await getFearGreed({ nowMs, fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal(unavailable.status, 'unavailable');
  assert.equal(unavailable.execution_enabled, false);

  const server = createServer({ now: () => nowMs, env: {}, auditLedger: null, fetchImpl: fetchOk });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const response = await fetch('http://127.0.0.1:' + port + '/api/v1/sentiment/fear-greed');
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, 'verified');
    assert.equal(body.execution_enabled, false);
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
  console.log('Fear & Greed source adapter and HTTP endpoint: PASS');
}
main().catch(error => { process.stderr.write((error.stack || String(error)) + '\n'); process.exitCode = 1; });

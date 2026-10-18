'use strict';
const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');
async function main() {
  const nowMs = Date.parse('2026-10-17T12:00:00.000Z');
  let persisted = [];
  const auditLedger = {
    async check() { return true; },
    async append(event) {
      persisted.push(event);
      return { persisted: true, event_id: '00000000-0000-4000-8000-000000000001' };
    }
  };
  const server = createServer({ now: () => nowMs, auditLedger });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const health = await fetch(base + '/health');
    assert.equal(health.status, 200);
    assert.equal(health.headers.get('cache-control'), 'no-store');
    assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(health.headers.get('x-frame-options'), 'DENY');
    assert.equal(health.headers.get('content-security-policy'), "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    assert.equal(health.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(health.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()');
    assert.equal((await health.json()).mode, 'paper');
    const ready = await fetch(base + '/ready');
    assert.equal(ready.status, 200);
    assert.equal((await ready.json()).status, 'ready');
    const integrations = await fetch(base + '/api/v1/integrations');
    assert.equal(integrations.status, 200);
    const integrationBody = await integrations.json();
    assert.deepEqual(integrationBody.integrations.map((item) => item.id), ['levi', 'eu_sou']);
    assert.ok(integrationBody.integrations.every((item) => item.status === 'not_verified' && item.execution_enabled === false));
    const markets = await fetch(base + '/api/v1/markets');
    assert.equal(markets.status, 200);
    const marketBody = await markets.json();
    assert.deepEqual(marketBody.desks.map((desk) => desk.id), ['CRYPTO', 'FOREX', 'B3', 'INTERNATIONAL']);
    assert.equal(marketBody.data_status, 'unavailable');
    assert.equal(marketBody.execution_enabled, false);
    assert.equal((await fetch(base + '/does-not-exist')).status, 404);
    const unsupportedType = await fetch(base + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{"envelope":{"mode":"live"}}' });
    assert.equal(unsupportedType.status, 415);
    assert.equal((await unsupportedType.json()).reason_codes[0], 'unsupported_media_type');
    const badJson = await fetch(base + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
    assert.equal(badJson.status, 400);
    const blocked = await fetch(base + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' }, proposal: { mode: 'live' } }) });
    assert.equal(blocked.status, 422);
    const body = await blocked.json();
    assert.equal(body.execution_performed, false);
    assert.equal(body.audit_persisted, true);
    assert.equal(body.decision.decision, 'blocked');
    assert.equal(persisted.length, 1);
    console.log('PASS: runtime HTTP readiness, audit success, 404, malformed JSON, and no-execution policy response');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }

  const unconfigured = createServer({ now: () => nowMs, auditLedger: null });
  await new Promise((resolve) => unconfigured.listen(0, '127.0.0.1', resolve));
  const unconfiguredBase = 'http://127.0.0.1:' + unconfigured.address().port;
  try {
    assert.equal((await fetch(unconfiguredBase + '/ready')).status, 503);
    const response = await fetch(unconfiguredBase + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' } }) });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.audit_persisted, false);
    assert.equal(body.execution_performed, false);
    assert.ok(body.reason_codes.includes('audit_persistence_not_configured'));
    console.log('PASS: runtime blocks readiness and evaluation without a configured audit ledger');
  } finally {
    await new Promise((resolve, reject) => unconfigured.close((error) => error ? reject(error) : resolve()));
  }


  const unconfirmed = createServer({ now: () => nowMs, auditLedger: { async check() { return true; }, async append() { return { persisted: false, event_id: null }; } } });
  await new Promise((resolve) => unconfirmed.listen(0, '127.0.0.1', resolve));
  const unconfirmedBase = 'http://127.0.0.1:' + unconfirmed.address().port;
  try {
    const response = await fetch(unconfirmedBase + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' } }) });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.audit_persisted, false);
    assert.equal(body.execution_performed, false);
    assert.ok(body.reason_codes.includes('audit_persistence_unconfirmed'));
    console.log('PASS: runtime blocks policy response when audit append is not confirmed persisted');
  } finally {
    await new Promise((resolve, reject) => unconfirmed.close((error) => error ? reject(error) : resolve()));
  }

  const policyLimited = createServer({ now: () => nowMs, auditLedger, policyRateLimit: 2 });
  await new Promise((resolve) => policyLimited.listen(0, '127.0.0.1', resolve));
  const policyLimitedBase = 'http://127.0.0.1:' + policyLimited.address().port;
  try {
    const request = () => fetch(policyLimitedBase + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' } }) });
    assert.equal((await request()).status, 422);
    assert.equal((await request()).status, 422);
    const limited = await request();
    assert.equal(limited.status, 429);
    assert.equal((await limited.json()).reason_codes[0], 'policy_rate_limit_exceeded');
    assert.equal(limited.headers.get('retry-after'), '60');
    assert.equal(persisted.length, 3, 'rate-limited request must not write another audit event');
    console.log('PASS: policy evaluation is rate limited before durable audit writes');
  } finally {
    await new Promise((resolve, reject) => policyLimited.close((error) => error ? reject(error) : resolve()));
  }

  const failing = createServer({ now: () => nowMs, auditLedger: { async check() { throw new Error('offline'); }, async append() { throw new Error('offline'); } } });
  await new Promise((resolve) => failing.listen(0, '127.0.0.1', resolve));
  const failedBase = 'http://127.0.0.1:' + failing.address().port;
  try {
    const ready = await fetch(failedBase + '/ready');
    assert.equal(ready.status, 503);
    const response = await fetch(failedBase + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' } }) });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.audit_persisted, false);
    assert.equal(body.execution_performed, false);
    assert.ok(body.reason_codes.includes('audit_persistence_failed'));
    console.log('PASS: runtime fails closed when durable audit is unavailable');
  } finally {
    await new Promise((resolve, reject) => failing.close((error) => error ? reject(error) : resolve()));
  }
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

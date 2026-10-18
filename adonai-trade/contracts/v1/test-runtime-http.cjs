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

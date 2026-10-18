'use strict';
const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');
(async () => {
  const nowMs = Date.parse('2026-10-17T12:00:00.000Z');
  const server = createServer({ now: () => nowMs });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const health = await fetch(base + '/health');
    assert.equal(health.status, 200);
    assert.equal((await health.json()).mode, 'paper');
    const ready = await fetch(base + '/ready');
    assert.equal(ready.status, 503);
    assert.ok((await ready.json()).reason_codes.includes('audit_persistence_not_configured'));
    assert.equal((await fetch(base + '/does-not-exist')).status, 404);
    const badJson = await fetch(base + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
    assert.equal(badJson.status, 400);
    const blocked = await fetch(base + '/api/v1/policy/evaluate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ envelope: { mode: 'live' }, proposal: { mode: 'live' } }) });
    assert.equal(blocked.status, 422);
    const body = await blocked.json();
    assert.equal(body.execution_performed, false);
    assert.equal(body.audit_persisted, false);
    assert.equal(body.decision.decision, 'blocked');
    console.log('PASS: runtime HTTP health, fail-closed readiness, 404, malformed JSON, and no-execution policy response');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
})().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

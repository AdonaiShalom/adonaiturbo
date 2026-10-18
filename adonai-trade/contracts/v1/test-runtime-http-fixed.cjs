'use strict';
const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');

async function listen(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return 'http://127.0.0.1:' + server.address().port;
}
async function close(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
async function main() {
  const nowMs = Date.parse('2026-10-17T12:00:00.000Z');
  const persisted = [];
  const auditLedger = {
    async check() { return true; },
    async append(event) {
      persisted.push(event);
      return { persisted: true, event_id: '00000000-0000-4000-8000-000000000001' };
    }
  };
  const server = createServer({ now: () => nowMs, auditLedger });
  const base = await listen(server);
  try {
    assert.equal((await fetch(base + '/health')).status, 200);
    assert.equal((await (await fetch(base + '/ready')).json()).status, 'ready');
    assert.equal((await fetch(base + '/does-not-exist')).status, 404);

    const badJson = await fetch(base + '/api/v1/policy/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{'
    });
    assert.equal(badJson.status, 400);

    const oversized = await fetch(base + '/api/v1/policy/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: 'x'.repeat(70 * 1024)
    });
    assert.equal(oversized.status, 413);
    assert.deepEqual((await oversized.json()).reason_codes, ['request_too_large']);
    assert.equal((await fetch(base + '/health')).status, 200, 'server remains usable after oversized body');

    const blocked = await fetch(base + '/api/v1/policy/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ envelope: { mode: 'live' }, proposal: { mode: 'live' } })
    });
    assert.equal(blocked.status, 422);
    const blockedBody = await blocked.json();
    assert.equal(blockedBody.execution_performed, false);
    assert.equal(blockedBody.audit_persisted, true);
    assert.equal(blockedBody.decision.decision, 'blocked');
    assert.equal(persisted.length, 1);
    console.log('PASS: HTTP readiness, malformed/oversized body handling, server recovery, audit success, and no-execution policy');
  } finally {
    await close(server);
  }

  const unconfigured = createServer({ now: () => nowMs, auditLedger: null });
  const unconfiguredBase = await listen(unconfigured);
  try {
    assert.equal((await fetch(unconfiguredBase + '/ready')).status, 503);
    const response = await fetch(unconfiguredBase + '/api/v1/policy/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ envelope: { mode: 'live' } })
    });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.audit_persisted, false);
    assert.equal(body.execution_performed, false);
    assert.ok(body.reason_codes.includes('audit_persistence_not_configured'));
    console.log('PASS: runtime blocks readiness and evaluation without audit ledger');
  } finally {
    await close(unconfigured);
  }

  const failing = createServer({
    now: () => nowMs,
    auditLedger: { async check() { throw new Error('offline'); }, async append() { throw new Error('offline'); } }
  });
  const failingBase = await listen(failing);
  try {
    assert.equal((await fetch(failingBase + '/ready')).status, 503);
    const response = await fetch(failingBase + '/api/v1/policy/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ envelope: { mode: 'live' } })
    });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.audit_persisted, false);
    assert.equal(body.execution_performed, false);
    assert.ok(body.reason_codes.includes('audit_persistence_failed'));
    console.log('PASS: runtime fails closed when durable audit is unavailable');
  } finally {
    await close(failing);
  }
}
main().catch((error) => { process.stderr.write(String(error.stack || error) + '\n'); process.exitCode = 1; });

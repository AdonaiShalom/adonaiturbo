'use strict';
const assert = require('node:assert/strict');
const { start } = require('../../public/runtime-bridge-client.js');
async function main() {
  const states = [];
  const errors = [];
  const bridge = { readState: async ({ baseUrl }) => ({ mode: 'paper', executionEnabled: false, baseUrl }) };
  const client = start({ bridge, baseUrl: '/runtime', intervalMs: 1000, onState: s => states.push(s), onError: e => errors.push(e) });
  for (let i = 0; i < 20 && states.length === 0; i++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(states.length, 1);
  assert.equal(states[0].mode, 'paper');
  assert.equal(states[0].executionEnabled, false);
  assert.equal(states[0].baseUrl, '/runtime');
  client.stop();
  await assert.rejects(async () => start({ bridge, intervalMs: 999 }), /invalid_poll_interval/);
  const failed = start({ bridge: { readState: async () => { throw new Error('offline'); } }, intervalMs: 1000, onError: e => errors.push(e) });
  for (let i = 0; i < 20 && errors.length === 0; i++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(errors[0].message, 'offline');
  failed.stop();
  console.log('3D runtime polling client: PASS (callbacks, error path, stop, paper mode)');
}
main().catch(e => { console.error(e); process.exitCode = 1; });

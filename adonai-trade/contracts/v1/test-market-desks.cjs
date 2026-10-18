'use strict';
const assert = require('node:assert/strict');
const { listMarketDesks } = require('../../runtime/market-desks.cjs');

const result = listMarketDesks();
assert.equal(result.mode, 'paper');
assert.equal(result.execution_enabled, false);
assert.equal(result.data_status, 'unavailable');
assert.deepEqual(result.desks.map((desk) => desk.id), ['CRYPTO', 'FOREX', 'B3', 'INTERNATIONAL']);
for (const desk of result.desks) {
  assert.equal(desk.provider_configured, false);
  assert.equal(desk.quote_status, 'unavailable');
  assert.equal(desk.execution_enabled, false);
  assert.equal(desk.data_mode, 'historical_or_fixture_only');
}
console.log('PASS: four market desks are discoverable and never misrepresented as live-connected');

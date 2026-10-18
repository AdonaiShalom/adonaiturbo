'use strict';
const assert = require('node:assert/strict');
const { listMarketDesks } = require('../../runtime/market-desks.cjs');

const result = listMarketDesks();
assert.equal(result.mode, 'paper');
assert.equal(result.execution_enabled, false);
assert.equal(result.data_status, 'partially_configured');
assert.deepEqual(result.desks.map((desk) => desk.id), ['CRYPTO', 'FOREX', 'B3', 'INTERNATIONAL']);
for (const desk of result.desks) {
  assert.equal(desk.quote_status, 'not_checked');
  assert.equal(desk.execution_enabled, false);
}
assert.equal(result.desks.find((desk) => desk.id === 'CRYPTO').provider_configured, true);
assert.equal(result.desks.find((desk) => desk.id === 'FOREX').provider_configured, true);
assert.equal(result.desks.find((desk) => desk.id === 'B3').provider_configured, false);
assert.equal(result.desks.find((desk) => desk.id === 'INTERNATIONAL').provider_configured, false);
assert.equal(result.desks.find((desk) => desk.id === 'FOREX').data_mode, 'daily_reference_not_intraday');
assert.equal(result.desks.find((desk) => desk.id === 'INTERNATIONAL').data_mode, 'intraday_1min_timestamp_checked');
const configured = listMarketDesks({ BRAPI_TOKEN: 'configured-test-token', ALPHAVANTAGE_API_KEY: 'configured-test-key' });
assert.equal(configured.data_status, 'providers_configured');
assert.equal(configured.desks.find((desk) => desk.id === 'CRYPTO').provider_configured, true);
assert.equal(configured.desks.find((desk) => desk.id === 'FOREX').provider_configured, true);
assert.equal(configured.desks.find((desk) => desk.id === 'B3').provider_configured, true);
assert.equal(configured.desks.find((desk) => desk.id === 'INTERNATIONAL').provider_configured, true);
assert.equal(configured.desks.find((desk) => desk.id === 'FOREX').data_mode, 'daily_reference_not_intraday');
assert.equal(configured.desks.find((desk) => desk.id === 'INTERNATIONAL').data_mode, 'intraday_1min_timestamp_checked');
assert.equal(configured.execution_enabled, false);
const partial = listMarketDesks({ BRAPI_TOKEN: 'configured-test-token' });
assert.equal(partial.data_status, 'partially_configured');
assert.equal(partial.desks.find((desk) => desk.id === 'INTERNATIONAL').provider_configured, false);
console.log('PASS: four market desks are discoverable and never misrepresented as live-connected');

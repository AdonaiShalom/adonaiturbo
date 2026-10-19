'use strict';
const assert = require('node:assert/strict');
const { listIntegrationStatus, safeEndpoint } = require('../../runtime/integration-status.cjs');

const defaults = listIntegrationStatus({});
assert.equal(defaults.mode, 'paper');
assert.equal(defaults.status_semantics, 'configuration_only_not_connectivity_proof');
assert.deepEqual(defaults.integrations.map((item) => item.id), ['levi', 'eu_sou']);
for (const item of defaults.integrations) {
  assert.equal(item.configured, false);
  assert.equal(item.status, 'not_verified');
  assert.equal(item.authenticated, false);
  assert.equal(item.execution_enabled, false);
}
const configured = listIntegrationStatus({
  LEVI_ENDPOINT: 'https://levi.example.test/api/orquestrar',
  EU_SOU_ENDPOINT: 'https://science.example.test/api/calcular'
});
assert.equal(configured.integrations[0].configured, true);
assert.equal(configured.integrations[0].endpoint, 'https://levi.example.test/api/orquestrar');
assert.equal(configured.integrations[0].status, 'not_verified');
assert.equal(safeEndpoint('https://user:secret@example.test/api?token=secret'), null);
assert.equal(safeEndpoint('file:///etc/passwd'), null);
assert.equal(safeEndpoint('http://remote.example.test/api'), null, 'remote HTTP integration endpoint must be rejected');
assert.equal(safeEndpoint('http://127.0.0.1:3000/api/levi/orquestrar'), 'http://127.0.0.1:3000/api/levi/orquestrar', 'local HTTP is permitted for development');
assert.equal(safeEndpoint('https://remote.example.test/api'), 'https://remote.example.test/api', 'remote HTTPS is permitted');
assert.equal(safeEndpoint('not-a-url'), null);
console.log('PASS: LEVI/EU SOU status never implies connectivity or authentication');

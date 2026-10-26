'use strict';
const assert = require('node:assert/strict');
const { evaluateBatch, MAX_BATCH } = require('../../runtime/crypto-opportunity-funnel.cjs');

const nowMs = Date.parse('2026-10-26T12:00:00.000Z');
function item(overrides = {}) {
  return {
    instrument: 'BTCUSDT', side: 'LONG', provider: 'test-fixture',
    observed_at: new Date(nowMs - 1000).toISOString(),
    strategy_version: 'baseline-v1', price: 67000, volume: 1000000,
    spread_bps: 2, volatility_pct: 1, expected_return_pct: 2,
    contract_verified: true, ...overrides
  };
}
const duplicate = item();
const result = evaluateBatch([item(), item({instrument:'ETHUSDT', side:'SHORT', expected_return_pct:1}), duplicate, item({instrument:'DOGEUSDT', contract_verified:false}), item({instrument:'SOLUSDT', observed_at:'2026-10-25T00:00:00.000Z'})], {nowMs});
assert.equal(result.execution_enabled, false);
assert.equal(result.requested_count, 5);
assert.equal(result.valid_distinct_evaluations, 2);
assert.equal(result.excluded_count, 3);
assert.equal(result.records[2].reason_code, 'duplicate_evaluation');
assert.equal(result.records[3].reason_code, 'demo_contract_not_verified');
assert.equal(result.records[4].reason_code, 'data_stale');
assert.ok(result.finalists.every(x => x.metrics.baseline_score_pct > 0));
assert.throws(() => evaluateBatch(Array(MAX_BATCH + 1).fill(item()), {nowMs}), /batch_limit_exceeded/);
assert.equal(evaluateBatch([], {nowMs}).valid_distinct_evaluations, 0);
console.log('PASS: crypto funnel rejects duplicates/stale/unverified contracts and never enables execution');

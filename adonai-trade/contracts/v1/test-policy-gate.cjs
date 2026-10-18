'use strict';

const assert = require('node:assert/strict');
const { validateEnvelope, evaluatePolicy } = require('../../runtime/policy-gate.cjs');

const nowMs = Date.parse('2026-10-17T12:00:00.000Z');
const envelope = {
  schema_version: '1.0.0',
  correlation_id: '123e4567-e89b-42d3-a456-426614174000',
  task_id: '123e4567-e89b-42d3-a456-426614174001',
  requested_by: 'levi',
  market: 'B3',
  task_type: 'paper_order_proposal',
  mode: 'paper',
  created_at: '2026-10-17T11:59:00.000Z',
  expires_at: '2026-10-17T12:05:00.000Z',
  payload: { instrument: 'PETR4' },
  data_context: {
    provider: 'fixture',
    observed_at: '2026-10-17T11:59:30.000Z',
    license_reference: 'test-fixture',
    data_quality: 'verified'
  }
};
const proposal = { mode: 'paper', action: 'paper_order_proposal' };
const approvedRisk = {
  status: 'approved',
  independent: true,
  checks: [
    { name: 'exposure_limit', status: 'pass' },
    { name: 'drawdown_limit', status: 'pass' }
  ]
};

assert.deepEqual(validateEnvelope(envelope), []);
assert.equal(evaluatePolicy({ envelope, proposal, risk: approvedRisk }, { nowMs }).decision, 'proposal_only');

const liveMode = evaluatePolicy({ envelope, proposal: { ...proposal, mode: 'live' }, risk: approvedRisk }, { nowMs });
assert.equal(liveMode.decision, 'blocked');
assert.ok(liveMode.reason_codes.includes('paper_mode_required'));

const staleEnvelope = { ...envelope, data_context: { ...envelope.data_context, observed_at: '2026-10-17T11:00:00.000Z' } };
const stale = evaluatePolicy({ envelope: staleEnvelope, proposal, risk: approvedRisk }, { nowMs, maxDataAgeMs: 60_000 });
assert.equal(stale.decision, 'blocked');
assert.ok(stale.reason_codes.includes('market_data_stale_or_future_dated'));

const noProvenance = { ...envelope, data_context: { data_quality: 'unknown' } };
const noData = evaluatePolicy({ envelope: noProvenance, proposal, risk: approvedRisk }, { nowMs });
assert.equal(noData.decision, 'blocked');
assert.ok(noData.reason_codes.includes('data_provenance_not_verified'));

const riskVeto = evaluatePolicy({
  envelope, proposal,
  risk: { status: 'blocked', independent: true, checks: [{ name: 'drawdown_limit', status: 'fail' }] }
}, { nowMs });
assert.equal(riskVeto.decision, 'blocked');
assert.ok(riskVeto.reason_codes.includes('independent_risk_gate_not_approved'));

const nonIndependentRisk = evaluatePolicy({
  envelope, proposal,
  risk: { status: 'approved', independent: false, checks: [{ name: 'exposure_limit', status: 'pass' }] }
}, { nowMs });
assert.equal(nonIndependentRisk.decision, 'blocked');

const expired = evaluatePolicy({
  envelope: { ...envelope, expires_at: '2026-10-17T11:59:59.000Z' }, proposal, risk: approvedRisk
}, { nowMs });
assert.equal(expired.decision, 'blocked');
assert.ok(expired.reason_codes.includes('task_expired'));

const analysisOnly = evaluatePolicy({
  envelope, proposal: { mode: 'paper', action: 'analysis_only' }
}, { nowMs });
assert.equal(analysisOnly.decision, 'no_order');

const malformed = evaluatePolicy({ envelope: { ...envelope, market: 'UNKNOWN' }, proposal, risk: approvedRisk }, { nowMs });
assert.equal(malformed.decision, 'blocked');
assert.ok(malformed.reason_codes.includes('unsupported_market'));


const futureCreated = evaluatePolicy({
  envelope: { ...envelope, created_at: '2026-10-17T12:00:01.000Z' }, proposal, risk: approvedRisk
}, { nowMs });
assert.equal(futureCreated.decision, 'blocked');
assert.ok(futureCreated.reason_codes.includes('task_created_in_future'));

const missingExpiry = { ...envelope };
delete missingExpiry.expires_at;
assert.ok(validateEnvelope(missingExpiry).includes('missing_field:expires_at'));

const missingProvider = { ...envelope, data_context: { ...envelope.data_context, provider: '   ' } };
const noProvider = evaluatePolicy({ envelope: missingProvider, proposal, risk: approvedRisk }, { nowMs });
assert.equal(noProvider.decision, 'blocked');
assert.ok(noProvider.reason_codes.includes('data_provenance_not_verified'));

console.log('PASS: deterministic policy gate — approved proposal, live-mode rejection, stale/missing data, risk veto, non-independent risk, expiry/future timestamps, analysis-only and invalid market');

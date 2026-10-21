'use strict';

const assert = require('node:assert/strict');
const { STAGES } = require('../../runtime/decision-trace.cjs');
const { verifyAttestedDecisionTrace, signEvent, SECRET_BY_STAGE } = require('../../runtime/decision-attestation.cjs');

const correlationId = '123e4567-e89b-42d3-a456-426614174000';
const events = STAGES.map((stage, i) => ({
  stage,
  correlation_id: correlationId,
  actor: ['eu-sou', 'levi', 'rh-supervisor', 'mesa-b3', 'risk-engine', 'audit-ledger', 'evaluator'][i],
  at: '2026-10-20T12:00:00.000Z',
  evidence_refs: ['fixture://evidence/' + i],
  execution_enabled: false
}));
events[0].scientific_context = {
  method: 'análise estatística fixture',
  baseline: 'baseline clássica',
  uncertainty: 'fixture não experimental',
  evidence: { source: 'paper', metadata: { author: 'fixture', year: 2026 } }
};
events[1].destination = 'B3';
events[2].authorization = 'approved';
events[2].role_key = 'desk_supervisor';
events[2].approval_ref = 'fixture://rh/approval/1';
events[3].market = 'B3';
events[3].decision = 'proposal_only';
events[4].status = 'approved';
events[4].independent = true;
events[4].checks = [{ name: 'exposure_limit', status: 'pass' }];
events[5].persisted = true;
events[5].event_id = 'fixture-audit-event-1';
events[6].outcome_ref = 'fixture://outcome/1';
events[6].benchmark = 'baseline clássica';
events[6].metrics_ref = 'fixture://metrics/1';

const env = {};
for (const stage of STAGES) env[SECRET_BY_STAGE[stage]] = 'test-only-secret-for-' + stage + '-must-be-over-32-bytes';
for (const event of events) event.signature = signEvent(event, env[SECRET_BY_STAGE[event.stage]]);
const trace = { mode: 'paper', execution_enabled: false, correlation_id: correlationId, market: 'B3', events };

assert.deepEqual(verifyAttestedDecisionTrace(trace, env), { valid: true, authenticated: true, errors: [] });

const tamperedNested = structuredClone(trace);
tamperedNested.events[0].scientific_context.evidence.metadata.year = 2025;
assert.ok(verifyAttestedDecisionTrace(tamperedNested, env).errors.includes('attestation_signature_invalid:EU_SOU_RESEARCHED'));

const tamperedSignature = structuredClone(trace);
tamperedSignature.events[2].signature = '0'.repeat(64);
assert.ok(verifyAttestedDecisionTrace(tamperedSignature, env).errors.includes('attestation_signature_invalid:RH_AUTHORIZED'));

const missingSecret = { ...env };
delete missingSecret[SECRET_BY_STAGE.EVALUATED];
const unconfigured = verifyAttestedDecisionTrace(trace, missingSecret);
assert.equal(unconfigured.authenticated, false);
assert.ok(unconfigured.errors.includes('attestation_secret_not_configured:EVALUATED'));

const wrongSecret = { ...env, [SECRET_BY_STAGE.LEVI_ORCHESTRATED]: 'another-valid-secret-that-is-longer-than-32-bytes' };
assert.ok(verifyAttestedDecisionTrace(trace, wrongSecret).errors.includes('attestation_signature_invalid:LEVI_ORCHESTRATED'));

const structural = structuredClone(trace);
structural.events[3].execution_enabled = true;
assert.ok(verifyAttestedDecisionTrace(structural, env).errors.includes('execution_must_remain_disabled:3'));

console.log('PASS: stage-specific HMAC attestations, nested payload integrity, missing/wrong secrets, and fail-closed behavior.');

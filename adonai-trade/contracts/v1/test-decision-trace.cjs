'use strict';

const assert = require('node:assert/strict');
const { validateDecisionTrace, STAGES } = require('../../runtime/decision-trace.cjs');

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
  uncertainty: 'fixture não experimental'
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

const good = { mode: 'paper', execution_enabled: false, correlation_id: correlationId, market: 'B3', events };
assert.deepEqual(validateDecisionTrace(good), { valid: true, errors: [] });

const mismatch = structuredClone(good);
mismatch.events[1].correlation_id = '123e4567-e89b-42d3-a456-426614174099';
assert.ok(validateDecisionTrace(mismatch).errors.includes('correlation_id_mismatch:1'));

const badOrder = structuredClone(good);
[badOrder.events[1], badOrder.events[2]] = [badOrder.events[2], badOrder.events[1]];
assert.ok(validateDecisionTrace(badOrder).errors.includes('invalid_stage_order:1'));

const noRhApproval = structuredClone(good);
noRhApproval.events[2].authorization = 'pending';
assert.ok(validateDecisionTrace(noRhApproval).errors.includes('rh_hierarchy_or_authorization_missing'));

const riskVeto = structuredClone(good);
riskVeto.events[4].checks[0].status = 'fail';
assert.ok(validateDecisionTrace(riskVeto).errors.includes('independent_risk_gate_not_approved'));

const noAudit = structuredClone(good);
noAudit.events[5].persisted = false;
assert.ok(validateDecisionTrace(noAudit).errors.includes('audit_persistence_unconfirmed'));

const live = structuredClone(good);
live.mode = 'live';
assert.ok(validateDecisionTrace(live).errors.includes('paper_mode_required'));

const missingScience = structuredClone(good);
missingScience.events[0].scientific_context.baseline = '';
assert.ok(validateDecisionTrace(missingScience).errors.includes('eu_sou_scientific_context_incomplete'));

const wrongDesk = structuredClone(good);
wrongDesk.events[1].destination = 'CRYPTO';
assert.ok(validateDecisionTrace(wrongDesk).errors.includes('levi_destination_market_mismatch'));

const noEvaluation = structuredClone(good);
noEvaluation.events[6].benchmark = '';
assert.ok(validateDecisionTrace(noEvaluation).errors.includes('evaluation_or_benchmark_missing'));

console.log('PASS: correlated decision trace enforces EU SOU, LEVI, RH, desk, independent risk, paper audit, and evaluation.');

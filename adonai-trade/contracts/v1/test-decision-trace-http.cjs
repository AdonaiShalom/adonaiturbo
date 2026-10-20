'use strict';

const assert = require('node:assert/strict');
const { createServer } = require('../../runtime/server.cjs');
const { STAGES } = require('../../runtime/decision-trace.cjs');
const { signEvent, SECRET_BY_STAGE } = require('../../runtime/decision-attestation.cjs');

async function main() {
  const correlationId = '123e4567-e89b-42d3-a456-426614174000';
  const events = STAGES.map((stage, i) => ({
    stage, correlation_id: correlationId,
    actor: ['eu-sou','levi','rh-supervisor','mesa-b3','risk-engine','audit-ledger','evaluator'][i],
    at: '2026-10-20T12:00:00.000Z',
    evidence_refs: ['fixture://evidence/' + i],
    execution_enabled: false
  }));
  events[0].scientific_context = { method: 'estatística de teste', baseline: 'baseline clássica', uncertainty: 'fixture sintética' };
  events[1].destination = 'B3';
  events[2].authorization = 'approved'; events[2].role_key = 'desk_supervisor'; events[2].approval_ref = 'fixture://rh/1';
  events[3].market = 'B3'; events[3].decision = 'proposal_only';
  events[4].status = 'approved'; events[4].independent = true; events[4].checks = [{name:'limite',status:'pass'}];
  events[5].persisted = true; events[5].event_id = 'fixture-audit';
  events[6].outcome_ref = 'fixture://outcome'; events[6].benchmark = 'baseline clássica'; events[6].metrics_ref = 'fixture://metrics';
  const env = {};
  for (const stage of STAGES) env[SECRET_BY_STAGE[stage]] = 'test-only-secret-for-' + stage + '-long-enough-for-hmac';
  for (const event of events) event.signature = signEvent(event, env[SECRET_BY_STAGE[event.stage]]);
  const trace = { mode:'paper', execution_enabled:false, correlation_id:correlationId, market:'B3', events };

  const server = createServer({ env, auditLedger: null });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const valid = await fetch(base + '/api/v1/decision-trace/verify', {
      method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(trace)
    });
    assert.equal(valid.status, 200);
    const validBody = await valid.json();
    assert.equal(validBody.authenticated, true);
    assert.equal(validBody.execution_enabled, false);
    assert.equal(validBody.order_execution_performed, false);

    const tampered = structuredClone(trace);
    tampered.events[0].scientific_context.baseline = 'baseline alterada';
    const rejected = await fetch(base + '/api/v1/decision-trace/verify', {
      method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(tampered)
    });
    assert.equal(rejected.status, 422);
    assert.ok((await rejected.json()).reason_codes.includes('attestation_signature_invalid:EU_SOU_RESEARCHED'));

    const unconfigured = createServer({ env: {}, auditLedger: null });
    await new Promise(resolve => unconfigured.listen(0, '127.0.0.1', resolve));
    try {
      const response = await fetch('http://127.0.0.1:' + unconfigured.address().port + '/api/v1/decision-trace/verify', {
        method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(trace)
      });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).execution_enabled, false);
    } finally { await new Promise(resolve => unconfigured.close(resolve)); }

    const wrongType = await fetch(base + '/api/v1/decision-trace/verify', { method:'POST', headers:{'content-type':'text/plain'}, body:'{}' });
    assert.equal(wrongType.status, 415);
    console.log('PASS: HTTP decision-trace verification authenticates signed evidence and fails closed without secrets.');
  } finally { await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

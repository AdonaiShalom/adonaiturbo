'use strict';

const DESKS = new Set(['CRYPTO', 'FOREX', 'B3', 'INTERNATIONAL']);
const STAGES = Object.freeze([
  'EU_SOU_RESEARCHED',
  'LEVI_ORCHESTRATED',
  'RH_AUTHORIZED',
  'DESK_REVIEWED',
  'RISK_APPROVED',
  'PAPER_RECORDED',
  'EVALUATED'
]);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateDecisionTrace(trace) {
  const errors = [];
  if (!isRecord(trace)) return { valid: false, errors: ['trace_must_be_object'] };
  if (trace.mode !== 'paper') errors.push('paper_mode_required');
  if (trace.execution_enabled !== false) errors.push('execution_must_remain_disabled');
  if (typeof trace.correlation_id !== 'string' || !trace.correlation_id.trim()) errors.push('correlation_id_required');
  if (!DESKS.has(trace.market)) errors.push('unsupported_market_desk');
  if (!Array.isArray(trace.events) || trace.events.length !== STAGES.length) {
    errors.push('trace_must_contain_exact_stage_sequence');
    return { valid: false, errors };
  }

  const parsedTimes = [];
  const eventIds = new Set();
  for (let i = 0; i < STAGES.length; i++) {
    const event = trace.events[i];
    if (!isRecord(event)) {
      errors.push('event_must_be_object:' + i);
      continue;
    }
    if (event.stage !== STAGES[i]) errors.push('invalid_stage_order:' + i);
    if (event.correlation_id !== trace.correlation_id) errors.push('correlation_id_mismatch:' + i);
    if (typeof event.actor !== 'string' || !event.actor.trim()) errors.push('actor_required:' + i);
    if (typeof event.at !== 'string' || !Number.isFinite(Date.parse(event.at)) || !/^\d{4}-\d{2}-\d{2}T/.test(event.at)) {
      errors.push('timestamp_invalid:' + i);
      parsedTimes.push(null);
    } else {
      const parsed = Date.parse(event.at);
      parsedTimes.push(parsed);
      if (i > 0 && parsedTimes[i - 1] !== null && parsed < parsedTimes[i - 1]) errors.push('timestamp_order_invalid:' + i);
    }
    if (event.event_id !== undefined) {
      if (typeof event.event_id !== 'string' || !event.event_id.trim()) errors.push('event_id_invalid:' + i);
      else if (eventIds.has(event.event_id)) errors.push('duplicate_event_id:' + i);
      else eventIds.add(event.event_id);
    }
    if (!Array.isArray(event.evidence_refs) || event.evidence_refs.length === 0 ||
        event.evidence_refs.some(ref => typeof ref !== 'string' || !ref.trim())) {
      errors.push('evidence_required:' + i);
    }
    if (event.execution_enabled !== false) errors.push('execution_must_remain_disabled:' + i);
  }

  const eu = trace.events[0];
  if (isRecord(eu) && (!isRecord(eu.scientific_context) ||
      typeof eu.scientific_context.method !== 'string' || !eu.scientific_context.method.trim() ||
      typeof eu.scientific_context.baseline !== 'string' || !eu.scientific_context.baseline.trim() ||
      typeof eu.scientific_context.uncertainty !== 'string' || !eu.scientific_context.uncertainty.trim())) {
    errors.push('eu_sou_scientific_context_incomplete');
  }
  const levi = trace.events[1];
  if (isRecord(levi) && levi.destination !== trace.market) errors.push('levi_destination_market_mismatch');
  const rh = trace.events[2];
  if (isRecord(rh) && (rh.authorization !== 'approved' ||
      typeof rh.role_key !== 'string' || !rh.role_key.trim() ||
      typeof rh.approval_ref !== 'string' || !rh.approval_ref.trim())) {
    errors.push('rh_hierarchy_or_authorization_missing');
  }
  const desk = trace.events[3];
  if (isRecord(desk) && (desk.market !== trace.market || desk.decision !== 'proposal_only')) {
    errors.push('desk_mismatch_or_no_paper_proposal');
  }
  const risk = trace.events[4];
  if (isRecord(risk) && (risk.status !== 'approved' || risk.independent !== true ||
      !Array.isArray(risk.checks) || risk.checks.length === 0 ||
      risk.checks.some(check => !isRecord(check) || check.status !== 'pass' ||
        typeof check.name !== 'string' || !check.name.trim()))) {
    errors.push('independent_risk_gate_not_approved');
  }
  const audit = trace.events[5];
  if (isRecord(audit) && (audit.persisted !== true || typeof audit.event_id !== 'string' || !audit.event_id.trim())) {
    errors.push('audit_persistence_unconfirmed');
  }
  const evaluated = trace.events[6];
  if (isRecord(evaluated) && (typeof evaluated.outcome_ref !== 'string' || !evaluated.outcome_ref.trim() ||
      typeof evaluated.benchmark !== 'string' || !evaluated.benchmark.trim() ||
      typeof evaluated.metrics_ref !== 'string' || !evaluated.metrics_ref.trim())) {
    errors.push('evaluation_or_benchmark_missing');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateDecisionTrace, STAGES };

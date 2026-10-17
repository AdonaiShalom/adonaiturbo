'use strict';

const MARKETS = new Set(['B3', 'INTERNATIONAL', 'CRYPTO', 'FOREX']);
const TASK_TYPES = new Set([
  'market_research',
  'analyze_instrument',
  'paper_order_proposal',
  'portfolio_risk_check',
  'news_digest',
  'health_check'
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATA_QUALITIES = new Set(['verified', 'partial', 'stale', 'invalid', 'unknown']);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateEnvelope(envelope) {
  const errors = [];
  if (!isRecord(envelope)) return ['envelope_must_be_object'];

  const allowed = new Set([
    'schema_version', 'correlation_id', 'task_id', 'requested_by', 'market',
    'task_type', 'mode', 'created_at', 'expires_at', 'payload',
    'data_context', 'scientific_context'
  ]);
  for (const key of Object.keys(envelope)) {
    if (!allowed.has(key)) errors.push('unknown_field:' + key);
  }

  const required = [
    'schema_version', 'correlation_id', 'task_id', 'requested_by',
    'market', 'task_type', 'mode', 'created_at', 'payload'
  ];
  for (const key of required) {
    if (!Object.hasOwn(envelope, key)) errors.push('missing_field:' + key);
  }

  if (envelope.schema_version !== '1.0.0') errors.push('unsupported_schema_version');
  if (typeof envelope.correlation_id !== 'string' || !UUID.test(envelope.correlation_id)) errors.push('invalid_correlation_id');
  if (typeof envelope.task_id !== 'string' || !UUID.test(envelope.task_id)) errors.push('invalid_task_id');
  if (typeof envelope.requested_by !== 'string' || !envelope.requested_by.trim() || envelope.requested_by.length > 128) errors.push('invalid_requested_by');
  if (!MARKETS.has(envelope.market)) errors.push('unsupported_market');
  if (!TASK_TYPES.has(envelope.task_type)) errors.push('unsupported_task_type');
  if (envelope.mode !== 'paper') errors.push('paper_mode_required');
  if (typeof envelope.created_at !== 'string' || !Number.isFinite(Date.parse(envelope.created_at))) errors.push('invalid_created_at');
  if (envelope.expires_at !== undefined && (typeof envelope.expires_at !== 'string' || !Number.isFinite(Date.parse(envelope.expires_at)))) errors.push('invalid_expires_at');
  if (!isRecord(envelope.payload)) errors.push('payload_must_be_object');

  if (envelope.data_context !== undefined) {
    const context = envelope.data_context;
    if (!isRecord(context)) errors.push('data_context_must_be_object');
    else {
      const allowedContext = new Set(['provider', 'observed_at', 'license_reference', 'data_quality']);
      for (const key of Object.keys(context)) if (!allowedContext.has(key)) errors.push('unknown_data_context_field:' + key);
      if (context.data_quality !== undefined && !DATA_QUALITIES.has(context.data_quality)) errors.push('invalid_data_quality');
      if (context.observed_at !== undefined && (typeof context.observed_at !== 'string' || !Number.isFinite(Date.parse(context.observed_at)))) errors.push('invalid_observed_at');
    }
  }

  if (envelope.scientific_context !== undefined) {
    const context = envelope.scientific_context;
    if (!isRecord(context)) errors.push('scientific_context_must_be_object');
    else {
      const allowedContext = new Set(['method', 'baseline', 'uncertainty', 'evidence_refs']);
      for (const key of Object.keys(context)) if (!allowedContext.has(key)) errors.push('unknown_scientific_context_field:' + key);
      if (context.evidence_refs !== undefined &&
          (!Array.isArray(context.evidence_refs) || context.evidence_refs.length > 30 ||
           context.evidence_refs.some((ref) => typeof ref !== 'string' || ref.length > 512))) {
        errors.push('invalid_evidence_refs');
      }
    }
  }
  return errors;
}

/**
 * Deterministic fail-closed gate. This function never places or transmits an order.
 * It only returns a policy decision suitable for logging/review.
 */
function evaluatePolicy(input, options = {}) {
  const nowMs = options.nowMs === undefined ? Date.now() : options.nowMs;
  const maxDataAgeMs = options.maxDataAgeMs === undefined ? 60_000 : options.maxDataAgeMs;
  const envelopeErrors = validateEnvelope(input && input.envelope);
  if (envelopeErrors.length) {
    return { status: 'blocked', decision: 'blocked', reason_codes: envelopeErrors };
  }

  const envelope = input.envelope;
  if (envelope.expires_at && Date.parse(envelope.expires_at) <= nowMs) {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['task_expired'] };
  }

  const context = envelope.data_context;
  if (!context || context.data_quality !== 'verified' || !context.observed_at) {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['data_provenance_not_verified'] };
  }
  const ageMs = nowMs - Date.parse(context.observed_at);
  if (ageMs < 0 || ageMs > maxDataAgeMs) {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['market_data_stale_or_future_dated'] };
  }

  const proposal = input.proposal;
  if (!isRecord(proposal)) {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['proposal_missing_or_invalid'] };
  }
  if (proposal.mode !== 'paper') {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['paper_mode_required'] };
  }
  if (proposal.action !== 'paper_order_proposal' && proposal.action !== 'analysis_only') {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['unsupported_proposal_action'] };
  }
  if (proposal.action === 'analysis_only') {
    return { status: 'completed', decision: 'no_order', reason_codes: ['analysis_only'] };
  }

  const risk = input.risk;
  if (!isRecord(risk) || risk.status !== 'approved' || risk.independent !== true ||
      !Array.isArray(risk.checks) || risk.checks.length === 0 ||
      risk.checks.some((check) => !isRecord(check) || check.status !== 'pass' || typeof check.name !== 'string' || !check.name.trim())) {
    return { status: 'blocked', decision: 'blocked', reason_codes: ['independent_risk_gate_not_approved'] };
  }

  return {
    status: 'completed',
    decision: 'proposal_only',
    reason_codes: ['paper_proposal_passed_policy_gate'],
    correlation_id: envelope.correlation_id,
    task_id: envelope.task_id,
    mode: 'paper'
  };
}

module.exports = { validateEnvelope, evaluatePolicy };

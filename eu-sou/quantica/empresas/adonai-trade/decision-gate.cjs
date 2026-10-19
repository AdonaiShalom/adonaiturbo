/**
 * EU SOU -> deterministic gate reference implementation.
 * Scope: validation only. It never places or routes financial orders.
 * Node.js >= 18, CommonJS, no third-party dependencies.
 */
"use strict";

const ALLOWED_MARKETS = new Set(["b3", "international", "forex", "crypto"]);
const ALLOWED_MODES = new Set(["research", "paper"]);
const ALLOWED_RECOMMENDATIONS = new Set(["buy_candidate", "sell_candidate", "hold", "abstain"]);
const HASH_RE = /^[a-f0-9]{64}$/i;

function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
function finite(v) { return typeof v === "number" && Number.isFinite(v); }
function parseTimestamp(v) {
  if (typeof v !== "string" || !/(Z|[+-]\d{2}:\d{2})$/.test(v)) return null;
  const n = Date.parse(v);
  return Number.isFinite(n) ? n : null;
}
function nonEmpty(v) { return typeof v === "string" && v.trim().length > 0; }

/**
 * validateDecision(decision, context) returns {status:"pass"|"block", reasons:[code]}.
 * context.now may be supplied for deterministic tests. Context must come from a
 * trusted server; never take portfolio/audit/idempotency facts from the proposal.
 */
function validateDecision(d, context = {}) {
  const reasons = [];
  const add = (code) => { if (!reasons.includes(code)) reasons.push(code); };
  const now = context.now instanceof Date ? context.now.getTime() :
    (finite(context.now) ? context.now : Date.now());

  if (!isObject(d)) return { status: "block", reasons: ["decision_not_object"] };
  if (d.schema_version !== "1.0") add("schema_version_unsupported");
  if (!nonEmpty(d.decision_id)) add("decision_id_missing");
  if (!nonEmpty(d.correlation_id)) add("correlation_id_missing");
  const created = parseTimestamp(d.created_at);
  const expires = parseTimestamp(d.expires_at);
  if (created === null || expires === null) add("timestamp_invalid_or_timezone_missing");
  else {
    if (created > now + 30000) add("created_at_in_future");
    if (expires <= now) add("decision_expired");
    if (expires <= created) add("expiry_not_after_creation");
  }

  if (!ALLOWED_MARKETS.has(d.market)) add("market_unsupported");
  if (!isObject(d.instrument) || !nonEmpty(d.instrument.symbol) ||
      !nonEmpty(d.instrument.venue) || !nonEmpty(d.instrument.quote_currency)) add("instrument_incomplete");
  if (!isObject(d.horizon) || !finite(d.horizon.value) || d.horizon.value <= 0 ||
      !["minute", "hour", "day", "week"].includes(d.horizon.unit)) add("horizon_invalid");
  if (!ALLOWED_RECOMMENDATIONS.has(d.recommendation)) add("recommendation_invalid");
  if (!ALLOWED_MODES.has(d.mode)) add("mode_not_paper_or_research");
  if (d.human_approval_required !== true) add("human_approval_required");

  if (!isObject(d.probability)) add("probability_missing");
  else {
    if (!nonEmpty(d.probability.event)) add("probability_event_missing");
    if (!finite(d.probability.value) || d.probability.value < 0 || d.probability.value > 1) add("probability_out_of_range");
    if (!nonEmpty(d.probability.calibration_method) || !nonEmpty(d.probability.calibration_window)) add("probability_uncalibrated");
    const u = d.probability.uncertainty;
    if (!isObject(u) || !finite(u.lower) || !finite(u.upper) || u.lower < 0 || u.upper > 1 ||
        u.lower > u.upper || (finite(d.probability.value) && (d.probability.value < u.lower || d.probability.value > u.upper))) {
      add("probability_uncertainty_invalid");
    }
  }

  const e = d.evidence;
  if (!isObject(e) || !Array.isArray(e.sources) || e.sources.length === 0) add("source_provenance_missing");
  else for (const s of e.sources) {
    if (!isObject(s) || !nonEmpty(s.url) || !nonEmpty(s.license_status) ||
        !["allowed", "restricted_approved"].includes(s.license_status) ||
        !HASH_RE.test(s.content_hash || "")) add("source_provenance_invalid");
    const retrieved = parseTimestamp(s && s.retrieved_at);
    const asOf = parseTimestamp(s && s.data_as_of);
    if (retrieved === null || asOf === null || asOf > retrieved || retrieved > now + 30000) add("source_timestamp_invalid");
    if (s && s.max_age_seconds !== undefined &&
        (!finite(s.max_age_seconds) || s.max_age_seconds < 0 ||
         retrieved === null || now - retrieved > s.max_age_seconds * 1000)) add("source_stale");
  }
  if (!isObject(e) || !nonEmpty(e.model_version) || !HASH_RE.test(e.model_hash || "") ||
      !HASH_RE.test(e.dataset_hash || "") || !nonEmpty(e.baseline) || !nonEmpty(e.validation_run_id)) {
    add("model_dataset_validation_provenance_missing");
  }
  if (context.temporalLeakage === true) add("temporal_leakage_detected");

  const economics = d.economics;
  if (!isObject(economics) || !["estimated_spread_bps", "estimated_fees_bps", "estimated_slippage_bps", "net_expected_value"]
      .every(k => finite(economics[k])) || !nonEmpty(economics.currency)) add("economics_incomplete");
  else if (["estimated_spread_bps", "estimated_fees_bps", "estimated_slippage_bps"].some(k => economics[k] < 0)) {
    add("economics_cost_invalid");
  }
  if (["forex", "crypto"].includes(d.market) && !isObject(economics)) add("market_specific_costs_missing");
  if (d.market === "forex" && !isObject(economics?.carry)) add("forex_rollover_or_carry_unavailable");
  if (d.market === "crypto" && !isObject(economics?.funding)) add("crypto_funding_basis_unavailable");

  const risk = d.risk;
  if (!isObject(risk) || !finite(risk.expected_shortfall) || !finite(risk.max_drawdown_estimate) ||
      !finite(risk.exposure_after) || !nonEmpty(risk.limit_profile)) add("risk_context_incomplete");
  else {
    if (risk.expected_shortfall < 0 || risk.max_drawdown_estimate < 0 || risk.exposure_after < 0) add("risk_value_invalid");
    if (!isObject(context.riskLimits)) add("trusted_risk_limits_unavailable");
    else {
      if (finite(context.riskLimits.maxExpectedShortfall) && risk.expected_shortfall > context.riskLimits.maxExpectedShortfall) add("expected_shortfall_limit_exceeded");
      if (finite(context.riskLimits.maxDrawdownEstimate) && risk.max_drawdown_estimate > context.riskLimits.maxDrawdownEstimate) add("drawdown_limit_exceeded");
      if (finite(context.riskLimits.maxExposure) && risk.exposure_after > context.riskLimits.maxExposure) add("exposure_limit_exceeded");
    }
  }
  if (context.portfolioStateAvailable !== true) add("portfolio_state_unavailable");
  if (context.auditHealthy !== true) add("audit_not_healthy");
  if (context.idempotencyAvailable !== true) add("idempotency_store_unavailable");
  if (context.duplicateDecision === true) add("duplicate_decision");
  if (context.duplicateCorrelation === true) add("duplicate_correlation");
  if (d.gate && d.gate.status === "block") add("upstream_gate_blocked");

  return { status: reasons.length ? "block" : "pass", reasons };
}

module.exports = { validateDecision };

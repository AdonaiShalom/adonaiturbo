/**
 * Offline tests for decision-gate.cjs.
 * Run: node --test eu-sou/quantica/empresas/adonai-trade/test-decision-gate.test.cjs
 */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateDecision } = require("./decision-gate.cjs");

const NOW = Date.parse("2026-10-19T18:00:00.000Z");
const HASH = "a".repeat(64);
function fixture(overrides = {}) {
  return {
    schema_version: "1.0",
    decision_id: "d-001",
    correlation_id: "c-001",
    created_at: "2026-10-19T17:59:00.000Z",
    expires_at: "2026-10-19T18:05:00.000Z",
    market: "b3",
    instrument: { symbol: "PETR4", venue: "B3", quote_currency: "BRL" },
    horizon: { value: 1, unit: "day" },
    recommendation: "hold",
    probability: { event: "return > 0 over 1 day", value: 0.55, calibration_method: "isotonic", calibration_window: "2025-01/2026-06", uncertainty: { lower: 0.5, upper: 0.6 } },
    evidence: { sources: [{ url: "https://example.invalid/data", retrieved_at: "2026-10-19T17:58:00.000Z", data_as_of: "2026-10-19T17:57:00.000Z", content_hash: HASH, license_status: "allowed", max_age_seconds: 600 }], model_version: "m-1", model_hash: HASH, dataset_hash: HASH, baseline: "buy-and-hold", validation_run_id: "run-1" },
    economics: { estimated_spread_bps: 2, estimated_fees_bps: 1, estimated_slippage_bps: 1, net_expected_value: 0.01, currency: "BRL" },
    risk: { expected_shortfall: 0.02, max_drawdown_estimate: 0.1, exposure_after: 0.2, limit_profile: "risk-v1" },
    gate: { status: "pending", reasons: [] },
    mode: "paper",
    human_approval_required: true,
    ...overrides
  };
}
const context = {
  now: NOW,
  auditHealthy: true,
  idempotencyAvailable: true,
  portfolioStateAvailable: true,
  riskLimits: { maxExpectedShortfall: 0.05, maxDrawdownEstimate: 0.2, maxExposure: 0.5 }
};

test("valid fixture passes only with trusted server context", () => {
  assert.deepEqual(validateDecision(fixture(), context), { status: "pass", reasons: [] });
});
test("missing instrument blocks", () => {
  assert.ok(validateDecision(fixture({ instrument: { symbol: "PETR4" } }), context).reasons.includes("instrument_incomplete"));
});
test("expired decision blocks", () => {
  assert.ok(validateDecision(fixture({ expires_at: "2026-10-19T17:59:59Z" }), context).reasons.includes("decision_expired"));
});
test("timezone-less timestamps block", () => {
  assert.ok(validateDecision(fixture({ created_at: "2026-10-19T17:59:00" }), context).reasons.includes("timestamp_invalid_or_timezone_missing"));
});
test("future source timestamp blocks", () => {
  const d = fixture(); d.evidence.sources[0].retrieved_at = "2026-10-19T18:02:00Z";
  assert.ok(validateDecision(d, context).reasons.includes("source_timestamp_invalid"));
});
test("stale source blocks", () => {
  const d = fixture(); d.evidence.sources[0].max_age_seconds = 10;
  assert.ok(validateDecision(d, context).reasons.includes("source_stale"));
});
test("missing license/hash blocks", () => {
  const d = fixture(); delete d.evidence.sources[0].license_status; delete d.evidence.sources[0].content_hash;
  assert.ok(validateDecision(d, context).reasons.includes("source_provenance_invalid"));
});
test("uncalibrated probability blocks", () => {
  const d = fixture(); d.probability.calibration_method = "";
  assert.ok(validateDecision(d, context).reasons.includes("probability_uncalibrated"));
});
test("probability outside uncertainty blocks", () => {
  const d = fixture(); d.probability.uncertainty = { lower: 0.6, upper: 0.7 };
  assert.ok(validateDecision(d, context).reasons.includes("probability_uncertainty_invalid"));
});
test("temporal leakage blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, temporalLeakage: true }).reasons.includes("temporal_leakage_detected"));
});
test("missing costs block", () => {
  const d = fixture(); delete d.economics.estimated_slippage_bps;
  assert.ok(validateDecision(d, context).reasons.includes("economics_incomplete"));
});
test("risk limit exceedance blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, riskLimits: { maxExpectedShortfall: 0.01, maxDrawdownEstimate: 0.2, maxExposure: 0.5 } }).reasons.includes("expected_shortfall_limit_exceeded"));
});
test("missing audit health blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, auditHealthy: false }).reasons.includes("audit_not_healthy"));
});
test("duplicate decision blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, duplicateDecision: true }).reasons.includes("duplicate_decision"));
});
test("duplicate correlation blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, duplicateCorrelation: true }).reasons.includes("duplicate_correlation"));
});
test("missing trusted portfolio blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, portfolioStateAvailable: false }).reasons.includes("portfolio_state_unavailable"));
});
test("live mode blocks", () => {
  assert.ok(validateDecision(fixture({ mode: "live" }), context).reasons.includes("mode_not_paper_or_research"));
});
test("human approval cannot be disabled", () => {
  assert.ok(validateDecision(fixture({ human_approval_required: false }), context).reasons.includes("human_approval_required"));
});
test("unavailable idempotency store blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, idempotencyAvailable: false }).reasons.includes("idempotency_store_unavailable"));
});
test("forex requires carry/rollover evidence", () => {
  const d = fixture({ market: "forex", instrument: { symbol: "EURUSD", venue: "provider", quote_currency: "USD" }, economics: { ...fixture().economics } });
  assert.ok(validateDecision(d, context).reasons.includes("forex_rollover_or_carry_unavailable"));
});
test("crypto requires funding/basis evidence", () => {
  const d = fixture({ market: "crypto", instrument: { symbol: "BTCUSDT", venue: "exchange", quote_currency: "USDT" }, economics: { ...fixture().economics } });
  assert.ok(validateDecision(d, context).reasons.includes("crypto_funding_basis_unavailable"));
});
test("risk limits unavailable blocks", () => {
  assert.ok(validateDecision(fixture(), { ...context, riskLimits: undefined }).reasons.includes("trusted_risk_limits_unavailable"));
});
test("partial trusted risk limits block", () => {
  assert.ok(validateDecision(fixture(), { ...context, riskLimits: { maxExposure: 0.5 } }).reasons.includes("trusted_risk_limits_unavailable"));
});
test("Forex carry requires a timestamped numeric rollover", () => {
  const d = fixture({ market: "forex", instrument: { symbol: "EURUSD", venue: "provider", quote_currency: "USD" } });
  d.economics.carry = { rollover_bps: 0.2, as_of: "2026-10-19T17:59:00Z" };
  assert.deepEqual(validateDecision(d, context), { status: "pass", reasons: [] });
});
test("Crypto funding requires timestamped rate and interval", () => {
  const d = fixture({ market: "crypto", instrument: { symbol: "BTCUSDT", venue: "exchange", quote_currency: "USDT" } });
  d.economics.funding = { rate: 0.0001, interval_hours: 8, as_of: "2026-10-19T17:59:00Z" };
  assert.deepEqual(validateDecision(d, context), { status: "pass", reasons: [] });
});
test("future Forex carry timestamp blocks", () => {
  const d = fixture({ market: "forex", instrument: { symbol: "EURUSD", venue: "provider", quote_currency: "USD" } });
  d.economics.carry = { rollover_bps: 0.2, as_of: "2026-10-19T18:01:00Z" };
  assert.ok(validateDecision(d, context).reasons.includes("forex_rollover_timestamp_invalid"));
});
test("future crypto funding timestamp blocks", () => {
  const d = fixture({ market: "crypto", instrument: { symbol: "BTCUSDT", venue: "exchange", quote_currency: "USDT" } });
  d.economics.funding = { rate: 0.0001, interval_hours: 8, as_of: "2026-10-19T18:01:00Z" };
  assert.ok(validateDecision(d, context).reasons.includes("crypto_funding_timestamp_invalid"));
});

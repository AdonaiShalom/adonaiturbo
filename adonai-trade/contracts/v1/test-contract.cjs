#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = __dirname;
const schema = JSON.parse(fs.readFileSync(path.join(dir, 'task-envelope.v1.schema.json'), 'utf8'));
const contract = fs.readFileSync(path.join(dir, 'EXECUTION_CONTRACT.md'), 'utf8');

function validEnvelope(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const allowed = new Set(Object.keys(schema.properties));
  if (Object.keys(value).some((key) => !allowed.has(key))) return false;
  if (schema.required.some((key) => !(key in value))) return false;
  if (value.schema_version !== '1.0.0' || value.mode !== 'paper') return false;
  if (typeof value.expires_at !== 'string' || Number.isNaN(Date.parse(value.expires_at)) || Date.parse(value.expires_at) <= Date.parse(value.created_at || '')) return false;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.correlation_id)) return false;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.task_id)) return false;
  if (typeof value.requested_by !== 'string' || !value.requested_by.trim() || value.requested_by.length > 128) return false;
  if (!schema.properties.market.enum.includes(value.market)) return false;
  if (!schema.properties.task_type.enum.includes(value.task_type)) return false;
  if (typeof value.created_at !== 'string' || Number.isNaN(Date.parse(value.created_at))) return false;
  if (!value.payload || typeof value.payload !== 'object' || Array.isArray(value.payload)) return false;
  if (value.expires_at !== undefined && (typeof value.expires_at !== 'string' || Number.isNaN(Date.parse(value.expires_at)))) return false;
  if (value.data_context !== undefined) {
    const ctx = value.data_context;
    if (!ctx || typeof ctx !== 'object' || Array.isArray(ctx)) return false;
    if (Object.keys(ctx).some((key) => !Object.hasOwn(schema.properties.data_context.properties, key))) return false;
    if (ctx.data_quality !== undefined && !schema.properties.data_context.properties.data_quality.enum.includes(ctx.data_quality)) return false;
  }
  if (value.scientific_context !== undefined) {
    const ctx = value.scientific_context;
    if (!ctx || typeof ctx !== 'object' || Array.isArray(ctx)) return false;
    if (Object.keys(ctx).some((key) => !Object.hasOwn(schema.properties.scientific_context.properties, key))) return false;
    if (ctx.evidence_refs !== undefined && (!Array.isArray(ctx.evidence_refs) || ctx.evidence_refs.length > 30 || ctx.evidence_refs.some((x) => typeof x !== 'string' || x.length > 512))) return false;
  }
  if (value.data_context && value.data_context.content_hash !== undefined && !/^[a-fA-F0-9]{64}$/.test(value.data_context.content_hash)) return false;
  if (value.task_type === 'paper_order_proposal') {
    const ctx = value.scientific_context;
    if (!ctx || typeof ctx !== 'object' || Array.isArray(ctx)) return false;
    const requiredScience = ['method','baseline','event','horizon','probability','calibration_method','calibration_window','calibration_status','uncertainty_interval','model_version','model_hash','dataset_hash','validation_run_id','source_hashes','cost_context','evidence_refs'];
    if (requiredScience.some((key) => !Object.hasOwn(ctx, key))) return false;
    if (ctx.calibration_status !== 'verified' && ctx.calibration_status !== 'unverified') return false;
    if (typeof ctx.probability !== 'number' || ctx.probability < 0 || ctx.probability > 1) return false;
    if (!ctx.horizon || typeof ctx.horizon.value !== 'number' || ctx.horizon.value <= 0 || !['minute','hour','day','week'].includes(ctx.horizon.unit)) return false;
    if (!ctx.uncertainty_interval || typeof ctx.uncertainty_interval.lower !== 'number' || typeof ctx.uncertainty_interval.upper !== 'number' || ctx.uncertainty_interval.lower < 0 || ctx.uncertainty_interval.upper > 1 || ctx.uncertainty_interval.lower > ctx.uncertainty_interval.upper || ctx.probability < ctx.uncertainty_interval.lower || ctx.probability > ctx.uncertainty_interval.upper) return false;
    if (!/^[a-fA-F0-9]{64}$/.test(ctx.model_hash) || !/^[a-fA-F0-9]{64}$/.test(ctx.dataset_hash)) return false;
    if (!Array.isArray(ctx.source_hashes) || ctx.source_hashes.length === 0 || ctx.source_hashes.some((hash) => !/^[a-fA-F0-9]{64}$/.test(hash))) return false;
    if (!ctx.cost_context || !['spread_bps','fees_bps','slippage_bps','net_expected_value'].every((key) => typeof ctx.cost_context[key] === 'number') || ['spread_bps','fees_bps','slippage_bps'].some((key) => ctx.cost_context[key] < 0) || typeof ctx.cost_context.currency !== 'string' || !ctx.cost_context.currency.trim()) return false;
  }
  return true;
}

const good = {
  schema_version: '1.0.0',
  correlation_id: '123e4567-e89b-42d3-a456-426614174000',
  task_id: '123e4567-e89b-42d3-a456-426614174001',
  requested_by: 'levi',
  market: 'B3',
  task_type: 'analyze_instrument',
  mode: 'paper',
  created_at: '2026-10-17T10:00:00Z',
  expires_at: '2026-10-17T10:05:00Z',
  payload: { instrument: 'PETR4' }
};

assert.equal(validEnvelope(good), true, 'valid paper envelope must pass');
assert.equal(validEnvelope({ ...good, mode: 'live' }), false, 'live mode must fail closed');
const { expires_at: omittedExpiry, ...withoutExpiry } = good;
assert.equal(validEnvelope(withoutExpiry), false, 'expiry is mandatory');
assert.equal(validEnvelope({ ...good, market: 'UNKNOWN' }), false, 'unknown market must be rejected');
assert.equal(validEnvelope({ ...good, extra: true }), false, 'unknown top-level fields must be rejected');
assert.equal(validEnvelope({ ...good, task_id: 'not-a-uuid' }), false, 'invalid task id must be rejected');
assert.equal(validEnvelope({ ...good, payload: [] }), false, 'payload must be an object');
assert.equal(validEnvelope({ ...good, data_context: { data_quality: 'fresh' } }), false, 'unknown data quality must be rejected');
assert.equal(validEnvelope({ ...good, scientific_context: { evidence_refs: Array(31).fill('ref') } }), false, 'evidence references must be bounded');

for (const phrase of [
  'exclusivamente `paper`',
  'motor independente de risco',
  'falha segura',
  'LEVI pode encaminhar',
  'Segredos não são aceitos'
]) assert.ok(contract.includes(phrase), `contract must state: ${phrase}`);


const paperProposal = {
  ...good,
  task_type: 'paper_order_proposal',
  data_context: { provider: 'fixture', observed_at: '2026-10-17T10:00:00Z', license_reference: 'test-fixture', data_quality: 'verified', content_hash: 'a'.repeat(64) },
  scientific_context: {
    method: 'calibrated baseline', baseline: 'buy-and-hold', event: 'return positive', horizon: { value: 1, unit: 'day' },
    probability: 0.55, calibration_method: 'isotonic', calibration_window: '2025-01/2026-06', calibration_status: 'verified',
    uncertainty_interval: { lower: 0.5, upper: 0.6 }, model_version: 'fixture-v1', model_hash: 'b'.repeat(64),
    dataset_hash: 'c'.repeat(64), validation_run_id: 'fixture-run-1', source_hashes: ['d'.repeat(64)],
    cost_context: { spread_bps: 2, fees_bps: 1, slippage_bps: 1, net_expected_value: 0.01, currency: 'BRL' }, evidence_refs: ['fixture://source/1']
  }
};
assert.equal(validEnvelope(paperProposal), true, 'paper proposal with complete scientific evidence must pass schema validator');
const paperWithoutScience = { ...paperProposal };
delete paperWithoutScience.scientific_context;
assert.equal(validEnvelope(paperWithoutScience), false, 'paper proposal without scientific evidence must fail');
assert.equal(validEnvelope({ ...paperProposal, scientific_context: { ...paperProposal.scientific_context, probability: 1.2 } }), false, 'invalid probability must fail schema validator');
assert.equal(validEnvelope({ ...paperProposal, scientific_context: { ...paperProposal.scientific_context, model_hash: 'invalid' } }), false, 'invalid model hash must fail schema validator');
assert.equal(validEnvelope({ ...paperProposal, data_context: { ...paperProposal.data_context, content_hash: 'invalid' } }), false, 'invalid data content hash must fail schema validator');

console.log('PASS: Adonai Trade contract smoke tests (base envelopes, scientific paper-proposal schema, hashes and safety clauses)');

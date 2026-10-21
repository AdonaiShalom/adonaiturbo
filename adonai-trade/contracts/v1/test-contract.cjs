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
  if (value.task_type !== 'health_check' && (!value.scientific_context || typeof value.scientific_context !== 'object' || Array.isArray(value.scientific_context))) return false;
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
    if (value.task_type !== 'health_check') {
      if (!['method', 'baseline', 'uncertainty', 'evidence_refs'].every((key) => Object.hasOwn(ctx, key))) return false;
      if (['method', 'baseline', 'uncertainty'].some((key) => typeof ctx[key] !== 'string' || !ctx[key].trim() || ctx[key].length > schema.properties.scientific_context.properties[key].maxLength)) return false;
      if (!Array.isArray(ctx.evidence_refs) || ctx.evidence_refs.length < 1 || ctx.evidence_refs.length > 30 || ctx.evidence_refs.some((x) => typeof x !== 'string' || !x.trim() || x.length > 512)) return false;
    }
    if (ctx.evidence_refs !== undefined && (!Array.isArray(ctx.evidence_refs) || ctx.evidence_refs.length > 30 || ctx.evidence_refs.some((x) => typeof x !== 'string' || x.length > 512))) return false;
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
  payload: { instrument: 'PETR4' },
  scientific_context: {
    method: 'análise estatística de fixture',
    baseline: 'baseline clássica',
    uncertainty: 'fixture de teste, sem alegação experimental',
    evidence_refs: ['fixture://evidence/1']
  }
};

assert.equal(validEnvelope(good), true, 'valid paper envelope must pass');
const { scientific_context: omittedScientificContext, ...withoutScientificContext } = good;
assert.equal(validEnvelope(withoutScientificContext), false, 'scientific context is mandatory for analysis tasks');
assert.equal(validEnvelope({ ...withoutScientificContext, task_type: 'health_check' }), true, 'health checks may omit scientific context');
assert.equal(validEnvelope({ ...good, scientific_context: { method: 'x', baseline: 'x', uncertainty: '', evidence_refs: ['ref'] } }), false, 'scientific uncertainty must be non-empty');
assert.equal(validEnvelope({ ...good, scientific_context: { method: 'x', baseline: 'x', uncertainty: 'x', evidence_refs: [] } }), false, 'at least one evidence reference is required');
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

console.log('PASS: Adonai Trade contract smoke tests (8 negative/positive envelope cases + safety clauses)');

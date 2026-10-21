'use strict';

const crypto = require('node:crypto');
const { STAGES, validateDecisionTrace } = require('./decision-trace.cjs');

const SECRET_BY_STAGE = Object.freeze({
  EU_SOU_RESEARCHED: 'EU_SOU_ATTESTATION_SECRET',
  LEVI_ORCHESTRATED: 'LEVI_ATTESTATION_SECRET',
  RH_AUTHORIZED: 'RH_ATTESTATION_SECRET',
  DESK_REVIEWED: 'DESK_ATTESTATION_SECRET',
  RISK_APPROVED: 'RISK_ATTESTATION_SECRET',
  PAPER_RECORDED: 'AUDIT_ATTESTATION_SECRET',
  EVALUATED: 'EVALUATOR_ATTESTATION_SECRET'
});

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value).sort()) result[key] = canonicalize(value[key]);
    return result;
  }
  return value;
}

function canonicalEvent(event) {
  const copy = { ...event };
  delete copy.signature;
  return JSON.stringify(canonicalize(copy));
}

function signEvent(event, secret) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32) {
    throw new Error('attestation_secret_too_short');
  }
  return crypto.createHmac('sha256', secret).update(canonicalEvent(event)).digest('hex');
}

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' ||
      !/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false;
  const a = Buffer.from(left, 'hex');
  const b = Buffer.from(right, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function verifyAttestedDecisionTrace(trace, env = process.env) {
  const structural = validateDecisionTrace(trace);
  const errors = [...structural.errors];
  if (!structural.valid) return { valid: false, authenticated: false, errors };

  for (let i = 0; i < STAGES.length; i++) {
    const event = trace.events[i];
    const envKey = SECRET_BY_STAGE[event.stage];
    const secret = typeof env[envKey] === 'string' ? env[envKey] : '';
    if (Buffer.byteLength(secret) < 32) {
      errors.push('attestation_secret_not_configured:' + event.stage);
      continue;
    }
    let expected;
    try { expected = signEvent(event, secret); }
    catch { errors.push('attestation_signature_invalid:' + event.stage); continue; }
    if (!safeEqualHex(event.signature, expected)) errors.push('attestation_signature_invalid:' + event.stage);
  }
  return { valid: errors.length === 0, authenticated: errors.length === 0, errors };
}

module.exports = { verifyAttestedDecisionTrace, signEvent, SECRET_BY_STAGE };

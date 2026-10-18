'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const { evaluatePolicy } = require('./policy-gate.cjs');
const { createSupabaseAuditLedger } = require('./audit-ledger.cjs');
const { listMarketDesks } = require('./market-desks.cjs');
const { getQuote } = require('./market-adapters.cjs');
const { listIntegrationStatus } = require('./integration-status.cjs');
const { createRateLimiter } = require('./rate-limit.cjs');
const { getFearGreed } = require('./fear-greed.cjs');
const { getRhSnapshot, createRhTask, updateRhTaskStatus } = require('./rh-store.cjs');
const MAX_BODY_BYTES = 64 * 1024;
const SERVICE = 'adonai-trade';
const VERSION = '0.1.0';
function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('content-length', String(Buffer.byteLength(body)));
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('content-security-policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  res.setHeader('referrer-policy', 'no-referrer');
  res.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=()');
  res.end(body);
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0, overflow = false, settled = false;
    const chunks = [];
    req.on('data', (chunk) => {
      if (overflow) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        overflow = true; chunks.length = 0; settled = true;
        reject(Object.assign(new Error('request_too_large'), { statusCode: 413 })); return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (overflow || settled) return;
      settled = true;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(Object.assign(new Error('invalid_json'), { statusCode: 400 })); }
    });
    req.on('error', (error) => { if (!settled) { settled = true; reject(error); } });
    req.on('aborted', () => { if (!settled) { settled = true; reject(Object.assign(new Error('request_aborted'), { statusCode: 400 })); } });
  });
}

function rhWriteAuth(req, env) {
  const expected = String(env.RH_API_TOKEN || '');
  if (expected.length < 32) return { ok: false, status: 503, reason: 'rh_write_token_not_configured' };
  const header = String(req.headers.authorization || '');
  const match = header.match(/^Bearer (.+)$/i);
  if (!match) return { ok: false, status: 401, reason: 'rh_write_unauthorized' };
  const actual = Buffer.from(match[1], 'utf8');
  const wanted = Buffer.from(expected, 'utf8');
  if (actual.length !== wanted.length || !crypto.timingSafeEqual(actual, wanted)) return { ok: false, status: 401, reason: 'rh_write_unauthorized' };
  return { ok: true };
}

function createServer(options = {}) {
  const now = options.now || (() => Date.now());
  const env = options.env || process.env;
  const auditLedger = options.auditLedger === undefined ? createSupabaseAuditLedger(env) : options.auditLedger;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const quoteRateLimit = createRateLimiter({ limit: options.quoteRateLimit || 30, windowMs: 60000, maxKeys: 1000, now });
  const policyRateLimit = createRateLimiter({ limit: options.policyRateLimit || 20, windowMs: 60000, maxKeys: 1000, now });
  const sentimentRateLimit = createRateLimiter({ limit: options.sentimentRateLimit || 20, windowMs: 60000, maxKeys: 1000, now });
  const rhRateLimit = createRateLimiter({ limit: options.rhRateLimit || 30, windowMs: 60000, maxKeys: 1000, now });
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const timestamp = new Date(now()).toISOString();
    // Narrow local-origin allowlist for the Turbo UI (port 3000) to read this runtime.
    // This is a browser boundary, not authentication; keep privileged routes protected separately.
    const allowedOrigins = String(env.ADONAI_TRADE_ALLOWED_ORIGINS ||
      'http://127.0.0.1:3000,http://localhost:3000').split(',').map((value) => value.trim()).filter(Boolean);
    const origin = String(req.headers.origin || '');
    const originAllowed = Boolean(origin && allowedOrigins.includes(origin));
    if (originAllowed) {
      res.setHeader('access-control-allow-origin', origin);
      res.setHeader('vary', 'Origin');
      res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
      res.setHeader('access-control-allow-headers', 'Accept, Content-Type, X-Request-Id');
      res.setHeader('access-control-max-age', '600');
    }
    if (req.method === 'OPTIONS' && url.pathname.startsWith('/api/v1/')) {
      if (!originAllowed) return send(res, 403, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: ['origin_not_allowed'], execution_performed: false });
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'alive' });
    if (req.method === 'GET' && url.pathname === '/api/v1/integrations') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, ...listIntegrationStatus(env) });
    if (req.method === 'GET' && url.pathname === '/api/v1/markets') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, ...listMarketDesks(env) });

    if (req.method === 'POST' && url.pathname === '/api/v1/rh/tasks') {
      const auth = rhWriteAuth(req, env);
      if (!auth.ok) return send(res, auth.status, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: [auth.reason], execution_enabled: false });
      const contentType = String(req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
      if (contentType !== 'application/json') return send(res, 415, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: ['unsupported_media_type'], execution_enabled: false });
      let input;
      try { input = await readJson(req); }
      catch (error) { return send(res, error.statusCode || 400, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: [error.message === 'request_too_large' ? 'request_too_large' : 'invalid_json'], execution_enabled: false }); }
      try {
        const task = await createRhTask({ env, fetchImpl, taskKey: input.task_key, title: input.title, roleKey: input.role_key, market: input.market === undefined ? null : input.market, evidence: input.evidence });
        return send(res, 201, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'created', task, audit_persisted: true, execution_enabled: false });
      } catch (error) {
        const code = error && error.code || 'rh_task_create_failed';
        const status = /^invalid_/.test(code) ? 400 : code === 'supabase_http_409' ? 409 : 503;
        return send(res, status, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'blocked', reason_codes: [code], audit_persisted: false, execution_enabled: false });
      }
    }
    const rhStatusMatch = req.method === 'PATCH' && url.pathname.match(/^\/api\/v1\/rh\/tasks\/([0-9a-f-]{36})\/status$/i);
    if (rhStatusMatch) {
      const auth = rhWriteAuth(req, env);
      if (!auth.ok) return send(res, auth.status, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: [auth.reason], execution_enabled: false });
      const contentType = String(req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
      if (contentType !== 'application/json') return send(res, 415, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: ['unsupported_media_type'], execution_enabled: false });
      let input;
      try { input = await readJson(req); }
      catch (error) { return send(res, error.statusCode || 400, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: [error.message === 'request_too_large' ? 'request_too_large' : 'invalid_json'], execution_enabled: false }); }
      try {
        const task = await updateRhTaskStatus({ env, fetchImpl, taskId: rhStatusMatch[1], status: input.status, evidence: input.evidence === undefined ? null : input.evidence });
        return send(res, 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'updated', task, audit_persisted: true, execution_enabled: false });
      } catch (error) {
        const code = error && error.code || 'rh_task_update_failed';
        const status = /^invalid_/.test(code) ? 400 : code === 'supabase_http_409' ? 409 : 503;
        return send(res, status, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'blocked', reason_codes: [code], audit_persisted: false, execution_enabled: false });
      }
    }
    if (req.method === 'GET' && url.pathname === '/api/v1/rh') {
      const rate = rhRateLimit(req.socket && req.socket.remoteAddress || 'unknown');
      res.setHeader('ratelimit-limit', String(rate.limit));
      res.setHeader('ratelimit-remaining', String(rate.remaining));
      if (!rate.allowed) {
        res.setHeader('retry-after', String(rate.retryAfterSeconds));
        return send(res, 429, { service: SERVICE, version: VERSION, timestamp, status: 'rate_limited', reason_codes: ['rh_rate_limit_exceeded'], retry_after_seconds: rate.retryAfterSeconds, execution_enabled: false });
      }
      const result = await getRhSnapshot({ env, fetchImpl });
      return send(res, result.status === 'unavailable' ? 503 : 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', execution_enabled: false, ...result });
    }
    if (req.method === 'GET' && url.pathname === '/api/v1/sentiment/fear-greed') {
      const rate = sentimentRateLimit(req.socket && req.socket.remoteAddress || 'unknown');
      res.setHeader('ratelimit-limit', String(rate.limit));
      res.setHeader('ratelimit-remaining', String(rate.remaining));
      if (!rate.allowed) {
        res.setHeader('retry-after', String(rate.retryAfterSeconds));
        return send(res, 429, { service: SERVICE, version: VERSION, timestamp, status: 'rate_limited', reason_codes: ['sentiment_rate_limit_exceeded'], retry_after_seconds: rate.retryAfterSeconds, execution_enabled: false });
      }
      const result = await getFearGreed({ fetchImpl, nowMs: now() });
      return send(res, result.status === 'unavailable' ? 503 : 200, { service: SERVICE, version: VERSION, timestamp, ...result });
    }
    if (req.method === 'GET' && url.pathname === '/api/v1/markets/quote') {
      const rate = quoteRateLimit(req.socket && req.socket.remoteAddress || 'unknown');
      res.setHeader('ratelimit-limit', String(rate.limit));
      res.setHeader('ratelimit-remaining', String(rate.remaining));
      if (!rate.allowed) {
        res.setHeader('retry-after', String(rate.retryAfterSeconds));
        return send(res, 429, { service: SERVICE, version: VERSION, timestamp, status: 'rate_limited', reason_codes: ['quote_rate_limit_exceeded'], retry_after_seconds: rate.retryAfterSeconds, execution_enabled: false });
      }
      const result = await getQuote({ desk: url.searchParams.get('desk'), symbol: url.searchParams.get('symbol'), env, fetchImpl, nowMs: now() });
      return send(res, result.status === 'unavailable' ? 503 : 200, { service: SERVICE, version: VERSION, timestamp, ...result });
    }
    if (req.method === 'GET' && url.pathname === '/ready') {
      if (!auditLedger || typeof auditLedger.check !== 'function') return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'not_ready', reason_codes: ['audit_persistence_not_configured'] });
      try { await auditLedger.check(); return send(res, 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'ready', dependencies: { audit: 'available' } }); }
      catch { return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'not_ready', reason_codes: ['audit_persistence_unavailable'] }); }
    }
    if (req.method === 'POST' && url.pathname === '/api/v1/policy/evaluate') {
      const rate = policyRateLimit(req.socket && req.socket.remoteAddress || 'unknown');
      res.setHeader('ratelimit-limit', String(rate.limit));
      res.setHeader('ratelimit-remaining', String(rate.remaining));
      if (!rate.allowed) {
        res.setHeader('retry-after', String(rate.retryAfterSeconds));
        return send(res, 429, { service: SERVICE, version: VERSION, timestamp, status: 'rate_limited', reason_codes: ['policy_rate_limit_exceeded'], retry_after_seconds: rate.retryAfterSeconds, execution_performed: false, audit_persisted: false });
      }
      const contentType = String(req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
      if (contentType !== 'application/json') return send(res, 415, { service: SERVICE, version: VERSION, timestamp, status: 'blocked', reason_codes: ['unsupported_media_type'], execution_performed: false, audit_persisted: false });
      let input;
      try { input = await readJson(req); }
      catch (error) {
        if (!res.headersSent && !res.destroyed) send(res, error.statusCode || 400, { status: 'blocked', reason_codes: [error.message === 'request_too_large' ? 'request_too_large' : 'invalid_json'], execution_performed: false });
        return;
      }
      const decision = evaluatePolicy(input, { nowMs: now() });
      if (!auditLedger || typeof auditLedger.append !== 'function') return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'blocked', audit_persisted: false, execution_performed: false, reason_codes: ['audit_persistence_not_configured'], decision });
      try {
        const audit = await auditLedger.append({ envelope: input && input.envelope, decision, requestId: req.headers['x-request-id'] || null });
        if (!audit || audit.persisted !== true || typeof audit.event_id !== 'string' || !audit.event_id) return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'blocked', audit_persisted: false, execution_performed: false, reason_codes: ['audit_persistence_unconfirmed'], decision });
        return send(res, decision.decision === 'blocked' ? 422 : 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', audit_persisted: true, audit_event_id: audit.event_id, execution_performed: false, decision });
      } catch { return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'blocked', audit_persisted: false, execution_performed: false, reason_codes: ['audit_persistence_failed'], decision }); }
    }
    if (req.method === 'GET' && url.pathname === '/') return send(res, 200, { service: SERVICE, version: VERSION, mode: 'paper', endpoints: ['/health', '/ready', '/api/v1/integrations', '/api/v1/markets', '/api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT', '/api/v1/sentiment/fear-greed', '/api/v1/rh', '/api/v1/rh/tasks (POST; RH_API_TOKEN required)', '/api/v1/rh/tasks/:id/status (PATCH; RH_API_TOKEN required)', '/api/v1/policy/evaluate'], limitations: ['read_only_market_adapters', 'no_order_execution'] });
    return send(res, 404, { status: 'not_found', reason_codes: ['route_not_found'] });
  });
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3100);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 0 || port > 65535) { process.stderr.write('Invalid PORT; expected integer 0..65535.\n'); process.exit(2); }
  const server = createServer();
  server.listen(port, host, () => process.stdout.write(JSON.stringify({ service: SERVICE, host, port: server.address().port, mode: 'paper', status: 'listening' }) + '\n'));
}
module.exports = { createServer };

'use strict';
const http = require('node:http');
const { evaluatePolicy } = require('./policy-gate.cjs');
const { createSupabaseAuditLedger } = require('./audit-ledger.cjs');
const { listMarketDesks } = require('./market-desks.cjs');
const { getQuote } = require('./market-adapters.cjs');
const { listIntegrationStatus } = require('./integration-status.cjs');
const { createRateLimiter } = require('./rate-limit.cjs');
const MAX_BODY_BYTES = 64 * 1024;
const SERVICE = 'adonai-trade';
const VERSION = '0.1.0';
function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body), 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
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
function createServer(options = {}) {
  const now = options.now || (() => Date.now());
  const env = options.env || process.env;
  const auditLedger = options.auditLedger === undefined ? createSupabaseAuditLedger(env) : options.auditLedger;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const quoteRateLimit = createRateLimiter({ limit: options.quoteRateLimit || 30, windowMs: 60000, maxKeys: 1000, now });
  const policyRateLimit = createRateLimiter({ limit: options.policyRateLimit || 20, windowMs: 60000, maxKeys: 1000, now });
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const timestamp = new Date(now()).toISOString();
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'alive' });
    if (req.method === 'GET' && url.pathname === '/api/v1/integrations') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, ...listIntegrationStatus(env) });
    if (req.method === 'GET' && url.pathname === '/api/v1/markets') return send(res, 200, { service: SERVICE, version: VERSION, timestamp, ...listMarketDesks() });
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
    if (req.method === 'GET' && url.pathname === '/') return send(res, 200, { service: SERVICE, version: VERSION, mode: 'paper', endpoints: ['/health', '/ready', '/api/v1/integrations', '/api/v1/markets', '/api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT', '/api/v1/policy/evaluate'], limitations: ['read_only_market_adapters', 'no_order_execution'] });
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

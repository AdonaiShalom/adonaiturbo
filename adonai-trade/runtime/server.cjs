'use strict';
const http = require('node:http');
const { evaluatePolicy } = require('./policy-gate.cjs');
const MAX_BODY_BYTES = 64 * 1024;
const SERVICE = 'adonai-trade';
const VERSION = '0.1.0';

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('request_too_large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(Object.assign(new Error('invalid_json'), { statusCode: 400 })); }
    });
    req.on('error', reject);
  });
}

function createServer(options = {}) {
  const now = options.now || (() => Date.now());
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const timestamp = new Date(now()).toISOString();
    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'alive' });
    }
    if (req.method === 'GET' && url.pathname === '/ready') {
      return send(res, 503, { service: SERVICE, version: VERSION, timestamp, mode: 'paper', status: 'not_ready', reason_codes: ['audit_persistence_not_configured'] });
    }
    if (req.method === 'POST' && url.pathname === '/api/v1/policy/evaluate') {
      let input;
      try { input = await readJson(req); }
      catch (error) {
        if (!res.headersSent && !res.destroyed) send(res, error.statusCode || 400, { status: 'blocked', reason_codes: [error.message === 'request_too_large' ? 'request_too_large' : 'invalid_json'] });
        return;
      }
      const decision = evaluatePolicy(input, { nowMs: now() });
      return send(res, decision.decision === 'blocked' ? 422 : 200, {
        service: SERVICE, version: VERSION, timestamp, mode: 'paper',
        audit_persisted: false, execution_performed: false, decision
      });
    }
    if (req.method === 'GET' && url.pathname === '/') {
      return send(res, 200, { service: SERVICE, version: VERSION, mode: 'paper', endpoints: ['/health', '/ready', '/api/v1/policy/evaluate'], limitations: ['no_market_adapters', 'no_durable_audit_ledger', 'no_order_execution'] });
    }
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

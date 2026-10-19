'use strict';

const crypto = require('node:crypto');

function createSupabaseAuditLedger(env = process.env, fetchImpl = fetch) {
  const baseUrl = (env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!baseUrl || !key) return null;
  let parsed;
  try { parsed = new URL(baseUrl); } catch { return null; }
  const localHttp = parsed.protocol === 'http:' && (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost' || parsed.hostname === '[::1]');
  if ((parsed.protocol !== 'https:' && !localHttp) || parsed.username || parsed.password || parsed.search || parsed.hash) return null;

  const endpoint = baseUrl + '/rest/v1/runtime_audit_events';
  const verifyEndpoint = baseUrl + '/rest/v1/rpc/verify_runtime_audit_chain';
  async function request(url, init) {
    const response = await fetchImpl(url, {
      ...init,
      headers: {
        apikey: key,
        authorization: 'Bearer ' + key,
        'content-type': 'application/json',
        ...init.headers
      },
      signal: AbortSignal.timeout(4000)
    });
    if (!response.ok) throw new Error('audit_store_http_' + response.status);
    return response;
  }
  async function verifyChain() {
    const response = await request(verifyEndpoint, {
      method: 'POST',
      headers: { 'accept-profile': 'adonai_trade', 'content-profile': 'adonai_trade' },
      body: '{}'
    });
    let result;
    try { result = await response.json(); } catch { throw new Error('audit_chain_invalid_response'); }
    if (!result || result.ok !== true || !Number.isSafeInteger(result.checked) || result.checked < 0) {
      throw new Error('audit_chain_verification_failed');
    }
    return result;
  }
  return {
    async check() {
      await verifyChain();
      return true;
    },
    async append(input) {
      const envelope = input && input.envelope;
      const decision = input && input.decision;
      if (!decision || !['blocked', 'no_order', 'proposal_only'].includes(decision.decision)) {
        throw new Error('invalid_audit_decision');
      }
      const event = {
        event_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        service: 'adonai-trade',
        service_version: '0.1.0',
        correlation_id: envelope && envelope.correlation_id || null,
        task_id: envelope && envelope.task_id || null,
        market: envelope && envelope.market || null,
        decision: decision.decision,
        reason_codes: Array.isArray(decision.reason_codes) ? decision.reason_codes : ['unspecified'],
        details: { mode: 'paper', execution_performed: false, request_id: input.requestId || null }
      };
      await request(endpoint, {
        method: 'POST',
        headers: { prefer: 'return=minimal', 'content-profile': 'adonai_trade' },
        body: JSON.stringify(event)
      });
      const chain = await verifyChain();
      return { persisted: true, event_id: event.event_id, chain_verified: true, chain_checked: chain.checked };
    }
  };
}
module.exports = { createSupabaseAuditLedger };

'use strict';

/*
 * Read-only bridge for the original Adonai Trade 3D prototype.
 * This module never invents team activity, probabilities, quotes, or decisions.
 * Include it alongside the original prototype after the runtime is served.
 */
(function attach(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AdonaiTradeRuntimeBridge = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createBridge() {
  async function readJson(fetchImpl, url, timeoutMs) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = setTimeout(() => { if (controller) controller.abort(); }, timeoutMs);
    try {
      const init = { method: 'GET', headers: { accept: 'application/json' } };
      if (controller) init.signal = controller.signal;
      let response;
      try {
        response = await fetchImpl(url, init);
      } catch (error) {
        if (controller && controller.signal.aborted) throw new Error('runtime_timeout');
        throw error;
      }
      if (!response || !response.ok) {
        const status = response && Number.isFinite(response.status) ? response.status : 0;
        throw new Error('runtime_http_' + status);
      }
      let data;
      try { data = await response.json(); }
      catch (error) {
        if (controller && controller.signal.aborted) throw new Error('runtime_timeout');
        throw new Error('runtime_invalid_json');
      }
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('runtime_invalid_json');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function normalize(markets, integrations, readiness) {
    if (!Array.isArray(markets.desks) || !Array.isArray(integrations.integrations) || !readiness || readiness.status !== 'ready') {
      throw new Error('runtime_contract_mismatch');
    }
    return Object.freeze({
      source: 'adonai-trade-runtime',
      status: 'ready',
      readiness: Object.freeze({ status: readiness.status, dependencies: readiness.dependencies || {} }),
      mode: 'paper',
      executionEnabled: false,
      fetchedAt: new Date().toISOString(),
      runtimeTimestamps: Object.freeze({
        markets: typeof markets.timestamp === 'string' ? markets.timestamp : null,
        integrations: typeof integrations.timestamp === 'string' ? integrations.timestamp : null
      }),
      marketStatus: markets.data_status || 'unknown',
      desks: Object.freeze(markets.desks.map((desk) => Object.freeze({
        id: desk.id,
        label: desk.label,
        provider: desk.provider,
        providerConfigured: desk.provider_configured === true,
        quoteStatus: desk.quote_status || 'not_checked',
        dataMode: desk.data_mode || 'unknown',
        executionEnabled: false,
        probability: null,
        activity: 'not_reported_by_runtime'
      }))),
      integrations: Object.freeze(integrations.integrations.map((item) => Object.freeze({
        id: item.id,
        status: item.status || 'not_verified',
        configured: item.configured === true,
        authenticated: item.authenticated === true,
        executionEnabled: false
      }))),
      evidencePolicy: Object.freeze({
        probabilitiesAvailable: false,
        teamActivityAvailable: false,
        reason: 'The runtime does not currently expose validated probability or team-activity evidence.'
      })
    });
  }

  async function readState(options = {}) {
    const baseUrl = String(options.baseUrl || '').replace(/\/$/, '');
    const fetchImpl = options.fetchImpl || globalThis.fetch;
    if (typeof fetchImpl !== 'function') throw new Error('fetch_unavailable');
    const timeoutMs = Number(options.timeoutMs === undefined ? 5000 : options.timeoutMs);
    if (!Number.isFinite(timeoutMs) || timeoutMs < 100 || timeoutMs > 30000) throw new Error('invalid_runtime_timeout');
    const [markets, integrations, readiness] = await Promise.all([
      readJson(fetchImpl, baseUrl + '/api/v1/markets', timeoutMs),
      readJson(fetchImpl, baseUrl + '/api/v1/integrations', timeoutMs),
      readJson(fetchImpl, baseUrl + '/ready', timeoutMs)
    ]);
    return normalize(markets, integrations, readiness);
  }

  return Object.freeze({ readState, normalize });
});

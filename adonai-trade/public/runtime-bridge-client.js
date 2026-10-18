'use strict';

/*
 * Optional browser polling client for the original Adonai Trade 3D prototype.
 * It emits verified runtime snapshots only; it never synthesizes teams,
 * activity, probabilities, decisions, or trade execution.
 */
(function attach(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AdonaiTradeRuntimeClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createClient() {
  function start(options = {}) {
    const bridge = options.bridge || (typeof globalThis !== 'undefined' && globalThis.AdonaiTradeRuntimeBridge);
    if (!bridge || typeof bridge.readState !== 'function') throw new Error('runtime_bridge_unavailable');
    const intervalMs = Number(options.intervalMs === undefined ? 15000 : options.intervalMs);
    if (!Number.isFinite(intervalMs) || intervalMs < 1000) throw new Error('invalid_poll_interval');
    const onState = typeof options.onState === 'function' ? options.onState : null;
    const onError = typeof options.onError === 'function' ? options.onError : null;
    const baseUrl = options.baseUrl || '';
    let stopped = false;
    let running = false;
    let timer = null;

    function publish(state) {
      if (onState) return onState(state);
      if (typeof globalThis !== 'undefined' && typeof globalThis.dispatchEvent === 'function' &&
          typeof globalThis.CustomEvent === 'function') {
        globalThis.dispatchEvent(new globalThis.CustomEvent('adonai-trade:runtime-state', { detail: state }));
      }
    }
    async function refresh() {
      if (stopped || running) return null;
      running = true;
      try {
        const state = await bridge.readState({ baseUrl });
        if (!stopped) publish(state);
        return state;
      } catch (error) {
        if (!stopped && onError) onError(error);
        return null;
      } finally {
        running = false;
      }
    }
    function schedule() {
      if (stopped) return;
      timer = setTimeout(async () => {
        await refresh();
        schedule();
      }, intervalMs);
    }
    void refresh().finally(schedule);
    return Object.freeze({
      refresh,
      stop() {
        stopped = true;
        if (timer !== null) clearTimeout(timer);
        timer = null;
      }
    });
  }
  return Object.freeze({ start });
});

'use strict';

const BASE_URL = 'https://getfomoapi.fun/api/leaderboard/';
const WINDOWS = new Set(['24h', '7d', '30d', 'all']);
const MAX_ROWS = 10;

function unavailable(reason) {
  return {
    status: 'unavailable',
    provider: 'FOMO API independente (não oficial; dados derivados do FOMO Family)',
    source: 'getfomoapi.fun',
    window: null,
    captured_at: null,
    stale: null,
    rankings: [],
    execution_enabled: false,
    reason_codes: [reason]
  };
}

async function getSmartMoneyLeaderboard({ fetchImpl = globalThis.fetch, apiKey = process.env.OPEN_FOMO_API_KEY, window = '24h', nowMs = Date.now() } = {}) {
  if (!WINDOWS.has(window)) return unavailable('unsupported_window');
  if (typeof fetchImpl !== 'function') return unavailable('fetch_unavailable');
  if (!String(apiKey || '').trim()) return unavailable('provider_api_key_not_configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const url = new URL(window, BASE_URL);
    url.searchParams.set('limit', String(MAX_ROWS));
    const response = await fetchImpl(url.toString(), {
      method: 'GET',
      headers: { accept: 'application/json', 'X-API-Key': String(apiKey) },
      signal: controller.signal
    });
    if (!response || !response.ok) return unavailable('provider_http_error');
    const body = await response.json();
    const raw = Array.isArray(body && body.responseObject && body.responseObject.leaderboard)
      ? body.responseObject.leaderboard
      : Array.isArray(body && body.leaderboard) ? body.leaderboard : null;
    if (!raw || body.success === false) return unavailable('provider_schema_unrecognized');

    const rankings = raw.slice(0, MAX_ROWS).map((row, index) => {
      if (!row || typeof row !== 'object') return null;
      const pnl = row.pnl24h ?? row.realizedPnlUsd ?? row.pnlUsd;
      const volume = row.totalVolume ?? row.volumeUsd;
      return {
        rank: Number.isInteger(row.rank) && row.rank > 0 ? row.rank : index + 1,
        trader_id: typeof row.id === 'string' ? row.id : null,
        handle: typeof row.userHandle === 'string' ? row.userHandle : (typeof row.handle === 'string' ? row.handle : null),
        display_name: typeof row.displayName === 'string' ? row.displayName : null,
        solana_wallet: typeof row.solana === 'string' ? row.solana : null,
        evm_wallet: typeof row.evm === 'string' ? row.evm : null,
        pnl_usd: Number.isFinite(Number(pnl)) ? Number(pnl) : null,
        volume_usd: Number.isFinite(Number(volume)) ? Number(volume) : null,
        trades: Number.isFinite(Number(row.trades)) ? Number(row.trades) : null,
        verified: typeof row.verified === 'boolean' ? row.verified : null
      };
    }).filter(Boolean);
    if (rankings.length === 0) return unavailable('provider_returned_no_rankings');

    const captured = typeof body.capturedAt === 'string' ? body.capturedAt
      : typeof body.captured_at === 'string' ? body.captured_at : null;
    const capturedMs = captured ? Date.parse(captured) : NaN;
    const ageHours = Number.isFinite(capturedMs) ? Math.max(0, (nowMs - capturedMs) / 3600000) : null;
    return {
      status: 'available',
      provider: 'FOMO API independente (não oficial; dados derivados do FOMO Family)',
      source: 'getfomoapi.fun',
      window,
      captured_at: captured,
      age_hours: ageHours === null ? null : Math.round(ageHours * 10) / 10,
      stale: ageHours === null ? null : ageHours > 2,
      data_note: 'Dados de terceiro; o provedor informa cache de leaderboard de até uma hora. Sem timestamp verificável, a idade fica desconhecida. Dados podem estar incompletos ou incorretos.',
      rankings,
      execution_enabled: false,
      reason_codes: []
    };
  } catch (error) {
    return unavailable(error && error.name === 'AbortError' ? 'provider_timeout' : 'provider_request_failed');
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { getSmartMoneyLeaderboard };

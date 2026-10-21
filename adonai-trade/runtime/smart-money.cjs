'use strict';

const BASE_URL = 'https://api.fomo-api.com/v1/leaderboard';
const WINDOWS = new Set(['24h', '7d', '30d']);
const MAX_ROWS = 10;

function unavailable(reason) {
  return {
    status: 'unavailable',
    provider: 'FOMO API independente (não oficial; dados derivados do FOMO Family)',
    source: 'api.fomo-api.com',
    window: null,
    captured_at: null,
    stale: null,
    rankings: [],
    execution_enabled: false,
    reason_codes: [reason]
  };
}

async function getSmartMoneyLeaderboard({ fetchImpl = globalThis.fetch, window = '24h', nowMs = Date.now() } = {}) {
  if (!WINDOWS.has(window)) return unavailable('unsupported_window');
  if (typeof fetchImpl !== 'function') return unavailable('fetch_unavailable');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set('window', window);
    url.searchParams.set('limit', String(MAX_ROWS));
    const response = await fetchImpl(url.toString(), {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller.signal
    });
    if (!response || !response.ok) return unavailable('provider_http_error');
    const body = await response.json();
    const raw = Array.isArray(body && body.traders) ? body.traders
      : Array.isArray(body && body.responseObject && body.responseObject.leaderboard) ? body.responseObject.leaderboard
      : Array.isArray(body && body.leaderboard) ? body.leaderboard : null;
    if (!raw) return unavailable('provider_schema_unrecognized');

    const rankings = raw.slice(0, MAX_ROWS).map((row, index) => {
      if (!row || typeof row !== 'object') return null;
      const rank = Number.isInteger(row.rank) && row.rank > 0 ? row.rank : index + 1;
      const handle = typeof row.handle === 'string' ? row.handle
        : typeof row.userHandle === 'string' ? row.userHandle : null;
      const name = typeof row.displayName === 'string' ? row.displayName : handle;
      const pnl = row.realizedPnlUsd ?? row.pnlUsd ?? row.pnl24h;
      const volume = row.volumeUsd ?? row.totalVolume;
      return {
        rank,
        trader_id: typeof row.userId === 'string' ? row.userId : (typeof row.id === 'string' ? row.id : null),
        handle,
        display_name: name,
        chain: row.address ? 'Solana' : (row.wallets && row.wallets.solana ? 'multi-chain / Solana-linked' : 'not specified'),
        solana_wallet: typeof row.address === 'string' ? row.address
          : row.wallets && typeof row.wallets.solana === 'string' ? row.wallets.solana
          : typeof row.solana === 'string' ? row.solana : null,
        pnl_usd: Number.isFinite(Number(pnl)) ? Number(pnl) : null,
        volume_usd: Number.isFinite(Number(volume)) ? Number(volume) : null,
        trades: Number.isFinite(Number(row.trades)) ? Number(row.trades) : null,
        verified: typeof row.verified === 'boolean' ? row.verified : null,
        attribution: typeof row.attribution === 'string' ? row.attribution : (body.source || 'provider_reported')
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
      source: 'api.fomo-api.com',
      window,
      captured_at: captured,
      age_hours: ageHours === null ? null : Math.round(ageHours * 10) / 10,
      stale: ageHours === null ? null : ageHours > 2,
      data_note: 'Ranking de terceiro; números são indicativos, podem estar atrasados e não comprovam desempenho futuro.',
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

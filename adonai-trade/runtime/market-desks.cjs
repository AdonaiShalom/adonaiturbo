'use strict';

const DESKS = Object.freeze([
  Object.freeze({ id: 'CRYPTO', label: 'Cripto', venue_scope: 'digital_assets', provider_configured: false }),
  Object.freeze({ id: 'FOREX', label: 'Forex', venue_scope: 'foreign_exchange', provider_configured: false }),
  Object.freeze({ id: 'B3', label: 'B3', venue_scope: 'brazil_equities', provider_configured: false }),
  Object.freeze({ id: 'INTERNATIONAL', label: 'Internacional', venue_scope: 'international_markets', provider_configured: false })
]);

function listMarketDesks() {
  return {
    mode: 'paper',
    data_status: 'unavailable',
    data_disclaimer: 'No market provider is connected. No live quote is claimed.',
    execution_enabled: false,
    desks: DESKS.map((desk) => ({
      ...desk,
      quote_status: 'unavailable',
      data_mode: 'historical_or_fixture_only',
      execution_enabled: false
    }))
  };
}

module.exports = { listMarketDesks };

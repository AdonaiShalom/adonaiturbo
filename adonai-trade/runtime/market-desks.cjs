'use strict';

const DESKS = Object.freeze([
  Object.freeze({ id: 'CRYPTO', label: 'Cripto', venue_scope: 'digital_assets', provider: 'binance_spot_public' }),
  Object.freeze({ id: 'FOREX', label: 'Forex', venue_scope: 'foreign_exchange', provider: 'frankfurter_ecb_daily_reference' }),
  Object.freeze({ id: 'B3', label: 'B3', venue_scope: 'brazil_equities', provider: 'brapi' }),
  Object.freeze({ id: 'INTERNATIONAL', label: 'Internacional', venue_scope: 'international_markets', provider: 'alphavantage_intraday_1min' })
]);

function listMarketDesks(env = process.env) {
  const desks = DESKS.map((desk) => {
    const providerConfigured =
      desk.id === 'CRYPTO' ||
      desk.id === 'FOREX' ||
      (desk.id === 'B3' && Boolean(env.BRAPI_TOKEN)) ||
      (desk.id === 'INTERNATIONAL' && Boolean(env.ALPHAVANTAGE_API_KEY));
    const dataMode = desk.id === 'FOREX' ? 'daily_reference_not_intraday' :
      desk.id === 'INTERNATIONAL' ? 'intraday_1min_timestamp_checked' :
      'read_only_quote_adapter';
    return {
      ...desk,
      provider_configured: providerConfigured,
      quote_status: 'not_checked',
      data_mode: dataMode,
      execution_enabled: false
    };
  });
  const configuredCount = desks.filter((desk) => desk.provider_configured).length;
  return {
    mode: 'paper',
    data_status: configuredCount === desks.length ? 'providers_configured' : configuredCount > 0 ? 'partially_configured' : 'providers_missing',
    data_disclaimer: 'Provider configuration is not proof of quote availability. Check /api/v1/markets/quote for each symbol; daily reference rates are not intraday quotes.',
    execution_enabled: false,
    desks
  };
}

module.exports = { listMarketDesks };

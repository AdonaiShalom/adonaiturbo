'use strict';

const DEFAULTS = Object.freeze({
  levi: 'http://127.0.0.1:3000/api/levi/orquestrar',
  eu_sou: 'http://127.0.0.1:3000/api/eu-sou/calcular'
});

function safeEndpoint(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return url.origin + url.pathname;
  } catch {
    return null;
  }
}

function listIntegrationStatus(env = process.env) {
  const specs = [
    { id: 'levi', envKey: 'LEVI_ENDPOINT', fallback: DEFAULTS.levi },
    { id: 'eu_sou', envKey: 'EU_SOU_ENDPOINT', fallback: DEFAULTS.eu_sou }
  ];
  return {
    mode: 'paper',
    status_semantics: 'configuration_only_not_connectivity_proof',
    integrations: specs.map((spec) => {
      const raw = env[spec.envKey] || spec.fallback;
      const endpoint = safeEndpoint(raw);
      return {
        id: spec.id,
        configured: Boolean(env[spec.envKey]),
        endpoint: endpoint || null,
        status: endpoint ? 'not_verified' : 'invalid_configuration',
        authenticated: false,
        last_verified_at: null,
        execution_enabled: false
      };
    })
  };
}

module.exports = { listIntegrationStatus, safeEndpoint };

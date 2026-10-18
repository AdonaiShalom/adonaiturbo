'use strict';

const MAX_ROWS = 100;

function getConfig(env = process.env) {
  const baseUrl = String(env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = String(env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!baseUrl || !key) return null;
  let parsed;
  try { parsed = new URL(baseUrl); } catch { return null; }
  const localHttp = parsed.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(parsed.hostname);
  if ((parsed.protocol !== 'https:' && !localHttp) || parsed.username || parsed.password || parsed.search || parsed.hash) return null;
  return { baseUrl, key };
}

async function getRhSnapshot({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const config = getConfig(env);
  if (!config) return { status: 'unavailable', reason_code: 'supabase_not_configured', roles: [], tasks: [], activity_is_real: false };
  if (typeof fetchImpl !== 'function') return { status: 'unavailable', reason_code: 'fetch_unavailable', roles: [], tasks: [], activity_is_real: false };
  async function read(table, query) {
    const url = config.baseUrl + '/rest/v1/' + table + '?' + query;
    const response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        apikey: config.key,
        authorization: 'Bearer ' + config.key,
        accept: 'application/json',
        'accept-profile': 'adonai_trade'
      },
      signal: AbortSignal.timeout(4000),
      redirect: 'error'
    });
    if (!response.ok) throw new Error('supabase_http_' + response.status);
    const body = await response.json();
    if (!Array.isArray(body)) throw new Error('invalid_supabase_payload');
    return body;
  }
  try {
    const [roles, tasks] = await Promise.all([
      read('rh_roles', 'select=role_key,label,purpose,permissions,activity_status,updated_at&order=role_key.asc&limit=' + MAX_ROWS),
      read('rh_tasks', 'select=task_id,task_key,title,role_key,market,status,evidence,created_at,updated_at,completed_at&order=updated_at.desc&limit=' + MAX_ROWS)
    ]);
    return {
      status: 'verified',
      source: 'supabase.adonai_trade',
      fetched_at: new Date().toISOString(),
      roles,
      tasks,
      activity_is_real: true,
      note: 'Roles are a catalog. Activity is reported only by persisted tasks/events; not_reported is not active.'
    };
  } catch (error) {
    return { status: 'unavailable', reason_code: error && /^supabase_http_/.test(error.message) ? error.message : 'supabase_read_failed', roles: [], tasks: [], activity_is_real: false };
  }
}

module.exports = { getRhSnapshot, getConfig, MAX_ROWS };

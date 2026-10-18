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


async function callRpc({ env = process.env, fetchImpl = globalThis.fetch, name, args }) {
  const config = getConfig(env);
  if (!config) throw Object.assign(new Error('supabase_not_configured'), { code: 'supabase_not_configured' });
  if (typeof fetchImpl !== 'function') throw Object.assign(new Error('fetch_unavailable'), { code: 'fetch_unavailable' });
  const response = await fetchImpl(config.baseUrl + '/rest/v1/rpc/' + name, {
    method: 'POST',
    headers: {
      apikey: config.key,
      authorization: 'Bearer ' + config.key,
      'content-type': 'application/json',
      accept: 'application/json',
      'content-profile': 'adonai_trade',
      'accept-profile': 'adonai_trade'
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(4000),
    redirect: 'error'
  });
  if (!response.ok) throw Object.assign(new Error('supabase_http_' + response.status), { code: 'supabase_http_' + response.status });
  return response.json();
}

async function createRhTask({ env = process.env, fetchImpl = globalThis.fetch, taskKey, title, roleKey, market = null, evidence = {} }) {
  if (typeof taskKey !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{2,79}$/.test(taskKey)) throw Object.assign(new Error('invalid_task_key'), { code: 'invalid_task_key' });
  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 240) throw Object.assign(new Error('invalid_task_title'), { code: 'invalid_task_title' });
  if (typeof roleKey !== 'string' || !/^[a-z_]{2,40}$/.test(roleKey)) throw Object.assign(new Error('invalid_role_key'), { code: 'invalid_role_key' });
  if (market !== null && !['CRYPTO','FOREX','B3','INTERNATIONAL'].includes(market)) throw Object.assign(new Error('invalid_market'), { code: 'invalid_market' });
  const safeEvidence = evidence && typeof evidence === 'object' && !Array.isArray(evidence) ? evidence : {};
  return callRpc({ env, fetchImpl, name: 'rh_create_task_with_audit', args: {
    p_task_key: taskKey, p_title: title.trim(), p_role_key: roleKey, p_market: market, p_evidence: safeEvidence
  }});
}

async function updateRhTaskStatus({ env = process.env, fetchImpl = globalThis.fetch, taskId, status, evidence = null }) {
  if (typeof taskId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(taskId)) throw Object.assign(new Error('invalid_task_id'), { code: 'invalid_task_id' });
  if (!['queued','in_progress','blocked','review','completed','cancelled'].includes(status)) throw Object.assign(new Error('invalid_task_status'), { code: 'invalid_task_status' });
  const safeEvidence = evidence === null ? null : (evidence && typeof evidence === 'object' && !Array.isArray(evidence) ? evidence : {});
  return callRpc({ env, fetchImpl, name: 'rh_update_task_status_with_audit', args: {
    p_task_id: taskId, p_status: status, p_evidence: safeEvidence
  }});
}

module.exports = { getRhSnapshot, getConfig, createRhTask, updateRhTaskStatus, MAX_ROWS };

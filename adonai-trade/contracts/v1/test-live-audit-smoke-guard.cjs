'use strict';
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const script = path.join(__dirname, 'verify-audit-live.cjs');
const env = { ...process.env };
delete env.ADONAI_TRADE_CONFIRM_LIVE_AUDIT;
delete env.SUPABASE_URL;
delete env.SUPABASE_SERVICE_ROLE_KEY;
const result = spawnSync(process.execPath, [script], {
  env,
  encoding: 'utf8',
  timeout: 5000
});
assert.equal(result.status, 1, 'live audit smoke must refuse to run without explicit operator opt-in');
assert.match(result.stderr, /ADONAI_TRADE_CONFIRM_LIVE_AUDIT=YES/);
assert.doesNotMatch(result.stdout + result.stderr, /service_role|Bearer\s+\S+|supabase\.co/i);
process.stdout.write('PASS: live audit smoke refuses to write without explicit opt-in and does not reveal credentials.\n');

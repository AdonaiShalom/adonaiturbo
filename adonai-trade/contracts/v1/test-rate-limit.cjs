'use strict';
const assert = require('node:assert/strict');
const { createRateLimiter } = require('../../runtime/rate-limit.cjs');

let now = 1000;
const consume = createRateLimiter({ limit: 2, windowMs: 60000, maxKeys: 2, now: () => now });
assert.deepEqual(consume('client-a'), { allowed: true, limit: 2, remaining: 1, retryAfterSeconds: 60 });
assert.equal(consume('client-a').allowed, true);
const blocked = consume('client-a');
assert.equal(blocked.allowed, false);
assert.equal(blocked.remaining, 0);
assert.equal(blocked.retryAfterSeconds, 60);
now += 60000;
assert.equal(consume('client-a').allowed, true);
consume('client-b');
consume('client-c');
assert.equal(consume('client-c').allowed, true);
assert.throws(() => createRateLimiter({ limit: 0 }), /positive integer/);
process.stdout.write('PASS: quote rate limiter enforces fixed windows, resets, and bounds key storage\n');

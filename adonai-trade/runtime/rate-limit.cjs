'use strict';

// In-memory fixed-window limiter for read-only provider-backed quote lookups.
// For multi-instance deployments, replace with a shared limiter (e.g. Redis/Valkey).
function createRateLimiter({ limit = 30, windowMs = 60000, maxKeys = 1000, now = () => Date.now() } = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit must be a positive integer');
  if (!Number.isFinite(windowMs) || windowMs < 1) throw new TypeError('windowMs must be positive');
  if (!Number.isInteger(maxKeys) || maxKeys < 1) throw new TypeError('maxKeys must be a positive integer');
  const buckets = new Map();
  return function consume(key) {
    const time = now();
    const id = String(key || 'unknown').slice(0, 200);
    let bucket = buckets.get(id);
    if (!bucket || time - bucket.startedAt >= windowMs || time < bucket.startedAt) {
      bucket = { startedAt: time, count: 0 };
      buckets.delete(id);
      buckets.set(id, bucket);
    }
    bucket.count += 1;
    // Bound memory for callers presenting many distinct client identifiers.
    while (buckets.size > maxKeys) buckets.delete(buckets.keys().next().value);
    const remaining = Math.max(0, limit - bucket.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.startedAt + windowMs - time) / 1000));
    return { allowed: bucket.count <= limit, limit, remaining, retryAfterSeconds };
  };
}
module.exports = { createRateLimiter };

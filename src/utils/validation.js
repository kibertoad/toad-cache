/**
 * Validates the shared cache constructor parameters.
 * Both values must be non-negative integers.
 *
 * @param {number} max
 * @param {number} ttlInMsecs
 */
export function validateCacheParams(max, ttlInMsecs) {
  if (typeof max !== 'number' || !Number.isInteger(max) || max < 0) {
    throw new Error('Invalid max value')
  }

  if (typeof ttlInMsecs !== 'number' || !Number.isInteger(ttlInMsecs) || ttlInMsecs < 0) {
    throw new Error('Invalid ttl value')
  }
}

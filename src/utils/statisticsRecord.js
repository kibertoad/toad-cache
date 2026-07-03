/**
 * Creates a zeroed statistics record for a single collection window.
 *
 * @returns {object}
 */
export function createEmptyStatisticsRecord() {
  return {
    cacheSize: 0,
    hits: 0,
    falsyHits: 0,
    emptyHits: 0,
    misses: 0,
    expirations: 0,
    evictions: 0,
    invalidateOne: 0,
    invalidateAll: 0,
    sets: 0,
  }
}

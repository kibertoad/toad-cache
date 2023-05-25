export class HitStatisticsRecord {
  constructor() {
    this.records = {}
  }

  initForCache(cacheId, currentTimeStamp) {
    this.records[cacheId] = {
      [currentTimeStamp]: {
        hits: 0,
        misses: 0,
        expirations: 0,
      },
    }
  }

  resetForCache(cacheId) {
    for (let key of Object.keys(this.records[cacheId])) {
      this.records[cacheId][key] = {
        hits: 0,
        misses: 0,
        expirations: 0,
      }
    }
  }

  getStatistics() {
    return this.records
  }
}

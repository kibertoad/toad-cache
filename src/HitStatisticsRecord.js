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

  getStatistics() {
    return this.records
  }
}

import { createEmptyStatisticsRecord } from './utils/statisticsRecord.js'

export class HitStatisticsRecord {
  constructor() {
    this.records = {}
  }

  initForCache(cacheId, currentTimeStamp) {
    this.records[cacheId] = {
      [currentTimeStamp]: createEmptyStatisticsRecord(),
    }
  }

  resetForCache(cacheId) {
    if (!this.records[cacheId]) {
      return
    }

    for (let key of Object.keys(this.records[cacheId])) {
      this.records[cacheId][key] = createEmptyStatisticsRecord()
    }
  }

  getStatistics() {
    return this.records
  }
}

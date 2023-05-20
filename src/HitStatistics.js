import { HitStatisticsRecord } from './HitStatisticsRecord.js'
import { getTimestamp } from './utils/dateUtils.js'

export class HitStatistics {
  constructor(cacheId, statisticTtlInHours, globalStatisticsRecord) {
    this.collectionStart = new Date()

    this.lastTimeStamp = ''
    this.currentTimeStamp = getTimestamp(this.collectionStart)
    this.cacheId = cacheId
    this.statisticTtlInHours = statisticTtlInHours

    this.records = globalStatisticsRecord || new HitStatisticsRecord()
    this.records.initForCache(this.cacheId, this.currentTimeStamp)
  }

  hoursPassed() {
    return (Date.now() - this.collectionStart) / 1000 / 60 / 60
  }

  addHit() {
    this.archiveIfNeeded()
    this.records.records[this.cacheId][this.currentTimeStamp].hits++
  }

  addMiss() {
    this.archiveIfNeeded()
    this.records.records[this.cacheId][this.currentTimeStamp].misses++
  }

  addExpiration() {
    this.archiveIfNeeded()
    this.records.records[this.cacheId][this.currentTimeStamp].expirations++
  }

  getStatistics() {
    return this.records.getStatistics()
  }

  archiveIfNeeded() {
    if (this.hoursPassed() >= this.statisticTtlInHours) {
      const now = new Date()
      const newTimestamp = getTimestamp(now)

      if (this.lastTimeStamp && this.lastTimeStamp !== newTimestamp) {
        delete this.records.records[this.cacheId][this.lastTimeStamp]
      }
      this.lastTimeStamp = this.currentTimeStamp

      this.collectionStart = now
      this.currentTimeStamp = getTimestamp(this.collectionStart)
      this.records.initForCache(this.cacheId, this.currentTimeStamp)
    }
  }
}

import { HitStatisticsRecord } from './HitStatisticsRecord.js'
import { getTimestamp } from './utils/dateUtils.js'

export class HitStatistics {
  constructor(cacheId, statisticTtlInHours, globalStatisticsRecord) {
    this.cacheId = cacheId
    this.statisticTtlInHours = statisticTtlInHours

    this.collectionStart = new Date()
    this.currentTimeStamp = getTimestamp(this.collectionStart)

    this.records = globalStatisticsRecord || new HitStatisticsRecord()
    this.records.initForCache(this.cacheId, this.currentTimeStamp)
  }

  get currentRecord() {
    // safety net
    /* c8 ignore next 11 */
    if (!this.records.records[this.cacheId][this.currentTimeStamp]) {
      this.records.records[this.cacheId][this.currentTimeStamp] = {
        cacheSize: 0,
        hits: 0,
        falsyHits: 0,
        emptyHits: 0,
        misses: 0,
        expirations: 0,
        evictions: 0,
      }
    }

    return this.records.records[this.cacheId][this.currentTimeStamp]
  }

  hoursPassed() {
    return (Date.now() - this.collectionStart) / 1000 / 60 / 60
  }

  addHit() {
    this.archiveIfNeeded()
    this.currentRecord.hits++
  }
  addFalsyHit() {
    this.archiveIfNeeded()
    this.currentRecord.falsyHits++
  }

  addEmptyHit() {
    this.archiveIfNeeded()
    this.currentRecord.emptyHits++
  }

  addMiss() {
    this.archiveIfNeeded()
    this.currentRecord.misses++
  }

  addEviction() {
    this.archiveIfNeeded()
    this.currentRecord.evictions++
  }

  setCacheSize(currentSize) {
    this.archiveIfNeeded()
    this.currentRecord.cacheSize = currentSize
  }

  addExpiration() {
    this.archiveIfNeeded()
    this.currentRecord.expirations++
  }

  getStatistics() {
    return this.records.getStatistics()
  }

  archiveIfNeeded() {
    if (this.hoursPassed() >= this.statisticTtlInHours) {
      this.collectionStart = new Date()
      this.currentTimeStamp = getTimestamp(this.collectionStart)
      this.records.initForCache(this.cacheId, this.currentTimeStamp)
    }
  }
}

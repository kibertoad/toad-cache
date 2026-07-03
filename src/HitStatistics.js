import { HitStatisticsRecord } from './HitStatisticsRecord.js'
import { getTimestamp } from './utils/dateUtils.js'
import { createEmptyStatisticsRecord } from './utils/statisticsRecord.js'

export class HitStatistics {
  constructor(cacheId, statisticTtlInHours, globalStatisticsRecord) {
    this.cacheId = cacheId
    this.statisticTtlInHours = statisticTtlInHours

    this.collectionStart = new Date()
    this.currentTimeStamp = getTimestamp(this.collectionStart)
    this.archiveAfter = this.collectionStart.getTime() + this.statisticTtlInHours * 3_600_000

    this.records = globalStatisticsRecord || new HitStatisticsRecord()
    this.records.initForCache(this.cacheId, this.currentTimeStamp)
  }

  get currentRecord() {
    const cacheRecords = this.records.records[this.cacheId]
    // safety net
    /* c8 ignore next 3 */
    if (!cacheRecords[this.currentTimeStamp]) {
      cacheRecords[this.currentTimeStamp] = createEmptyStatisticsRecord()
    }

    return cacheRecords[this.currentTimeStamp]
  }

  /* v8 ignore next 3 -- kept for compatibility, no longer used internally */
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

  addSet() {
    this.archiveIfNeeded()
    this.currentRecord.sets++
  }

  addInvalidateOne() {
    this.archiveIfNeeded()
    this.currentRecord.invalidateOne++
  }

  addInvalidateAll() {
    this.archiveIfNeeded()
    this.currentRecord.invalidateAll++
  }

  getStatistics() {
    return this.records.getStatistics()
  }

  archiveIfNeeded() {
    if (Date.now() >= this.archiveAfter) {
      this.collectionStart = new Date()
      this.currentTimeStamp = getTimestamp(this.collectionStart)
      this.archiveAfter = this.collectionStart.getTime() + this.statisticTtlInHours * 3_600_000
      this.records.initForCache(this.cacheId, this.currentTimeStamp)
    }
  }
}

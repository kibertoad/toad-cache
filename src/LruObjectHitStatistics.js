import { HitStatistics } from './HitStatistics.js'
import { LruObject } from './LruObject.js'

export class LruObjectHitStatistics extends LruObject {
  constructor(max, ttlInMsecs, cacheId, globalStatisticsRecord, statisticTtlInHours) {
    super(max || 1000, ttlInMsecs || 0)

    if (!cacheId) {
      throw new Error('Cache id is mandatory')
    }

    this.hitStatistics = new HitStatistics(
      cacheId,
      statisticTtlInHours !== undefined ? statisticTtlInHours : 24,
      globalStatisticsRecord,
    )
  }

  getStatistics() {
    return this.hitStatistics.getStatistics()
  }

  set(key, value) {
    super.set(key, value)
    this.hitStatistics.addSet()
    this.hitStatistics.setCacheSize(this.size)
  }

  evict() {
    super.evict()
    this.hitStatistics.addEviction()
    this.hitStatistics.setCacheSize(this.size)
  }

  delete(key, isExpiration = false) {
    super.delete(key)

    if (!isExpiration) {
      this.hitStatistics.addInvalidateOne()
    }
    this.hitStatistics.setCacheSize(this.size)
  }

  clear() {
    super.clear()

    this.hitStatistics.addInvalidateAll()
    this.hitStatistics.setCacheSize(this.size)
  }

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key]

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key, true)
        this.hitStatistics.addExpiration()
        return
      }

      // Item is still fresh
      this.bumpLru(item)
      if (!item.value) {
        this.hitStatistics.addFalsyHit()
      }
      if (item.value === undefined || item.value === null || item.value === '') {
        this.hitStatistics.addEmptyHit()
      }
      this.hitStatistics.addHit()
      return item.value
    }
    this.hitStatistics.addMiss()
  }
}

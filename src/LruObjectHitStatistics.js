import { LruObject } from './LruObject.js'
import { HitStatistics } from './HitStatistics.js'

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

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key]

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key)
        this.hitStatistics.addExpiration()
        return
      }

      // Item is still fresh
      this.bumpLru(item)
      this.hitStatistics.addHit()
      return item.value
    }
    this.hitStatistics.addMiss()
  }
}

import { LruObject } from './LruObject.js'
import { HitStatistics } from './HitStatistics.js'

export class LruObjectHitStatistics extends LruObject {
  constructor(cacheParams) {
    super(cacheParams.max || 1000, cacheParams.ttlInMsecs || 0)

    if (!cacheParams.cacheId) {
      throw new Error('Cache id is mandatory')
    }

    this.hitStatistics = new HitStatistics(
      cacheParams.cacheId,
      cacheParams.statisticTtlInHours,
      cacheParams.globalStatisticsRecord
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

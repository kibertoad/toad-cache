import { HitStatistics } from './HitStatistics.js'
import { LruObject } from './LruObject.js'

export class LruObjectHitStatistics extends LruObject {
  constructor(max, ttlInMsecs, cacheId, globalStatisticsRecord, statisticTtlInHours) {
    // Pass through as-is: the base constructor applies the 1000/0 defaults for
    // omitted (undefined) values and validates everything else, so explicit 0
    // stays unlimited and null/NaN are rejected the same way as the base class.
    super(max, ttlInMsecs)

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
    const hadItems = this.size > 0
    super.evict()
    if (hadItems) {
      this.hitStatistics.addEviction()
    }
    this.hitStatistics.setCacheSize(this.size)
  }

  delete(key, isExpiration = false) {
    const existed = this.items[key] !== undefined
    super.delete(key)

    if (existed && !isExpiration) {
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
    const item = this.items[key]

    if (item !== undefined) {
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
        // Empty values are a subset of falsy values
        if (item.value === undefined || item.value === null || item.value === '') {
          this.hitStatistics.addEmptyHit()
        }
      }
      this.hitStatistics.addHit()
      return item.value
    }
    this.hitStatistics.addMiss()
  }
}

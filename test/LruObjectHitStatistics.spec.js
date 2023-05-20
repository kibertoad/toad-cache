import { describe, expect, it } from 'vitest'
import { items, populateCache } from './utils/cachePopulator.js'
import { LruObjectHitStatistics } from '../src/LruObjectHitStatistics.js'
import { setTimeout } from 'timers/promises'
import { HitStatisticsRecord } from '../src/HitStatisticsRecord.js'
import { getTimestamp } from '../src/utils/dateUtils.js'

const timestamp = getTimestamp(new Date())

describe('LruObjectHitStatistics', function () {
  let cache

  describe('constructor validations', () => {
    it('throws on invalid max', () => {
      expect(() => new LruObjectHitStatistics('abc')).to.throw(/Invalid max value/)
    })

    it('throws on invalid ttl', () => {
      expect(() => new LruObjectHitStatistics(100, 'abc')).to.throw(/Invalid ttl value/)
    })

    it('throws on no cacheId', () => {
      expect(() => new LruObjectHitStatistics(100, 123)).to.throw(/Cache id is mandatory/)
    })
  })

  describe('get', () => {
    it('deletes expired entries', async () => {
      cache = new LruObjectHitStatistics(4, 500, 'cache 1')
      populateCache(cache)
      await setTimeout(300)
      cache.set(items[2], items[2])
      const item1Pre = cache.get(items[1])
      const item2Pre = cache.get(items[2])

      await setTimeout(300)

      const item1Post = cache.get(items[1])
      const item2Post = cache.get(items[2])

      expect(item1Pre).toBe(false)
      expect(item1Post).toBeUndefined()
      expect(item2Pre).toBe(items[2])
      expect(item2Post).toBe(items[2])

      expect(cache.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            expirations: 1,
            hits: 3,
            misses: 0,
          },
        },
      })
    })

    it('registers misses', async () => {
      cache = new LruObjectHitStatistics(4, 500, 'cache 1')
      const item = cache.get('dummy')

      expect(item).toBeUndefined()

      expect(cache.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            expirations: 0,
            hits: 0,
            misses: 1,
          },
        },
      })
    })

    it('resets records when record ttl is exceeded', async () => {
      cache = new LruObjectHitStatistics(undefined, undefined, 'cache 1', undefined, 0)
      const item = cache.get('dummy')
      const item2 = cache.get('dummy')
      const item3 = cache.get('dummy')

      expect(item).toBeUndefined()
      expect(item2).toBeUndefined()
      expect(item3).toBeUndefined()

      expect(cache.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            expirations: 0,
            hits: 0,
            misses: 1,
          },
        },
      })
    })

    it('deletes old data on reset', async () => {
      cache = new LruObjectHitStatistics(undefined, undefined, 'cache 1', undefined, 0)
      const item = cache.get('dummy')
      const item2 = cache.get('dummy')
      const item3 = cache.get('dummy')

      expect(item).toBeUndefined()
      expect(item2).toBeUndefined()
      expect(item3).toBeUndefined()

      const oldTime = new Date(Date.now() - 1000 * 60 * 60 * 24)
      const oldTimeStamp = getTimestamp(oldTime)
      cache.hitStatistics.records.records = {
        'cache 1': {
          [oldTimeStamp]: {
            expirations: 100,
            hits: 100,
            misses: 100,
          },
        },
      }
      cache.hitStatistics.lastTimeStamp = oldTimeStamp

      const item4 = cache.get('dummy')
      expect(item4).toBeUndefined()

      expect(cache.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            expirations: 0,
            hits: 0,
            misses: 1,
          },
        },
      })
    })

    it('supports global record', async () => {
      const statistics = new HitStatisticsRecord()
      statistics.initForCache('older cache', timestamp)
      cache = new LruObjectHitStatistics(4, 500, 'cache 1', statistics)
      const item = cache.get('dummy')

      expect(item).toBeUndefined()

      expect(cache.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            expirations: 0,
            hits: 0,
            misses: 1,
          },
        },
        'older cache': {
          [timestamp]: {
            expirations: 0,
            hits: 0,
            misses: 0,
          },
        },
      })
    })
  })
})

import { setTimeout } from 'node:timers/promises'
import { describe, expect, it } from 'vitest'
import { HitStatisticsRecord } from '../src/HitStatisticsRecord.js'
import { LruObjectHitStatistics } from '../src/LruObjectHitStatistics.js'
import { getTimestamp } from '../src/utils/dateUtils.js'
import { items, populateCache } from './utils/cachePopulator.js'

const timestamp = getTimestamp(new Date())

describe('LruObjectHitStatistics', () => {
  let cache1

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
    it('deletes expired and excessive entries', async () => {
      cache1 = new LruObjectHitStatistics(4, 500, 'cache 1')
      populateCache(cache1)
      await setTimeout(300)
      cache1.set(items[2], items[2])
      const item1Pre = cache1.get(items[1])
      const item2Pre = cache1.get(items[2])

      await setTimeout(300)

      const item1Post = cache1.get(items[1])
      const item2Post = cache1.get(items[2])

      expect(item1Pre).toBe(false)
      expect(item1Post).toBeUndefined()
      expect(item2Pre).toBe(items[2])
      expect(item2Post).toBe(items[2])

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            falsyHits: 1,
            emptyHits: 0,
            cacheSize: 3,
            evictions: 1,
            expirations: 1,
            hits: 3,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 6,
          },
        },
      })
    })

    it('registers misses', async () => {
      cache1 = new LruObjectHitStatistics(4, 500, 'cache 1')
      const item = cache1.get('dummy')

      expect(item).toBeUndefined()

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 1,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      })
    })

    it('registers invalidations', async () => {
      cache1 = new LruObjectHitStatistics(10, 500, 'cache 1')
      cache1.set('dummy1', 1)
      cache1.set('dummy2', 2)
      cache1.set('dummy3', 3)
      cache1.set('dummy4', 4)
      cache1.set('dummy5', 5)

      cache1.delete('dummy1')
      cache1.delete('dummy2')
      cache1.clear()

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 0,
            invalidateAll: 1,
            invalidateOne: 2,
            sets: 5,
          },
        },
      })
    })

    it('registers hits', async () => {
      cache1 = new LruObjectHitStatistics(4, 500, 'cache 1')
      cache1.set('dummy', 'value')
      cache1.get('dummy')

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            cacheSize: 1,
            evictions: 0,
            expirations: 0,
            falsyHits: 0,
            emptyHits: 0,
            hits: 1,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 1,
          },
        },
      })
    })

    it('registers falsy hits', async () => {
      cache1 = new LruObjectHitStatistics(4, 500, 'cache 1')
      cache1.set('dummy', '')
      cache1.get('dummy')

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            cacheSize: 1,
            evictions: 0,
            expirations: 0,
            falsyHits: 1,
            emptyHits: 1,
            hits: 1,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 1,
          },
        },
      })
    })

    it('resets records when record ttl is exceeded', async () => {
      cache1 = new LruObjectHitStatistics(undefined, undefined, 'cache 1', undefined, 0)
      const item = cache1.get('dummy')
      const item2 = cache1.get('dummy')
      const item3 = cache1.get('dummy')

      expect(item).toBeUndefined()
      expect(item2).toBeUndefined()
      expect(item3).toBeUndefined()

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 1,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      })
    })

    it('deletes old data on reset', async () => {
      cache1 = new LruObjectHitStatistics(undefined, undefined, 'cache 1', undefined, 0)
      const item = cache1.get('dummy')
      const item2 = cache1.get('dummy')
      const item3 = cache1.get('dummy')

      expect(item).toBeUndefined()
      expect(item2).toBeUndefined()
      expect(item3).toBeUndefined()

      const oldTime = new Date(Date.now() - 1000 * 60 * 60 * 24)
      const oldTimeStamp = getTimestamp(oldTime)
      cache1.hitStatistics.records.records = {
        'cache 1': {
          [oldTimeStamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 1,
            expirations: 100,
            hits: 100,
            misses: 100,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      }
      cache1.hitStatistics.lastTimeStamp = oldTimeStamp

      const item4 = cache1.get('dummy')
      expect(item4).toBeUndefined()

      expect(cache1.getStatistics()).toEqual({
        'cache 1': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 1,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      })
    })

    it('supports global record', async () => {
      const statistics = new HitStatisticsRecord()
      statistics.initForCache('older cache', timestamp)
      const cache1 = new LruObjectHitStatistics(4, 500, 'cache 1', statistics)
      const cache2 = new LruObjectHitStatistics(4, 500, 'cache 2', statistics)
      cache2.set('dummy', null)

      cache1.get('dummy')
      cache2.get('dummy')

      const expectedStatistics = {
        'cache 1': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 1,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
        'cache 2': {
          [timestamp]: {
            emptyHits: 1,
            falsyHits: 1,
            cacheSize: 1,
            evictions: 0,
            expirations: 0,
            hits: 1,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 1,
          },
        },
        'older cache': {
          [timestamp]: {
            emptyHits: 0,
            falsyHits: 0,
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      }
      expect(cache1.getStatistics()).toEqual(expectedStatistics)
      expect(cache2.getStatistics()).toEqual(expectedStatistics)
    })
  })
})

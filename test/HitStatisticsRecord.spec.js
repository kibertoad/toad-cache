import { describe, expect, it } from 'vitest'
import { HitStatisticsRecord } from '../src/HitStatisticsRecord.js'
import { getTimestamp } from '../src/utils/dateUtils.js'

describe('HitStatisticsRecord', () => {
  describe('resetForCache', () => {
    it('resets for one cache', () => {
      const record = new HitStatisticsRecord()
      const currentTime = new Date(Date.now())
      const currentTimeStamp = getTimestamp(currentTime)

      record.initForCache('cache1', currentTimeStamp)
      record.initForCache('cache2', currentTimeStamp)

      record.records.cache1 = {
        [currentTimeStamp]: {
          cacheSize: 0,
          evictions: 100,
          expirations: 100,
          hits: 100,
          emptyHits: 0,
          falsyHits: 0,
          misses: 100,
          invalidateAll: 0,
          invalidateOne: 0,
          sets: 0,
        },
      }

      record.records.cache2 = {
        [currentTimeStamp]: {
          cacheSize: 0,
          evictions: 200,
          expirations: 200,
          hits: 200,
          emptyHits: 0,
          falsyHits: 0,
          misses: 200,
          invalidateAll: 0,
          invalidateOne: 0,
          sets: 0,
        },
      }

      record.resetForCache('cache2')

      expect(record.records).toEqual({
        cache1: {
          [currentTimeStamp]: {
            cacheSize: 0,
            evictions: 100,
            expirations: 100,
            hits: 100,
            emptyHits: 0,
            falsyHits: 0,
            misses: 100,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
        cache2: {
          [currentTimeStamp]: {
            cacheSize: 0,
            evictions: 0,
            expirations: 0,
            hits: 0,
            emptyHits: 0,
            falsyHits: 0,
            misses: 0,
            invalidateAll: 0,
            invalidateOne: 0,
            sets: 0,
          },
        },
      })
    })
  })
})

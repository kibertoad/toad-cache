import { HitStatisticsRecord } from '../src/HitStatisticsRecord.js'
import { getTimestamp } from '../src/utils/dateUtils.js'
import { it, describe, expect } from 'vitest'

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
          },
        },
      })
    })
  })
})

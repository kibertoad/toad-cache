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
          expirations: 100,
          hits: 100,
          misses: 100,
        },
      }

      record.records.cache2 = {
        [currentTimeStamp]: {
          expirations: 200,
          hits: 200,
          misses: 200,
        },
      }

      record.resetForCache('cache2')

      expect(record.records).toEqual({
        cache1: {
          '2023-05-25': {
            expirations: 100,
            hits: 100,
            misses: 100,
          },
        },
        cache2: {
          '2023-05-25': {
            expirations: 0,
            hits: 0,
            misses: 0,
          },
        },
      })
    })
  })
})

import { HitStatistics } from '../src/HitStatistics.js'
import { it, describe, expect, beforeEach, afterEach, vitest } from 'vitest'
import { HitStatisticsRecord } from '../src/HitStatisticsRecord.js'

describe('HitStatistics', () => {
  beforeEach(() => {
    vitest.useFakeTimers()
    vitest.setSystemTime(new Date('2024-01-02'))
  })

  afterEach(() => {
    vitest.useRealTimers()
  })

  it('resets content after archiving', () => {
    const hitStatistics = new HitStatistics('cache', 1)

    hitStatistics.addHit()
    hitStatistics.addHit()

    expect(hitStatistics.getStatistics()).toEqual({
      cache: {
        '2024-01-02': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 2,
          misses: 0,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
    })

    vitest.setSystemTime(new Date('2024-01-03'))

    hitStatistics.addHit()

    expect(hitStatistics.getStatistics()).toEqual({
      cache: {
        '2024-01-03': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 1,
          misses: 0,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
    })
  })

  it('resets content after archiving, muiltiple caches', () => {
    const globalRecord = new HitStatisticsRecord()
    const hitStatistics1 = new HitStatistics('cache1', 1, globalRecord)
    const hitStatistics2 = new HitStatistics('cache2', 1, globalRecord)

    hitStatistics1.addHit()
    hitStatistics1.addHit()

    hitStatistics2.addMiss()
    hitStatistics2.addMiss()

    expect(globalRecord.records).toEqual({
      cache1: {
        '2024-01-02': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 2,
          misses: 0,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
      cache2: {
        '2024-01-02': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 0,
          misses: 2,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
    })

    vitest.setSystemTime(new Date('2024-01-03'))

    hitStatistics1.addHit()

    hitStatistics2.addMiss()

    expect(globalRecord.records).toEqual({
      cache1: {
        '2024-01-03': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 1,
          misses: 0,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
      cache2: {
        '2024-01-03': {
          emptyHits: 0,
          falsyHits: 0,
          cacheSize: 0,
          evictions: 0,
          expirations: 0,
          hits: 0,
          misses: 1,
          invalidateAll: 0,
          invalidateOne: 0,
        },
      },
    })
  })
})

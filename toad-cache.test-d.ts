import {FifoMap, LruMap, FifoObject, LruObject, Fifo, Lru, LruObjectHitStatistics, HitStatisticsRecord, CacheConstructor, CacheEntry, CacheStatistics} from './toad-cache'
import type { ToadCache } from './toad-cache'

import { expectAssignable, expectType } from 'tsd'

expectAssignable<ToadCache<number>>(new LruObject<number>())
expectAssignable<ToadCache<number>>(new LruMap<number>())
expectAssignable<ToadCache<number>>(new FifoObject<number>())
expectAssignable<ToadCache<number>>(new FifoMap<number>())
expectAssignable<ToadCache<number>>(new Fifo<number>())
expectAssignable<ToadCache<number>>(new Lru<number>())

expectAssignable<CacheConstructor<LruObject<number>>>(LruObject<number>)
expectAssignable<CacheConstructor<LruMap<number>>>(LruMap<number>)
expectAssignable<CacheConstructor<FifoObject<number>>>(FifoObject<number>)
expectAssignable<CacheConstructor<FifoMap<number>>>(FifoMap<number>)
expectAssignable<CacheConstructor<Fifo<number>>>(Fifo<number>)
expectAssignable<CacheConstructor<Lru<number>>>(Lru<number>)


expectType<number | undefined>(new Fifo<number>().get('a'))
expectType<number | undefined>(new Lru<number>().get('a'))

const lru = new Lru<number>()
const fifo = new Fifo<number>()

lru.set('a', 1)
fifo.set('a', 1)

expectType<Record<any, CacheEntry<number>>> (lru.items)
expectType<Record<any, CacheEntry<number>>> (fifo.items)

expectType<Map<any, CacheEntry<number>>> (new LruMap<number>().items)
expectType<Map<any, CacheEntry<number>>> (new FifoMap<number>().items)

const statsRecord = new HitStatisticsRecord()
const statsCache = new LruObjectHitStatistics<number>(100, 0, 'cache-id', statsRecord, 24)
expectType<Record<string, Record<string, CacheStatistics>>>(statsCache.getStatistics())
expectType<Record<string, Record<string, CacheStatistics>>>(statsRecord.getStatistics())

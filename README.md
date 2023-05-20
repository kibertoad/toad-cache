# Toad Cache

![](https://github.com/kibertoad/toad-cache/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/kibertoad/toad-cache/badge.svg?branch=main)](https://coveralls.io/r/kibertoad/toad-cache?branch=main)

Least-Recently-Used and First-In-First-Out caches for Client or Server.

## Getting started

```javascript
import { Lru, Fifo } from 'toad-cache'
const lruCache = new Lru(max, ttl = 0)
const fifoCache = new Fifo(max, ttl = 0)
```

## clear

### Method

Clears the contents of the cache

**Example**

```javascript
cache.clear()
```

## delete

### Method

Removes item from cache

    param  {String} key Item key

**Example**

```javascript
cache.delete('myKey')
```

## evict

### Method

Evicts the least recently used item from cache

**Example**

```javascript
cache.evict()
```

## expiresAt

### Method

Gets expiration time for cached item

    param  {String} key Item key
    return {Mixed}      Undefined or number (epoch time)

**Example**

```javascript
const item = cache.expiresAt('myKey')
```

## first

### Property

Item in "first" or "bottom" position

**Example**

```javascript
const cache = new Lru()

cache.first // null - it's a new cache!
```

## get

### Method

Gets cached item and moves it to the front

    param  {String} key Item key
    return {Mixed}      Undefined or Item value

**Example**

```javascript
const item = cache.get('myKey')
```

## keys

### Method

Returns an `Array` of cache item keys.

    return {Array} Array of keys

**Example**

```javascript
console.log(cache.keys())
```

## max

### Property

Max items to hold in cache (1000)

**Example**

```javascript
const cache = new Lru(500)

cache.max // 500
```

## last

### Property

Item in "last" or "top" position

**Example**

```javascript
const cache = new Lru()

cache.last // null - it's a new cache!
```

## set

### Method

Sets item in cache as `first`

    param  {String} key   Item key
    param  {Mixed}  value Item value

**Example**

```javascript
cache.set('myKey', { prop: true })
```

## size

### Property

Number of items in cache

**Example**

```javascript
const cache = new Lru()

cache.size // 0 - it's a new cache!
```

## ttl

### Property

Milliseconds an item will remain in cache; lazy expiration upon next `get()` of an item

**Example**

```javascript
const cache = new Lru()

cache.ttl = 3e4
```

## Hit/miss/expiration tracking

In case you want to gather information on cache hit/miss/expiration ratio, you can use LruHitStatistics class:

```js
const sharedRecord = new HitStatisticsRecord() // if you want to use single record object for all of caches, create it manually and pass to each cache

const cache = new LruHitStatistics({
  cacheId: 'some-cache-id',
  globalStatisticsRecord: sharedRecord,
  statisticTtlInHours: 24, // how often to rotate statistics. On every rotation, data, that is older than one day, is removed
  max: 1000,
  ttlInMsecs: 0,
})
```

You can retrieve accumulated statistics from the cache, or from the record directly:

```js
// this is the same
const statistics = sharedRecord.getStatistics()
const alsoStatistics = cache.getStatistics()

/*
{
  'some-cache-id': {
    '2023-04-06': {
      expirations: 0,
      hits: 0,
      misses: 1,
    },
  },
}

Note that date here reflects start of the rotation. If statistics weren't rotated yet, and another day started, it will still be counted against the day of the rotation start
*/
```

## License

Copyright (c) 2023 Igor Savin

Based on [tiny-lru](https://github.com/avoidwork/tiny-lru), created by Jason Mulligan

Licensed under the MIT license.

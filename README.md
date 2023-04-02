# Toad Cache

![](https://github.com/kibertoad/toad-cache/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/kibertoad/toad-cache/badge.svg?branch=main)](https://coveralls.io/r/kibertoad/toad-cache?branch=main)

Least-Recently-Used and First-In-First-Out caches for Client or Server.

## Getting started

```javascript
import { lru } from "toad-cache";
const cache = lru(max, ttl = 0);
```

Lodash provides a `memoize` function with a cache that can be swapped out as long as it implements the right interface.
See the [lodash docs](https://lodash.com/docs#memoize) for more on `memoize`.

#### Example

```javascript
_.memoize.Cache = fifo().constructor;
const memoized = _.memoize(myFunc);
memoized.cache.max = 10;
```

## clear
### Method

Clears the contents of the cache

	return {Object} LRU instance

**Example**

```javascript
cache.clear();
```

## delete
### Method

Removes item from cache

	param  {String} key Item key
	return {Object}     LRU instance

**Example**

```javascript
cache.delete("myKey");
```

## evict
### Method

Evicts the least recently used item from cache

	return {Object} LRU instance

**Example**

```javascript
cache.evict();
```

## expiresAt
### Method

Gets expiration time for cached item

	param  {String} key Item key
	return {Mixed}      Undefined or number (epoch time)

**Example**

```javascript
const item = cache.expiresAt("myKey");
```

## first
### Property

Item in "first" or "bottom" position

**Example**

```javascript
const cache = fifo();

cache.first; // null - it's a new cache!
```

## get
### Method

Gets cached item and moves it to the front

	param  {String} key Item key
	return {Mixed}      Undefined or Item value

**Example**

```javascript
const item = cache.get("myKey");
```

## keys
### Method

Returns an `Array` of cache item keys.

	return {Array} Array of keys

**Example**

```javascript
console.log(cache.keys());
```

## max
### Property

Max items to hold in cache (1000)

**Example**

```javascript
const cache = fifo(500);

cache.max; // 500
```

## last
### Property

Item in "last" or "top" position

**Example**

```javascript
const cache = fifo();

cache.last; // null - it's a new cache!
```

## set
### Method

Sets item in cache as `first`

	param  {String} key   Item key
	param  {Mixed}  value Item value
	return {Object}       LRU instance

**Example**

```javascript
cache.set("myKey", {prop: true});
```

## size
### Property

Number of items in cache

**Example**

```javascript
const cache = fifo();

cache.size; // 0 - it's a new cache!
```

## ttl
### Property

Milliseconds an item will remain in cache; lazy expiration upon next `get()` of an item

**Example**

```javascript
const cache = fifo();

cache.ttl = 3e4;
```

## License
Copyright (c) 2023 Igor Savin

Based on [tiny-lru](https://github.com/avoidwork/tiny-lru), created by Jason Mulligan

Licensed under the MIT license.

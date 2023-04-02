import assert from 'node:assert'
import { it, describe, beforeEach } from 'vitest'
import { lru } from '../src/lru.js'

describe('LRU', function () {
  let cache
  let items

  beforeEach(function () {
    cache = lru(4)
    items = ['a', 'b', 'c', 'd', 'e']
  })

  it('It should evict', function () {
    items.forEach((i) => cache.set(i, false))
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.size, 4, "Should be '4'")
    cache.evict()
    assert.strictEqual(cache.first.key, 'c', "Should be 'c'")
  })

  it('It should delete', function () {
    items.forEach((i) => cache.set(i, false))
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.size, 4, "Should be '4'")
    assert.strictEqual(cache.items.get('e').next, null, "Should be 'null'")
    assert.strictEqual(cache.items.get('e').prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('d').next.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.items.get('d').prev.key, 'c', "Should be 'c'")
    assert.strictEqual(cache.items.get('c').next.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('c').prev.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.items.get('b').next.key, 'c', "Should be 'c'")
    assert.strictEqual(cache.items.get('b').prev, null, "Should be 'null'")
    cache.delete('c')
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.size, 3, "Should be '3'")
    assert.strictEqual(cache.items.get('e').next, null, "Should be 'null'")
    assert.strictEqual(cache.items.get('e').prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('d').next.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.items.get('d').prev.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.items.get('b').next.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('b').prev, null, "Should be 'null'")
    cache.delete('e')
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.size, 2, "Should be '2'")
    cache.get('b')
    assert.strictEqual(cache.first.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.first.prev, null, "Should be 'null'")
    assert.strictEqual(cache.first.next.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.last.next, null, "Should be 'null'")
    assert.strictEqual(cache.size, 2, "Should be '2'")
  })

  it('It should handle a small evict', function () {
    items.forEach((i) => cache.set(i, false))
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.size, 4, "Should be '4'")
    assert.strictEqual(cache.items.get('e').next, null, "Should be 'null'")
    assert.strictEqual(cache.items.get('e').prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('d').next.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.items.get('d').prev.key, 'c', "Should be 'c'")
    assert.strictEqual(cache.items.get('c').next.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('c').prev.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.items.get('b').next.key, 'c', "Should be 'c'")
    assert.strictEqual(cache.items.get('b').prev, null, "Should be 'null'")
    cache.delete('c')
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.size, 3, "Should be '3'")
    assert.strictEqual(cache.items.get('e').next, null, "Should be 'null'")
    assert.strictEqual(cache.items.get('e').prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('d').next.key, 'e', "Should be 'e'")
    assert.strictEqual(cache.items.get('d').prev.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.items.get('b').next.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.items.get('b').prev, null, "Should be 'null'")
    cache.delete('e')
    assert.strictEqual(cache.first.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.size, 2, "Should be '2'")
    cache.get('b')
    assert.strictEqual(cache.first.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.first.prev, null, "Should be 'null'")
    assert.strictEqual(cache.first.next.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.key, 'b', "Should be 'b'")
    assert.strictEqual(cache.last.prev.key, 'd', "Should be 'd'")
    assert.strictEqual(cache.last.next, null, "Should be 'null'")
    assert.strictEqual(cache.size, 2, "Should be '2'")
  })

  it('It should handle an empty evict', function () {
    cache = lru(1)
    assert.strictEqual(cache.first, null, "Should be 'null'")
    assert.strictEqual(cache.last, null, "Should be 'null'")
    assert.strictEqual(cache.size, 0, "Should be 'null'")
    cache.evict()
    assert.strictEqual(cache.first, null, "Should be 'null'")
    assert.strictEqual(cache.last, null, "Should be 'null'")
    assert.strictEqual(cache.size, 0, "Should be 'null'")
  })

  it('It should expose expiration time', function () {
    cache = lru(1, 6e4)
    cache.set(items[0], false)
    assert.strictEqual(typeof cache.expiresAt(items[0]), 'number', 'Should be a number')
    assert.strictEqual(cache.expiresAt('invalid'), undefined, 'Should be undefined')
  })

  it('It should reset the TTL with optional parameter', () =>
    new Promise((done) => {
      cache = lru(1, 6e4)
      cache.set(items[0], false)
      const n1 = cache.expiresAt(items[0])
      assert.strictEqual(typeof n1, 'number', 'Should be a number')
      assert.strictEqual(n1 > 0, true, 'Should be greater than zero')
      setTimeout(() => {
        cache.set(items[0], false, false, true)
        const n2 = cache.expiresAt(items[0])
        assert.strictEqual(typeof n2, 'number', 'Should be a number')
        assert.strictEqual(n2 > 0, true, 'Should be greater than zero')
        assert.strictEqual(n2 > n1, true, 'Should be greater than first expiration timestamp')
        done()
      }, 11)
    }))

  it('It should reset the TTL with optional property', () =>
    new Promise((done) => {
      cache = lru(1, 6e4, true)
      cache.set(items[0], false)
      const n1 = cache.expiresAt(items[0])
      assert.strictEqual(typeof n1, 'number', 'Should be a number')
      assert.strictEqual(n1 > 0, true, 'Should be greater than zero')
      setTimeout(() => {
        cache.set(items[0], false)
        const n2 = cache.expiresAt(items[0])
        assert.strictEqual(typeof n2, 'number', 'Should be a number')
        assert.strictEqual(n2 > 0, true, 'Should be greater than zero')
        assert.strictEqual(n2 > n1, true, 'Should be greater than first expiration timestamp')
        done()
      }, 11)
    }))
})

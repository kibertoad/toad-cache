export class LruObject {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null
    this.items = Object.create(null)
    this.last = null
    this.size = 0
    this.max = max
    this.ttl = ttlInMsecs
  }

  bumpLru(item) {
    if (this.last === item) {
      return // Item is already the last one, no need to bump
    }

    const last = this.last
    const next = item.next
    const prev = item.prev

    if (this.first === item) {
      this.first = next
    }

    item.next = null
    item.prev = last
    last.next = item

    if (prev !== null) {
      prev.next = next
    }

    if (next !== null) {
      next.prev = prev
    }

    this.last = item
  }

  clear() {
    this.items = Object.create(null)
    this.first = null
    this.last = null
    this.size = 0
  }

  delete(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key]

      delete this.items[key]
      this.size--

      if (item.prev !== null) {
        item.prev.next = item.next
      }

      if (item.next !== null) {
        item.next.prev = item.prev
      }

      if (this.first === item) {
        this.first = item.next
      }

      if (this.last === item) {
        this.last = item.prev
      }
    }
  }

  deleteMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      this.delete(keys[i])
    }
  }

  evict() {
    if (this.size > 0) {
      const item = this.first

      delete this.items[item.key]

      if (--this.size === 0) {
        this.first = null
        this.last = null
      } else {
        this.first = item.next
        this.first.prev = null
      }
    }
  }

  expiresAt(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      return this.items[key].expiry
    }
  }

  get(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key]

      // Item has already expired
      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key)
        return
      }

      // Item is still fresh
      this.bumpLru(item)
      return item.value
    }
  }

  getMany(keys) {
    const result = []

    for (var i = 0; i < keys.length; i++) {
      result.push(this.get(keys[i]))
    }

    return result
  }

  keys() {
    return Object.keys(this.items)
  }

  set(key, value) {
    // Replace existing item
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const item = this.items[key]
      item.value = value

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl

      if (this.last !== item) {
        this.bumpLru(item)
      }

      return
    }

    // Add new item
    if (this.max > 0 && this.size === this.max) {
      this.evict()
    }

    const item = {
      expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
      key: key,
      prev: this.last,
      next: null,
      value,
    }
    this.items[key] = item

    if (++this.size === 1) {
      this.first = item
    } else {
      this.last.next = item
    }

    this.last = item
  }
}

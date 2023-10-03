export class FifoMap {
  constructor(max = 1000, ttlInMsecs = 0) {
    if (isNaN(max) || max < 0) {
      throw new Error('Invalid max value')
    }

    if (isNaN(ttlInMsecs) || ttlInMsecs < 0) {
      throw new Error('Invalid ttl value')
    }

    this.first = null
    this.items = new Map()
    this.last = null
    this.max = max
    this.ttl = ttlInMsecs
  }

  get size() {
    return this.items.size
  }

  clear() {
    this.items = new Map()
    this.first = null
    this.last = null
  }

  delete(key) {
    if (this.items.has(key)) {
      const deletedItem = this.items.get(key)

      this.items.delete(key)

      if (deletedItem.prev !== null) {
        deletedItem.prev.next = deletedItem.next
      }

      if (deletedItem.next !== null) {
        deletedItem.next.prev = deletedItem.prev
      }

      if (this.first === deletedItem) {
        this.first = deletedItem.next
      }

      if (this.last === deletedItem) {
        this.last = deletedItem.prev
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

      this.items.delete(item.key)

      if (this.size === 0) {
        this.first = null
        this.last = null
      } else {
        this.first = item.next
        this.first.prev = null
      }
    }
  }

  expiresAt(key) {
    if (this.items.has(key)) {
      return this.items.get(key).expiry
    }
  }

  get(key) {
    if (this.items.has(key)) {
      const item = this.items.get(key)

      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key)
        return
      }

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
    return this.items.keys()
  }

  set(key, value) {
    // Replace existing item
    if (this.items.has(key)) {
      const item = this.items.get(key)
      item.value = value

      item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl

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
    this.items.set(key, item)

    if (this.size === 1) {
      this.first = item
    } else {
      this.last.next = item
    }

    this.last = item
  }
}

class FIFOObject {
  constructor(max = 0, ttl = 0) {
    this.first = null
    this.items = Object.create(null)
    this.last = null
    this.size = 0
    this.max = max
    this.ttl = ttl
  }

  clear() {
    this.items = Object.create(null)
    this.first = null
    this.last = null
    this.size = 0
  }

  delete(key) {
    if (Object.prototype.hasOwnProperty.call(this.items, key)) {
      const deletedItem = this.items[key]

      delete this.items[key]
      this.size--

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

      if (this.ttl > 0 && item.expiry <= Date.now()) {
        this.delete(key)
        return
      }

      return item.value
    }
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

export function fifoObject(max = 1000, ttl = 0) {
  if (isNaN(max) || max < 0) {
    throw new TypeError('Invalid max value')
  }

  if (isNaN(ttl) || ttl < 0) {
    throw new TypeError('Invalid ttl value')
  }

  return new FIFOObject(max, ttl)
}

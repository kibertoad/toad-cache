export const items = ['a', 'b', 'c', 'd', 'e']

export function populateCache(cache) {
    for (let itemKey of items) {
        cache.set(itemKey, false)
    }
}

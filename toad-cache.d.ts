export function lru<T = any>(max?: number, ttl?: number): ToadCache<T>;

export function fifo<T = any>(max?: number, ttl?: number): ToadCache<T>;
export interface ToadCache<T> {
    first: T | null;
    last: T | null;
    max: number;
    size: number;
    ttl: number;

    clear(): void;
    delete(key: any): void;
    evict(): void;
    expiresAt(key: any): number | undefined;
    get(key: any): T | undefined;
    keys(): string[];
    set(key: any, value: T): void;
}
export { };

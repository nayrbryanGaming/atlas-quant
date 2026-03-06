export interface ICacheStore<T> {
    get(key: string): T | null;
    set(key: string, value: T, ttlMs: number): void;
    clear(key: string): void;
}

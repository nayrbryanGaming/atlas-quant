interface CacheItem<T> {
    value: T;
    expiry: number;
}

const storage = new Map<string, CacheItem<any>>();

export const cache = {
    get<T>(key: string): T | null {
        const item = storage.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            storage.delete(key);
            return null;
        }
        return item.value;
    },

    set<T>(key: string, value: T, ttlMs: number = 900000): void {
        storage.set(key, {
            value,
            expiry: Date.now() + ttlMs
        });
    },

    clear(key: string): void {
        storage.delete(key);
    }
};

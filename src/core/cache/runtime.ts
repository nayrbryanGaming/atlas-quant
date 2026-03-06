import { ICacheStore } from './interface';
import { logger } from '@/utils/logger';

interface CacheEntry<T> {
    value: T;
    expiry: number;
}

/**
 * Ephemeral runtime cache.
 * Designed to hold temporary state like pilot trades or quant signals.
 * Data is wiped on cold start, which is intended per architecture.
 */
class RuntimeCache<T> implements ICacheStore<T> {
    private store: Map<string, CacheEntry<T>> = new Map();

    get(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key: string, value: T, ttlMs: number): void {
        try {
            this.store.set(key, {
                value,
                expiry: Date.now() + ttlMs,
            });
        } catch (error) {
            // Catch OOM or other extreme memory issues
            logger.error(`Failed to set cache for key ${key}`, error);
        }
    }

    clear(key: string): void {
        this.store.delete(key);
    }

    clearAll(): void {
        this.store.clear();
    }
}

// Global cache instances for different domains to prevent key collisions
export const signalCache = new RuntimeCache<any>();
export const pilotCache = new RuntimeCache<any>();
export const aiCache = new RuntimeCache<any>();

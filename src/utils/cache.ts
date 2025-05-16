interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

const CACHE_TTL = parseInt(import.meta.env.VITE_CACHE_TTL || '3600', 10);
const CACHE_PREFIX = 'taskflow_cache_';

export class Cache {
  static set<T>(key: string, value: T, ttl: number = CACHE_TTL): void {
    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  }

  static get<T>(key: string): T | null {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item) as CacheItem<T>;
      const now = Date.now();
      const expired = now - parsed.timestamp > parsed.ttl * 1000;

      if (expired) {
        this.remove(key);
        return null;
      }

      return parsed.value;
    } catch {
      this.remove(key);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(CACHE_PREFIX + key);
  }

  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }

  static clearExpired(): void {
    const now = Date.now();
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (now - item.timestamp > item.ttl * 1000) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      });
  }
}

export const withCache = <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> => {
  const cached = Cache.get<T>(key);
  if (cached !== null) return Promise.resolve(cached);

  return fn().then(value => {
    Cache.set(key, value, ttl);
    return value;
  });
}; 
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheConfig {
  expiryTime: number; // in milliseconds
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class CacheManager {
  private static requestCounts: Map<string, number[]> = new Map();
  private static defaultConfig: CacheConfig = {
    expiryTime: 5 * 60 * 1000, // 5 minutes
  };

  private static defaultRateLimit: RateLimitConfig = {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
  };

  static async set<T>(key: string, data: T, config?: Partial<CacheConfig>): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async get<T>(key: string, config?: Partial<CacheConfig>): Promise<T | null> {
    const finalConfig = { ...this.defaultConfig, ...config };

    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > finalConfig.expiryTime;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      await AsyncStorage.multiRemove(matchingKeys);
    } catch (error) {
      console.error('Cache pattern invalidate error:', error);
    }
  }

  static canMakeRequest(endpoint: string, config?: Partial<RateLimitConfig>): boolean {
    const finalConfig = { ...this.defaultRateLimit, ...config };
    const now = Date.now();

    // Get or initialize request timestamps for this endpoint
    let timestamps = this.requestCounts.get(endpoint) || [];
    timestamps = timestamps.filter(time => now - time < finalConfig.windowMs);

    if (timestamps.length >= finalConfig.maxRequests) {
      return false;
    }

    timestamps.push(now);
    this.requestCounts.set(endpoint, timestamps);
    return true;
  }

  static async wrap<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config?: Partial<CacheConfig>
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, config);
    if (cached) return cached;

    // If not in cache, fetch and store
    const data = await fetchFn();
    await this.set(key, data, config);
    return data;
  }
}
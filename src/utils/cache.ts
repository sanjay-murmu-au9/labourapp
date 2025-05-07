import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheConfig {
  expiryTime: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  private static defaultConfig: CacheConfig = {
    expiryTime: 24 * 60 * 60 * 1000, // 24 hours
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
}
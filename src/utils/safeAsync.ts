import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { analytics } from '../services/api/queryClient';
import { logEvent } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withErrorHandling } from './errorHandler';

type KeyValuePair = [string, string | null];
type StorageKeyValuePair = [string, string];

/**
 * Enhanced AsyncStorage wrapper with better error handling and types
 */
class SafeAsyncStorage {
  setItem = withErrorHandling(async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  });

  getItem = withErrorHandling(async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  });

  removeItem = withErrorHandling(async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  });

  clear = withErrorHandling(async (): Promise<void> => {
    await AsyncStorage.clear();
  });

  multiGet = withErrorHandling(async (keys: string[]): Promise<KeyValuePair[]> => {
    const result = await AsyncStorage.multiGet(keys);
    return [...result];
  });

  multiSet = withErrorHandling(async (keyValuePairs: KeyValuePair[]): Promise<void> => {
    // Filter out pairs with null values and convert to required format
    const validPairs: StorageKeyValuePair[] = keyValuePairs
      .filter((pair): pair is [string, string] => pair[1] !== null);
    await AsyncStorage.multiSet(validPairs);
  });

  getAllKeys = withErrorHandling(async (): Promise<string[]> => {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  });
}

export const safeAsyncStorage = new SafeAsyncStorage();

interface UseAsyncOperationConfig {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
}

export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  config: UseAsyncOperationConfig = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      config.onSuccess?.();
      return result;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);

      if (__DEV__) {
        console.error('Operation failed:', error);
      } else {
        // Log to analytics using the wrapped version
        analytics.logEvent('operation_error', {
          errorMessage: error.message,
          errorStack: error.stack
        });
      }

      Alert.alert(
        'Error',
        config.errorMessage || 'Operation failed. Please try again.'
      );

      config.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, config]);

  return {
    execute,
    isLoading,
    error
  };
}
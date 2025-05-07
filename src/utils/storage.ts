import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../navigation/types';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import { CacheManager } from './cache';

const KEYS = {
  USER_PROFILE: 'user_profile',
  AUTH_TOKEN: 'auth_token',
  DEVICE_ID: 'device_id',
  APP_SETTINGS: 'app_settings',
  LAST_LOGIN: 'last_login',
};

// Cache configuration
const CACHE_CONFIG = {
  userProfile: {
    expiryTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    retryAttempts: 3,
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryOperation = async (operation: () => Promise<any>, retries = 0): Promise<any> => {
  try {
    return await operation();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // Silent retry without user notification for first attempt
      if (retries > 0) {
        console.warn(`Operation failed, attempt ${retries + 1}/${MAX_RETRIES}`);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries)));
      return retryOperation(operation, retries + 1);
    }

    // Only show alert on final retry failure
    Alert.alert(
      'Operation Failed',
      'There was a problem completing the operation. Please try again.',
      [{ text: 'OK' }]
    );
    throw error;
  }
};

export const safeAsyncStorage = {
  setItem: async (key: string, value: any) => {
    return retryOperation(async () => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
      } catch (error) {
        console.error('Storage setItem error:', error);
        throw new Error('Failed to save data. Please try again.');
      }
    });
  },

  getItem: async (key: string) => {
    return retryOperation(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (error) {
        console.error('Storage getItem error:', error);
        throw new Error('Failed to retrieve data. Please try again.');
      }
    });
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  },

  clear: async () => {
    return retryOperation(async () => {
      try {
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Storage clear error:', error);
        throw new Error('Failed to clear data. Please try again.');
      }
    });
  }
};

// Simple encryption for sensitive data
const encrypt = (text: string): string => {
  if (!text) {
    throw new Error('Cannot encrypt empty data');
  }
  try {
    // Add a simple validation check before encryption
    JSON.parse(JSON.stringify(text)); // Validate that data is serializable
    return Buffer.from(text).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data: Invalid data format');
  }
};

const decrypt = (text: string): string => {
  if (!text) {
    throw new Error('Cannot decrypt empty data');
  }
  try {
    const decoded = Buffer.from(text, 'base64').toString('ascii');
    // Validate that decoded data is proper JSON
    JSON.parse(decoded);
    return decoded;
  } catch (error) {
    console.error('Decryption error:', error);
    // Clear corrupted data
    safeAsyncStorage.removeItem(KEYS.USER_PROFILE).catch(console.error);
    throw new Error('Failed to decrypt data: Data may be corrupted');
  }
};

const encryptData = async (data: any): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    // Add your encryption logic here if needed
    return jsonString;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data: Invalid data format');
  }
};

export const storeUserProfile = async (data: UserProfile) => {
  try {
    // Validate data is serializable
    JSON.stringify(data);

    // Ensure required fields are present
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid user profile data format');
    }

    const encryptedData = await encryptData(data);
    await AsyncStorage.setItem(KEYS.USER_PROFILE, encryptedData);

    // Store last login timestamp
    await AsyncStorage.setItem(KEYS.LAST_LOGIN, Date.now().toString());

    // Cache the user profile
    await CacheManager.set(KEYS.USER_PROFILE, data, {
      expiryTime: CACHE_CONFIG.userProfile.expiryTime
    });
  } catch (error: any) {
    console.error('Storage error:', error);
    if (error.message.includes('circular') || error.message.includes('JSON')) {
      throw new Error('Failed to encrypt data: Invalid data format');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // Try to get from cache first
    const cachedUser = await CacheManager.get<UserProfile>(KEYS.USER_PROFILE);
    if (cachedUser) {
      return cachedUser;
    }

    // If not in cache, get from storage
    const encryptedProfile = await safeAsyncStorage.getItem(KEYS.USER_PROFILE);
    if (!encryptedProfile) return null;

    const decryptedProfile = decrypt(encryptedProfile);
    const userProfile = JSON.parse(decryptedProfile);

    // Cache the result for future use
    await CacheManager.set(KEYS.USER_PROFILE, userProfile, {
      expiryTime: CACHE_CONFIG.userProfile.expiryTime
    });

    return userProfile;
  } catch (error) {
    console.error('Error getting current user:', error);
    Alert.alert('Error', 'Failed to load user profile. Please try again.');
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    // Clear user data but preserve device ID
    const deviceId = await getDeviceId();
    await safeAsyncStorage.clear();
    await safeAsyncStorage.setItem(KEYS.DEVICE_ID, deviceId);

    // Clear cache
    await CacheManager.invalidate(KEYS.USER_PROFILE);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    Alert.alert('Error', 'Failed to logout. Please try again.');
    return false;
  }
};

export const getDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await safeAsyncStorage.getItem(KEYS.DEVICE_ID);

    if (!deviceId) {
      deviceId = `${Device.modelName}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await safeAsyncStorage.setItem(KEYS.DEVICE_ID, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    Alert.alert('Error', 'Failed to get device ID. Please restart the app.');
    throw error;
  }
};

export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    const encryptedToken = encrypt(token);
    await safeAsyncStorage.setItem(KEYS.AUTH_TOKEN, encryptedToken);
  } catch (error) {
    console.error('Error storing auth token:', error);
    Alert.alert('Error', 'Failed to store authentication token. Please try logging in again.');
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const encryptedToken = await safeAsyncStorage.getItem(KEYS.AUTH_TOKEN);
    if (!encryptedToken) return null;

    return decrypt(encryptedToken);
  } catch (error) {
    console.error('Error getting auth token:', error);
    Alert.alert('Error', 'Failed to get authentication token. Please log in again.');
    return null;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    const deviceId = await getDeviceId(); // Preserve device ID
    await safeAsyncStorage.clear();
    await safeAsyncStorage.setItem(KEYS.DEVICE_ID, deviceId);
  } catch (error) {
    console.error('Error clearing storage:', error);
    Alert.alert('Error', 'Failed to clear app data. Please try again.');
    throw error;
  }
};

export const storeAppSettings = async (settings: Record<string, any>): Promise<void> => {
  try {
    await safeAsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error storing app settings:', error);
    Alert.alert('Error', 'Failed to save app settings. Please try again.');
    throw error;
  }
};

export const getAppSettings = async (): Promise<Record<string, any> | null> => {
  try {
    const settings = await safeAsyncStorage.getItem(KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting app settings:', error);
    Alert.alert('Error', 'Failed to load app settings. Please try again.');
    return null;
  }
};
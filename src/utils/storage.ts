import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../navigation/types';
import * as Device from 'expo-device';

const STORAGE_KEYS = {
  USER_PROFILE: '@labour_app_user_profile',
  REGISTERED_USERS: '@labour_app_registered_users',
  DEVICE_USER: '@labour_app_device_user'
};

export const storeUserProfile = async (userProfile: UserProfile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));

    // Store in registered users list
    const existingUsers = await getRegisteredUsers();
    const updatedUsers = existingUsers.filter(user => user.phoneNumber !== userProfile.phoneNumber);
    updatedUsers.push(userProfile);
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));

    // Store device association
    const deviceId = await getDeviceId();
    if (deviceId) {
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_USER, JSON.stringify({
        deviceId,
        phoneNumber: userProfile.phoneNumber
      }));
    }
  } catch (error) {
    console.error('Error storing user profile:', error);
  }
};

export const getDeviceId = async (): Promise<string | null> => {
  try {
    const modelName = Device.modelName;
    const brand = Device.brand;
    const osInternalBuildId = Device.osInternalBuildId;
    // Combine multiple device properties to create a more unique identifier
    return `${brand}-${modelName}-${osInternalBuildId}` || null;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // First try to get user by device ID
    const deviceId = await getDeviceId();
    if (deviceId) {
      const deviceUserStr = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_USER);
      if (deviceUserStr) {
        const deviceUser = JSON.parse(deviceUserStr);
        const users = await getRegisteredUsers();
        const userByDevice = users.find(user => user.phoneNumber === deviceUser.phoneNumber);
        if (userByDevice) {
          return userByDevice;
        }
      }
    }

    // Fallback to last logged in user
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getRegisteredUsers = async (): Promise<UserProfile[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

export const checkExistingUser = async (phoneNumber: string): Promise<UserProfile | null> => {
  try {
    const registeredUsers = await getRegisteredUsers();
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;
    return registeredUsers.find(user => user.phoneNumber === formattedPhone) || null;
  } catch (error) {
    console.error('Error checking existing user:', error);
    return null;
  }
};

export const clearDeviceAssociation = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_USER);
  } catch (error) {
    console.error('Error clearing device association:', error);
  }
};

export const logout = async () => {
  try {
    // Clear all user-related data
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    await AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_USER);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

export const deleteAccount = async (phoneNumber: string) => {
  try {
    // Remove from registered users
    const registeredUsers = await getRegisteredUsers();
    const updatedUsers = registeredUsers.filter(user => user.phoneNumber !== phoneNumber);
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));

    // Clear current user profile if it matches
    const currentUser = await getCurrentUser();
    if (currentUser?.phoneNumber === phoneNumber) {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }

    // Clear device association
    await clearDeviceAssociation();

    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
  }
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * Function to test if AsyncStorage is working properly
 */
export async function testAsyncStorage(): Promise<boolean> {
  try {
    const TEST_KEY = 'async_storage_test';
    const TEST_VALUE = 'test_' + Date.now().toString();

    console.log('Testing AsyncStorage...');
    console.log('AsyncStorage available:', AsyncStorage !== null && AsyncStorage !== undefined);

    // Test setItem
    await AsyncStorage.setItem(TEST_KEY, TEST_VALUE);
    console.log('AsyncStorage.setItem successful');

    // Test getItem
    const retrievedValue = await AsyncStorage.getItem(TEST_KEY);
    console.log('AsyncStorage.getItem returned:', retrievedValue);

    // Test if retrieved value matches what we stored
    if (retrievedValue !== TEST_VALUE) {
      console.error('Retrieved value does not match stored value');
      return false;
    }

    // Test removeItem
    await AsyncStorage.removeItem(TEST_KEY);
    console.log('AsyncStorage.removeItem successful');

    // Verify removal
    const shouldBeNull = await AsyncStorage.getItem(TEST_KEY);
    console.log('After removal, value is:', shouldBeNull);

    if (shouldBeNull !== null) {
      console.error('Value should be null after removal');
      return false;
    }

    console.log('AsyncStorage test completed successfully');
    return true;
  } catch (error) {
    console.error('AsyncStorage test failed:', error);
    Alert.alert('AsyncStorage Test', 'Failed: ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}

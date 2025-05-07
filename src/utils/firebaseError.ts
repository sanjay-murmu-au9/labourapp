import { FirebaseError } from 'firebase/app';
import { Alert } from 'react-native';
import { analytics } from '../services/api/queryClient';

export function handleFirebaseError(error: unknown, customMessage?: string): void {
  if (error instanceof FirebaseError) {
    let message = customMessage || 'An error occurred';

    // Map common Firebase error codes to user-friendly messages
    switch (error.code) {
      case 'auth/invalid-phone-number':
        message = 'Please enter a valid phone number';
        break;
      case 'auth/invalid-verification-code':
        message = 'Invalid OTP code. Please try again';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      default:
        // Log unknown errors to analytics in production
        if (!__DEV__) {
          analytics.logEvent('firebase_error', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
        }
    }

    Alert.alert('Error', message);
    console.error('Firebase Error:', error.code, error.message);
  } else if (error instanceof Error) {
    Alert.alert('Error', customMessage || error.message);
    console.error('Non-Firebase Error:', error);
  } else {
    Alert.alert('Error', customMessage || 'An unexpected error occurred');
    console.error('Unknown Error:', error);
  }
}
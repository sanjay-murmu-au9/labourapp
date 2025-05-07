import { QueryClient } from '@tanstack/react-query';
import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { Analytics, getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG } from '../config';
import { Alert, Platform } from 'react-native';
import { withErrorHandling } from '../../utils/errorHandler';

// Initialize Firebase only once
let app: FirebaseApp;
try {
  app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Auth with local persistence
export const auth = initializeAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Initialize analytics with safe fallback
let analyticsInstance: Analytics | null = null;

// Create a safe version of analytics
export const analytics = {
  logEvent: async (eventName: string, eventParams?: Record<string, any>): Promise<void> => {
    if (analyticsInstance) {
      try {
        await logEvent(analyticsInstance, eventName, eventParams);
      } catch (error) {
        if (!__DEV__) {
          console.warn('Analytics error:', error);
        }
      }
    }
  }
};

// Initialize analytics asynchronously
if (Platform.OS !== 'web') {
  isSupported()
    .then(async (supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(app);
        if (__DEV__) {
          console.log('Firebase Analytics initialized successfully');
        }
      }
    })
    .catch(() => {
      // Silently fail if analytics isn't supported
    });
}

// Configure React Query with comprehensive error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404 || error?.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      }
    },
    mutations: {
      retry: false
    }
  },
});
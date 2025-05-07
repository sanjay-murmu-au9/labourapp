import { setupGlobalErrorHandlers, withErrorHandling } from './src/utils/errorHandler';
import './src/utils/hermesErrorHandler';

import React, { useCallback, useEffect, useState } from 'react';
import { View, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store } from './src/store';
import { queryClient } from './src/services/api/queryClient';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { CustomSplashScreen } from './src/components/CustomSplashScreen';
import { UserProfile } from './src/navigation/types';
import { getCurrentUser } from './src/utils/storage';
import { OCCUPATIONS } from './src/utils/constants';

// Initialize error handling as early as possible
setupGlobalErrorHandlers();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  // Error is already handled by global handler
});

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Firebase Analytics is not supported in this environment',
  'IndexedDB unavailable or restricted in this environment',
  'Failed to fetch this Firebase app\'s measurement ID'
]);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialUser, setInitialUser] = useState<UserProfile | null>(null);

  // Use the withErrorHandling wrapper for async operations
  useEffect(() => {
    const prepare = withErrorHandling(async () => {
      try {
        // Get stored user data
        const user = await getCurrentUser();
        if (user) {
          // Validate user data
          if (user.phoneNumber && user.occupation && (
            user.occupation === OCCUPATIONS.LABOUR ||
            user.occupation === OCCUPATIONS.MISTRY ||
            user.occupation === OCCUPATIONS.PROVIDER
          )) {
            setInitialUser(user);
          }
        }
      } finally {
        // Add a small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    });

    prepare();
  }, []);

  const onLayoutRootView = useCallback(
    withErrorHandling(async () => {
      if (!isLoading) {
        await SplashScreen.hideAsync();
      }
    }),
    [isLoading]
  );

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <SafeAreaProvider>
              <AppNavigator initialUser={initialUser} />
            </SafeAreaProvider>
          </View>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

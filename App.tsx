import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { CustomSplashScreen } from './src/components/CustomSplashScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()
  .catch(console.warn);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </View>
  );
}

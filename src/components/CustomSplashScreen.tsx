import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SplashLogo } from './SplashLogo';

export const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <SplashLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#128C7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
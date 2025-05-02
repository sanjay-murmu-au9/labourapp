import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export const SplashLogo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Labour</Text>
      <Text style={[styles.logoText, styles.appText]}>App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appText: {
    color: '#E0E0E0',
  },
});
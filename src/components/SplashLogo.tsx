import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

export const SplashLogo = () => {
  const animationValue = new Animated.Value(0);
  const logoAnimation = new Animated.Value(0);

  useEffect(() => {
    // Worker animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Logo animation
    Animated.spring(logoAnimation, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, []);

  const workerScale = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const logoScale = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const logoOpacity = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* LA Logo */}
        <Animated.View
          style={[
            styles.laLogoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Svg width={150} height={100} viewBox="0 0 150 100">
            {/* L */}
            <Path
              d="M20 10 L20 80 L60 80"
              stroke="#FFFFFF"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* A */}
            <Path
              d="M80 80 L100 10 L120 80 M85 50 L115 50"
              stroke="#FFFFFF"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>

        {/* Animated Construction Worker */}
        <Animated.View style={[styles.workerContainer, { transform: [{ scale: workerScale }] }]}>
          <Svg width={120} height={120} viewBox="0 0 1024 1024">
            <Circle cx="512" cy="512" r="512" fill="#128C7E" opacity={0.1} />
            <G transform="translate(205, 205) scale(0.6)">
              <Path
                d="M512 300 C 462 300, 422 340, 422 390 L 422 420 L 602 420 L 602 390 C 602 340, 562 300, 512 300"
                fill="#FFD700"
              />
              <Circle cx="512" cy="350" r="60" fill="#FFF" />
              <Path
                d="M312 600 C312 600 312 500 512 500 C712 500 712 600 712 600 L712 800 L312 800 Z"
                fill="#2196F3"
              />
              <Path
                d="M250 650 L350 650"
                stroke="#FFD700"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <Path
                d="M674 650 L774 650"
                stroke="#FFD700"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </G>
          </Svg>
        </Animated.View>

        {/* App Name */}
        <View style={styles.textWrapper}>
          <Text style={styles.logoText}>Labour</Text>
          <Text style={[styles.logoText, styles.appText]}>App</Text>
        </View>

        {/* Community Tagline */}
        <Text style={styles.tagline}>Building a Stronger Community Together</Text>
        <Text style={styles.subTagline}>Connect • Work • Grow</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  laLogoContainer: {
    marginBottom: 20,
  },
  laLogoText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  workerContainer: {
    marginBottom: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appText: {
    color: '#E0E0E0',
    marginLeft: 4,
  },
  tagline: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subTagline: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
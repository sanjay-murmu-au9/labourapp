import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main Icon Container */}
      <View style={styles.iconContainer}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="60" fill="#FFFFFF" opacity={0.2} />
          {/* Simple Worker Icon */}
          <Path
            d="M60 30
               C 55 30, 50 35, 50 40
               L 50 43
               L 70 43
               L 70 40
               C 70 35, 65 30, 60 30"
            fill="#FFFFFF"
          />
          <Circle cx="60" cy="35" r="7" fill="#128C7E" />
          <Path
            d="M40 65
               C40 65 40 55 60 55
               C80 55 80 65 80 65
               L80 85 L40 85 Z"
            fill="#FFFFFF"
          />
          {/* Tool */}
          <Path
            d="M35 70 L45 70"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Powered By Text */}
      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered by</Text>
        <Text style={styles.communityText}>Labour Community</Text>
      </View>
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
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, // Added margin to push icon up a bit
  },
  poweredByContainer: {
    position: 'absolute',
    bottom: 60, // Increased from 40 to 60 to move it up a bit
    alignItems: 'center',
    width: '100%', // Added to ensure proper centering
    paddingHorizontal: 20, // Added for safety margins
  },
  poweredByText: {
    color: '#FFFFFF',
    opacity: 0.9, // Increased from 0.8 for better visibility
    fontSize: 16, // Increased from 14
    marginBottom: 8, // Increased from 4 for better spacing
    fontWeight: '400', // Added for better visibility
  },
  communityText: {
    color: '#FFFFFF',
    fontSize: 20, // Increased from 16
    fontWeight: '700', // Increased from 600 for better visibility
    letterSpacing: 0.5, // Added for better readability
  },
});
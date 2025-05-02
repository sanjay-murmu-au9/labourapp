import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface LocationIllustrationProps {
  size?: number;
  color?: string;
  pulseEnabled?: boolean;
}

export const LocationIllustration: React.FC<LocationIllustrationProps> = ({
  size = 200,
  color = '#128C7E',
  pulseEnabled = true,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (pulseEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [pulseEnabled]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* Location Pin Base */}
          <Path
            d="M100 20c-33 0-60 27-60 60 0 33 60 100 60 100s60-67 60-100c0-33-27-60-60-60z"
            fill={color}
          />
          {/* Inner Circle */}
          <Circle cx="100" cy="80" r="20" fill="#fff" />
          {/* Pulse Circles */}
          <Circle cx="100" cy="80" r="40" fill={color} opacity="0.2" />
          <Circle cx="100" cy="80" r="30" fill={color} opacity="0.3" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
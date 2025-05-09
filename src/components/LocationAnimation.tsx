import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

interface LocationAnimationProps {
  size?: number;
}

const { width } = Dimensions.get('window');

export const LocationAnimation: React.FC<LocationAnimationProps> = ({ size = width * 0.6 }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/location-animation.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationAnimation;

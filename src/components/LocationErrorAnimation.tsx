import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

interface LocationErrorAnimationProps {
  size?: number;
}

const { width } = Dimensions.get('window');

export const LocationErrorAnimation: React.FC<LocationErrorAnimationProps> = ({ size = width * 0.4 }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/location-error-animation.json')}
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

export default LocationErrorAnimation;

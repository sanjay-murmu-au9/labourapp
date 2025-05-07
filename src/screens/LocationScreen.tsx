import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { RootStackParamList, UserProfile } from '../navigation/types';
import { storeUserProfile } from '../utils/storage';
import { OCCUPATIONS } from '../utils/constants';

const WHATSAPP_GREEN = '#128C7E';

type LocationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Location'>;
  route: { params: { userProfile: UserProfile } };
};

export const LocationScreen: React.FC<LocationScreenProps> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { userProfile } = route.params;

  const handleLocationError = (message: string) => {
    setError(message);
    setLoading(false);
  };

  const navigateToNextScreen = (updatedProfile: UserProfile) => {
    navigation.replace('Jobs', { userProfile: updatedProfile });
  };

  const getLocation = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        handleLocationError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address && address.length > 0) {
        const formattedAddress = `${address[0].street || ''} ${address[0].city || ''} ${address[0].region || ''} ${address[0].postalCode || ''}`.trim();

        const updatedProfile: UserProfile = {
          ...userProfile,
          location: {
            address: formattedAddress,
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        };

        await storeUserProfile(updatedProfile);
        navigateToNextScreen(updatedProfile);
      } else {
        handleLocationError('Could not determine address');
      }
    } catch (err) {
      console.error('Location error:', err);
      if (retryCount < 2) {
        setTimeout(() => getLocation(retryCount + 1), 1000);
      } else {
        handleLocationError('Failed to get location. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigateToNextScreen(userProfile);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={WHATSAPP_GREEN} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={() => getLocation()}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={WHATSAPP_GREEN} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  retryButton: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
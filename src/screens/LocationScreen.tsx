import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { RootStackParamList, UserProfile } from '../navigation/types';
import { storeUserProfile } from '../utils/storage';
import LocationAnimation from '../components/LocationAnimation';
import LocationErrorAnimation from '../components/LocationErrorAnimation';

const WHATSAPP_GREEN = '#128C7E';

type LocationScreenProps = NativeStackScreenProps<RootStackParamList, 'Location'>;

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
      <Text style={styles.titleText}>Location Services</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LocationAnimation size={200} />
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.subText}>Please wait while we find your current location</Text>
        </View>      ) : error ? (
        <View style={styles.errorContainer}>
          <LocationErrorAnimation size={150} />          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.subText}>Unable to determine your current location</Text>
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
          <LocationAnimation size={200} />
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.subText}>Please wait while we find your current location</Text>
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
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHATSAPP_GREEN,
    marginBottom: 30,
    textAlign: 'center',
  },  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: WHATSAPP_GREEN,
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    marginHorizontal: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  errorText: {
    color: '#E53935',
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    justifyContent: 'center',
  },retryButton: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
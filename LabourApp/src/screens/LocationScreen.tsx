import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type LocationScreenProps = NativeStackScreenProps<RootStackParamList, 'Location'>;

export const LocationScreen: React.FC<LocationScreenProps> = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [showSkip, setShowSkip] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable location permissions in your device settings.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse[0]) {
        const { street, city, region, postalCode } = addressResponse[0];
        const fallbackStreet = addressResponse[0]?.name || addressResponse[0]?.district || 'Unknown Street';
        const fullAddress = `${fallbackStreet}, ${city}, ${region}, ${postalCode}`;
        setAddress(fullAddress);

        // Pass complete userProfile data along with location
        navigation.replace('UserDetails', {
          userProfile: {
            name: userProfile.name,
            phoneNumber: userProfile.phoneNumber,
            occupation: userProfile.occupation,
            location: {
              address: fullAddress,
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            },
          },
        });
      } else {
        setErrorMsg('Unable to fetch address. Please try again later.');
      }
    } catch (error) {
      setErrorMsg('Error fetching location. Please ensure your device has location services enabled and try again.');
    }
  };

  const handleSkip = () => {
    // When skipping, still pass the complete userProfile to UserDetails
    navigation.replace('UserDetails', {
      userProfile: {
        name: userProfile.name,
        phoneNumber: userProfile.phoneNumber,
        occupation: userProfile.occupation,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
        <Image
          source={require('../../assets/pickup-point.png')}
          style={styles.locationImage}
        />
        <Text style={styles.buttonText}>Tap to fetch your location</Text>
      </TouchableOpacity>

      {errorMsg ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : location ? (
        <View style={styles.messageContainer}>
          <Text style={styles.locationText}>{address}</Text>
        </View>
      ) : null}

      {showSkip && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  locationButton: {
    alignItems: 'center',
    padding: 20,
  },
  locationImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  messageContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
});
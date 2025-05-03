import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Linking,
  Platform,
  Alert 
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LocationIllustration } from '../components/LocationIllustration';
import { storeUserProfile } from '../utils/storage';

type LocationScreenProps = NativeStackScreenProps<RootStackParamList, 'Location'>;

export const LocationScreen: React.FC<LocationScreenProps> = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [showSkip, setShowSkip] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  const openLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleLocationError = (message: string) => {
    Alert.alert(
      "Location Access Required",
      message,
      [
        {
          text: "Enter Manually",
          onPress: () => setShowManualInput(true)
        },
        {
          text: "Open Settings",
          onPress: openLocationSettings
        }
      ]
    );
  };

  const getLocation = async () => {
    setIsLocating(true);
    setErrorMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        handleLocationError('Please enable location access to automatically fetch your location.');
        setIsLocating(false);
        setShowSkip(true);
        return;
      }

      const locationEnabled = await Location.hasServicesEnabledAsync();
      if (!locationEnabled) {
        handleLocationError('Please turn on your device location services.');
        setIsLocating(false);
        setShowSkip(true);
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

        const updatedProfile = {
          ...userProfile,
          location: {
            address: fullAddress,
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        };

        await storeUserProfile(updatedProfile);
        navigation.replace('Jobs', { userProfile: updatedProfile });
      } else {
        setErrorMsg('Unable to fetch address. Please enter your location manually.');
        setShowManualInput(true);
      }
    } catch (error) {
      handleLocationError('Error accessing location. Please ensure location services are enabled.');
      setShowSkip(true);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getLocation();
    
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualSubmit = async () => {
    if (manualAddress.trim().length < 5) {
      Alert.alert('Invalid Address', 'Please enter a valid address with more details');
      return;
    }

    const updatedProfile = {
      ...userProfile,
      location: {
        address: manualAddress,
        coordinates: {
          // Default to center of India when coordinates aren't available
          latitude: 20.5937,
          longitude: 78.9629,
        },
      },
    };

    await storeUserProfile(updatedProfile);
    navigation.replace('Jobs', { userProfile: updatedProfile });
  };

  const handleSkip = async () => {
    await storeUserProfile(userProfile);
    navigation.replace('Jobs', { userProfile });
  };

  return (
    <View style={styles.container}>
      {showManualInput ? (
        <View style={styles.manualInputContainer}>
          <Text style={styles.title}>Enter Your Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full address"
            value={manualAddress}
            onChangeText={setManualAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <TouchableOpacity 
            style={[styles.submitButton, manualAddress.trim().length < 5 && styles.submitButtonDisabled]}
            onPress={handleManualSubmit}
            disabled={manualAddress.trim().length < 5}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setShowManualInput(false);
            getLocation();
          }}>
            <MaterialIcons name="my-location" size={20} color="#128C7E" />
            <Text style={styles.retryButtonText}>Try Automatic Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <LocationIllustration
            size={200}
            color="#128C7E"
            pulseEnabled={!location && !isLocating}
          />
          <Text style={styles.messageText}>
            {isLocating 
              ? 'Fetching your location...' 
              : errorMsg 
                ? errorMsg 
                : location 
                  ? address 
                  : 'Preparing location services...'}
          </Text>
        </View>
      )}

      {showSkip && !showManualInput && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <MaterialIcons name="close" size={24} color="#666" />
          <Text style={styles.skipText}>Skip</Text>
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
  messageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  manualInputContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#128C7E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  retryButtonText: {
    color: '#128C7E',
    fontSize: 16,
    marginLeft: 8,
  },
});
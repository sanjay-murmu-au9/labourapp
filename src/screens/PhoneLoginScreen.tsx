import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const WHATSAPP_GREEN = '#128C7E';

type PhoneLoginScreenProps = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      // TODO: Integrate actual phone verification
      navigation.navigate('OTPVerification', { phoneNumber });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>
          LabourApp will send an SMS message to verify your phone number.
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.phoneInput}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            phoneNumber.length >= 10 && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          disabled={phoneNumber.length < 10}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: WHATSAPP_GREEN,
    marginHorizontal: 30,
  },
  countryCode: {
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#1a1a1a',
  },
  continueButton: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    opacity: 0.7,
  },
  continueButtonActive: {
    backgroundColor: WHATSAPP_GREEN,
    opacity: 1,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneLoginScreen;
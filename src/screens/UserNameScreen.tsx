import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const WHATSAPP_GREEN = '#128C7E';

type UserNameScreenProps = NativeStackScreenProps<RootStackParamList, 'UserName'>;

const UserNameScreen: React.FC<UserNameScreenProps> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim().length >= 3) {
      navigation.navigate('Occupation', { name, phoneNumber });
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
        <Text style={styles.title}>Enter your name</Text>
        <Text style={styles.subtitle}>
          Please provide your full name
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            name.trim().length >= 3 && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          disabled={name.trim().length < 3}
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
  input: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: WHATSAPP_GREEN,
    marginHorizontal: 30,
    color: '#1a1a1a',
  },
  continueButton: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    opacity: 0.7,
    width: '80%',
  },
  continueButtonActive: {
    backgroundColor: WHATSAPP_GREEN,
    opacity: 1,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserNameScreen;
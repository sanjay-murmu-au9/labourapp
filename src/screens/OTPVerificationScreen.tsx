import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getCurrentUser } from '../utils/storage';
import { withErrorHandling } from '../utils/errorHandler';
import { OCCUPATIONS } from '../utils/constants';

const WHATSAPP_GREEN = '#128C7E';
const OTP_LENGTH = 6;

type OTPVerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = withErrorHandling(async () => {
    if (otp.length !== OTP_LENGTH || isVerifying) return;

    setIsVerifying(true);
    try {
      const existingUser = await getCurrentUser();

      if (existingUser && (
        existingUser.occupation === OCCUPATIONS.LABOUR ||
        existingUser.occupation === OCCUPATIONS.MISTRY
      )) {
        navigation.replace('Jobs', { userProfile: existingUser });
      } else {
        navigation.replace('UserName', { phoneNumber });
      }
    } finally {
      setIsVerifying(false);
    }
  });

  const handleResendOTP = withErrorHandling(async () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp('');
    // Add your OTP resend logic here
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code we sent to{'\n'}
          +91 {phoneNumber}
        </Text>

        <View style={styles.otpContainer}>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, '');
              if (cleaned.length <= OTP_LENGTH) {
                setOtp(cleaned);
              }
            }}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            placeholder="- - - - - -"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.length === OTP_LENGTH && styles.verifyButtonActive
          ]}
          onPress={handleVerify}
          disabled={otp.length !== OTP_LENGTH || isVerifying}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResendOTP}
          disabled={timer > 0}
        >
          <Text style={[
            styles.resendText,
            timer > 0 && styles.resendTextDisabled
          ]}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    marginTop: 50,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  otpContainer: {
    marginVertical: 30,
    width: '80%',
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 20,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    color: '#1a1a1a',
  },
  verifyButton: {
    backgroundColor: '#cccccc',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    opacity: 0.7,
    width: '80%',
  },
  verifyButtonActive: {
    backgroundColor: WHATSAPP_GREEN,
    opacity: 1,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    color: WHATSAPP_GREEN,
    fontSize: 14,
  },
  resendTextDisabled: {
    color: '#666',
  },
});

export default OTPVerificationScreen;
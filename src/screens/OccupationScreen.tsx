import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { OCCUPATIONS } from '../utils/constants';

const WHATSAPP_GREEN = '#128C7E';

type OccupationScreenProps = NativeStackScreenProps<RootStackParamList, 'Occupation'>;

const OccupationScreen: React.FC<OccupationScreenProps> = ({ route, navigation }) => {
  const { name, phoneNumber } = route.params;

  const handleOptionPress = (occupation: typeof OCCUPATIONS[keyof typeof OCCUPATIONS]) => {
    navigation.navigate('Location', {
      userProfile: {
        name,
        phoneNumber,
        occupation,
      },
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Choose your role</Text>
        <Text style={styles.subtitle}>Select how you want to use the app</Text>

        <View style={styles.optionsContainer}>
          {/* Labour Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionPress(OCCUPATIONS.LABOUR)}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionNumber}>1</Text>
                <Text style={styles.optionTitle}>I'm a Labour</Text>
              </View>
              <Text style={styles.optionDescription}>
                Looking for daily wage work opportunities
              </Text>
            </View>
          </TouchableOpacity>

          {/* Mistry Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionPress(OCCUPATIONS.MISTRY)}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionNumber}>2</Text>
                <Text style={styles.optionTitle}>I'm a Mistry</Text>
              </View>
              <Text style={styles.optionDescription}>
                Skilled construction professional seeking projects
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Hiring Option */}
          <TouchableOpacity
            style={[styles.optionCard, styles.hiringCard]}
            onPress={() => handleOptionPress(OCCUPATIONS.PROVIDER)}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <Text style={[styles.optionNumber, styles.hiringNumber]}>3</Text>
                <Text style={[styles.optionTitle, styles.hiringTitle]}>I Want to Hire</Text>
              </View>
              <Text style={[styles.optionDescription, styles.hiringDescription]}>
                Find and hire workers for your project
              </Text>
              <View style={styles.workerTypes}>
                <Text style={styles.workerType}>✓ Daily wage workers</Text>
                <Text style={styles.workerType}>✓ Skilled construction professionals</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: WHATSAPP_GREEN,
  },
  hiringCard: {
    backgroundColor: WHATSAPP_GREEN,
    borderWidth: 0,
  },
  optionContent: {
    gap: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WHATSAPP_GREEN,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  hiringNumber: {
    backgroundColor: '#fff',
    color: WHATSAPP_GREEN,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  hiringTitle: {
    color: '#fff',
  },
  optionDescription: {
    fontSize: 15,
    color: '#666',
    marginLeft: 44,
  },
  hiringDescription: {
    color: '#fff',
    opacity: 0.9,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  workerTypes: {
    marginTop: 8,
    marginLeft: 44,
  },
  workerType: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.9,
  },
});

export default OccupationScreen;
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

const WHATSAPP_GREEN = '#128C7E';

type OccupationScreenProps = NativeStackScreenProps<RootStackParamList, 'Occupation'>;

const OccupationScreen: React.FC<OccupationScreenProps> = ({ route, navigation }) => {
  const { name, phoneNumber } = route.params;

  const handleOptionPress = (selectedOccupation: string) => {
    navigation.navigate('Location', {
      userProfile: {
        name,
        phoneNumber,
        occupation: selectedOccupation,
      },
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Role</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress("I'M LABOUR")}
          >
            <Text style={styles.optionButtonText}>I'M LABOUR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress("I'M MISTRY")}
          >
            <Text style={styles.optionButtonText}>I'M MISTRY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress("I NEED LABOUR")}
          >
            <Text style={styles.optionButtonText}>I NEED LABOUR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress("I NEED MISTRY")}
          >
            <Text style={styles.optionButtonText}>I NEED MISTRY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleOptionPress("I NEED LABOUR/MISTRY")}
          >
            <Text style={styles.optionButtonText}>I NEED LABOUR/MISTRY</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: WHATSAPP_GREEN,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OccupationScreen;
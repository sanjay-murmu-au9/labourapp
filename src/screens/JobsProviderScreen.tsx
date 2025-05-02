import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const WHATSAPP_GREEN = '#128C7E';

type JobsProviderScreenProps = NativeStackScreenProps<RootStackParamList, 'JobsProvider'>;

export const JobsProviderScreen: React.FC<JobsProviderScreenProps> = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [jobTitle, setJobTitle] = useState('');
  const [wage, setWage] = useState('');
  const [location, setLocation] = useState(userProfile.location?.address || '');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const jobTypes = ['MASONRY', 'CARPENTER', 'PAINTER', 'LABOUR'];

  const handlePost = () => {
    if (!jobTitle || !wage || !location || !description || !selectedType) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    // TODO: Implement actual job posting logic
    Alert.alert(
      'Success',
      'Job posted successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="Enter job title"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Daily Wage (₹)</Text>
        <TextInput
          style={styles.input}
          value={wage}
          onChangeText={setWage}
          placeholder="Enter daily wage"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter work location"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Job Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeContainer}
          contentContainerStyle={styles.typeContent}
        >
          {jobTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedType,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === type && styles.selectedTypeText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter job description"
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>POST JOB</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    marginVertical: 10,
  },
  typeContent: {
    paddingVertical: 5,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedType: {
    backgroundColor: WHATSAPP_GREEN,
  },
  typeButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  selectedTypeText: {
    color: '#fff',
  },
  postButton: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
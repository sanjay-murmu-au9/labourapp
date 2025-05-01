import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const WHATSAPP_GREEN = '#128C7E';

type JobsScreenProps = NativeStackScreenProps<RootStackParamList, 'Jobs'>;

interface Job {
  id: string;
  title: string;
  wage: number;
  distance: number;
  location: string;
  description: string;
  type: string;
}

const JobsScreen: React.FC<JobsScreenProps> = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const jobTypes = ['ALL', 'MASONRY', 'CARPENTER', 'PAINTER', 'LABOUR'];

  const jobs: Job[] = [
    {
      id: '1',
      title: 'MASONRY WORK',
      wage: 500,
      distance: 1,
      location: 'Construction Site',
      description: 'Need experienced mason for construction work',
      type: 'MASONRY',
    },
    {
      id: '2',
      title: 'CARPENTER NEEDED',
      wage: 700,
      distance: 2,
      location: 'Residential Project',
      description: 'Skilled carpenter required for woodwork',
      type: 'CARPENTER',
    },
    {
      id: '3',
      title: 'PAINTER REQUIRED',
      wage: 500,
      distance: 3,
      location: 'Office Renovation',
      description: 'Professional painter needed for office renovation',
      type: 'PAINTER',
    },
    {
      id: '4',
      title: 'CONSTRUCTION LABOUR',
      wage: 400,
      distance: 1.5,
      location: 'Building Site',
      description: 'General labour work at construction site',
      type: 'LABOUR',
    },
  ];

  const filteredJobs = selectedFilter && selectedFilter !== 'ALL'
    ? jobs.filter(job => job.type === selectedFilter)
    : jobs;

  const handleApply = (jobId: string) => {
    // TODO: Implement job application logic
    console.log(`Applied for job ${jobId}`);
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.wage}>₹{item.wage} per day</Text>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={16} color={WHATSAPP_GREEN} />
          <Text style={styles.detailText}>{item.location}</Text>
          <Text style={styles.distance}>{item.distance} km away</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => handleApply(item.id)}
      >
        <Text style={styles.applyButtonText}>APPLY</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Jobs</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {jobTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedFilter === type && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(type)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === type && styles.filterButtonTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: WHATSAPP_GREEN,
  },
  filterButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  jobsList: {
    padding: 15,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  wage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHATSAPP_GREEN,
  },
  jobDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  applyButton: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default JobsScreen;
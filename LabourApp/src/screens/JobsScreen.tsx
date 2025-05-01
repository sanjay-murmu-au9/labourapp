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
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

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

  const filteredJobs = selectedFilter === 'ALL'
    ? jobs
    : jobs.filter(job => job.type === selectedFilter);

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

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
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
      </View>

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
  filterWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    minWidth: 70,
    maxWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: WHATSAPP_GREEN,
  },
  filterButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 13,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  jobsList: {
    padding: 12,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  wage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: WHATSAPP_GREEN,
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  distance: {
    fontSize: 13,
    color: '#666',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  applyButton: {
    backgroundColor: WHATSAPP_GREEN,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default JobsScreen;
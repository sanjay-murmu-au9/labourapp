import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { WorkerList } from '../components/WorkerList';

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
  const [activeTab, setActiveTab] = useState<'jobs' | 'workers'>('jobs');

  const isJobProvider = userProfile.occupation === "I NEED LABOUR/MISTRY";
  const isWorkerOrMistry = ["I'M LABOUR", "I'M MISTRY"].includes(userProfile.occupation);

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

  const workers = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      occupation: 'MASONRY',
      experience: '5 years',
      rating: 4.5,
      phone: '+919876543210',
      location: 'Ranchi, Jharkhand',
      distance: 2.5,
    },
    {
      id: '2',
      name: 'Sunil Mistry',
      occupation: 'CARPENTER',
      experience: '8 years',
      rating: 4.8,
      phone: '+919876543211',
      location: 'Hatia, Ranchi',
      distance: 3.2,
    },
    {
      id: '3',
      name: 'Amit Singh',
      occupation: 'PAINTER',
      experience: '3 years',
      rating: 4.0,
      phone: '+919876543212',
      location: 'Doranda, Ranchi',
      distance: 1.8,
    },
    {
      id: '4',
      name: 'Raju Sharma',
      occupation: 'LABOUR',
      experience: '4 years',
      rating: 4.2,
      phone: '+919876543213',
      location: 'Kanke, Ranchi',
      distance: 4.0,
    },
  ];

  const filteredJobs = selectedFilter === 'ALL'
    ? jobs
    : jobs.filter(job => job.type === selectedFilter);

  const handleApply = (jobId: string) => {
    console.log(`Applied for job ${jobId}`);
  };

  const handleCall = (worker: any) => {
    Linking.openURL(`tel:${worker.phone}`);
  };

  const handlePostJob = () => {
    navigation.navigate('JobsProvider', { userProfile });
  };

  const handleEditProfile = () => {
    navigation.navigate('UserDetails', { userProfile });
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

      {isWorkerOrMistry && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(item.id)}
        >
          <Text style={styles.applyButtonText}>APPLY</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'jobs' ? 'Available Jobs' : 'Available Workers'}
        </Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleEditProfile}>
          <Icon name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workers' && styles.activeTab]}
          onPress={() => setActiveTab('workers')}
        >
          <Text style={[styles.tabText, activeTab === 'workers' && styles.activeTabText]}>
            Workers
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'workers' ? (
        <WorkerList
          workers={workers}
          onCall={handleCall}
          userType={isJobProvider ? 'PROVIDER' : 'WORKER'}
        />
      ) : (
        <>
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
        </>
      )}

      {isJobProvider && (
        <TouchableOpacity style={styles.fabButton} onPress={handlePostJob}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Post a Job</Text>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: WHATSAPP_GREEN,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: WHATSAPP_GREEN,
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
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: WHATSAPP_GREEN,
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default JobsScreen;
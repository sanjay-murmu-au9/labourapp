import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Icon } from 'react-native-elements';

const WHATSAPP_GREEN = '#128C7E';

interface Worker {
  id: string;
  name: string;
  occupation: string;
  experience: string;
  rating: number;
  phone: string;
  location: string;
  distance: number;
  totalJobs?: number;
  activeMonths?: number;
  avatar?: string;
}

interface WorkerListProps {
  workers: Worker[];
  onCall?: (worker: Worker) => void;
  userType: 'PROVIDER' | 'WORKER';
}

export const WorkerList: React.FC<WorkerListProps> = ({ workers, onCall, userType }) => {
  const renderRatingStars = (rating: number) => (
    <View style={styles.ratingContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index}>
          <Icon
            name="star"
            size={16}
            color={index < rating ? '#FFD700' : '#D3D3D3'}
          />
        </View>
      ))}
    </View>
  );

  const renderWorkerCard = ({ item }: { item: Worker }) => (
    <View style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <View style={styles.workerInfo}>
          <Image
            source={
              item.avatar
                ? { uri: item.avatar }
                : require('../../assets/icon.png')
            }
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.occupation}>{item.occupation}</Text>
          </View>
        </View>
        {userType === 'PROVIDER' ? (
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => onCall?.(item)}
          >
            <Icon name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>CALL</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{item.totalJobs || '50+'}</Text>
            <Text style={styles.statsLabel}>Jobs</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Icon name="work" size={16} color={WHATSAPP_GREEN} />
          <Text style={styles.detailText}>Experience: {item.experience}</Text>
        </View>
        <View style={styles.detail}>
          <Icon name="location-on" size={16} color={WHATSAPP_GREEN} />
          <Text style={styles.detailText}>
            {userType === 'PROVIDER' ? item.location : item.location.split(',')[1]?.trim() || 'Ranchi'}
          </Text>
          {userType === 'PROVIDER' && (
            <Text style={styles.distance}>{item.distance} km away</Text>
          )}
        </View>
        <View style={styles.ratingRow}>
          {renderRatingStars(item.rating)}
          {userType === 'WORKER' && (
            <Text style={styles.membershipText}>
              Member for {item.activeMonths || '6+'} months
            </Text>
          )}
        </View>
      </View>

      {userType === 'WORKER' && (
        <View style={styles.engagementContainer}>
          <View style={styles.badgeContainer}>
            <Icon name="verified" size={16} color={WHATSAPP_GREEN} />
            <Text style={styles.badgeText}>Verified Worker</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Icon name="thumb-up" size={16} color={WHATSAPP_GREEN} />
            <Text style={styles.badgeText}>Top Rated</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={workers}
      renderItem={renderWorkerCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
  },
  workerCard: {
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
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  occupation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callButton: {
    backgroundColor: WHATSAPP_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHATSAPP_GREEN,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membershipText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  engagementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: WHATSAPP_GREEN,
    marginLeft: 4,
    fontWeight: '500',
  },
});
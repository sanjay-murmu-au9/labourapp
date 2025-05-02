import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Icon } from 'react-native-elements';

type UserDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'UserDetails'>;

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title: string;
}

const EditModal: React.FC<EditModalProps> = ({ visible, onClose, onSave, value: initialValue, title }) => {
  const [value, setValue] = useState(initialValue);

  // Reset value when modal reopens with new initialValue
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.modalInput}
            value={value}
            onChangeText={setValue}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({ route, navigation }) => {
  const [userProfile, setUserProfile] = useState(route.params.userProfile);
  const [editField, setEditField] = useState<'name' | 'location' | null>(null);

  const handleEdit = (field: 'name' | 'location') => {
    setEditField(field);
  };

  const handleSave = (value: string) => {
    if (editField) {
      setUserProfile(prev => ({
        ...prev,
        [editField]: editField === 'location' && prev.location
          ? { ...prev.location, address: value }
          : editField === 'location'
          ? { address: value }
          : value
      }));
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    return phone.startsWith('+91') ? phone : `+91 ${phone.slice(0, 5)}-${phone.slice(5)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{userProfile.name}</Text>
            <TouchableOpacity onPress={() => handleEdit('name')}>
              <Icon name="edit" size={20} color="#128C7E" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {formatPhoneNumber(userProfile.phoneNumber)}
            </Text>
            <Icon name="lock" size={20} color="#999" />
          </View>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.label}>Occupation</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{userProfile.occupation}</Text>
            <Icon name="lock" size={20} color="#999" />
          </View>
        </View>

        {userProfile.location && (
          <View style={styles.profileItem}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{userProfile.location.address}</Text>
              <TouchableOpacity onPress={() => handleEdit('location')}>
                <Icon name="edit" size={20} color="#128C7E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <EditModal
        visible={!!editField}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        value={
          editField === 'location'
            ? userProfile.location?.address || ''
            : editField
              ? userProfile[editField] || ''
              : ''
        }
        title={`Edit ${editField?.charAt(0).toUpperCase()}${editField?.slice(1) || ''}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#128C7E',
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    padding: 20,
  },
  profileItem: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#128C7E',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 10,
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#128C7E',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default UserDetailsScreen;
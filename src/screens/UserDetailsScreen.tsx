import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Icon } from 'react-native-elements';
import { storeUserProfile, logout, deleteAccount } from '../utils/storage';
import * as ImagePicker from 'expo-image-picker';

type UserDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'UserDetails'>;

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title: string;
  type?: 'text' | 'select';
  options?: string[];
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  value: initialValue,
  title,
  type = 'text',
  options = []
}) => {
  const [value, setValue] = useState(initialValue);

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
          {type === 'select' ? (
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    value === option && styles.selectedOption
                  ]}
                  onPress={() => {
                    setValue(option);
                    onSave(option);
                    onClose();
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              style={styles.modalInput}
              value={value}
              onChangeText={setValue}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          )}
          {type === 'text' && (
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
          )}
        </View>
      </View>
    </Modal>
  );
};

const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({ route, navigation }) => {
  const [userProfile, setUserProfile] = useState({
    ...route.params.userProfile,
    gender: route.params.userProfile.gender || 'Male' // Set default gender as Male
  });
  const [editField, setEditField] = useState<'name' | 'location' | 'language' | 'gender' | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to upload profile pictures!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const updatedProfile = {
          ...userProfile,
          profileImage: result.assets[0].uri
        };
        setUserProfile(updatedProfile);
        await storeUserProfile(updatedProfile);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleEdit = (field: 'name' | 'location' | 'language' | 'gender') => {
    setEditField(field);
  };

  const handleSave = async (value: string) => {
    if (editField) {
      const updatedProfile = {
        ...userProfile,
        [editField]: editField === 'location'
          ? {
              ...(userProfile.location || {}),
              address: value,
              coordinates: userProfile.location?.coordinates || {
                latitude: 20.5937,
                longitude: 78.9629,
              }
            }
          : value
      };

      setUserProfile(updatedProfile);
      await storeUserProfile(updatedProfile);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    return phone.startsWith('+91') ? phone : `+91 ${phone.slice(0, 5)}-${phone.slice(5)}`;
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            const success = await logout();
            if (success) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'PhoneLogin' }],
              });
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAccount(userProfile.phoneNumber);
            if (success) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'PhoneLogin' }],
              });
            } else {
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            {userProfile.profileImage ? (
              <Image
                source={{ uri: userProfile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultImageContainer}>
                <Icon name="person" size={50} color="#128C7E" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Icon name="camera-alt" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

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

          <View style={styles.profileItem}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{userProfile.language || 'Hindi'}</Text>
              <TouchableOpacity onPress={() => handleEdit('language')}>
                <Icon name="edit" size={20} color="#128C7E" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{userProfile.gender || 'Not specified'}</Text>
              <TouchableOpacity onPress={() => handleEdit('gender')}>
                <Icon name="edit" size={20} color="#128C7E" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.profileItem, styles.locationItem]}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.valueContainer}>
              <View style={styles.locationValueContainer}>
                <Icon name="location-on" size={20} color="#128C7E" style={styles.locationIcon} />
                <Text style={[styles.value, styles.locationValue]}>
                  {userProfile.location?.address || 'Set your location'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit('location')}
                style={styles.editButton}
              >
                <Icon name="edit" size={20} color="#128C7E" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteAccountLink}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>Delete my account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <EditModal
        visible={!!editField}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        value={
          editField === 'location'
            ? userProfile.location?.address || ''
            : editField === 'language'
            ? userProfile.language || 'Hindi'
            : editField === 'gender'
            ? userProfile.gender || ''
            : editField
              ? userProfile[editField] || ''
              : ''
        }
        title={`Edit ${editField?.charAt(0).toUpperCase()}${editField?.slice(1) || ''}`}
        type={editField === 'gender' ? 'select' : 'text'}
        options={editField === 'gender' ? ['Male', 'Female', 'Other'] : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#128C7E',
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
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#128C7E',
  },
  defaultImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#128C7E',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#128C7E',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileSection: {
    padding: 12,
    paddingBottom: 20,
    flex: 1,
  },
  profileItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 6,
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
  deleteAccountLink: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 8,
  },
  deleteAccountText: {
    color: '#dc3545',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionsContainer: {
    marginVertical: 10,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#128C7E',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationItem: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationValue: {
    flex: 1,
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
});

export default UserDetailsScreen;
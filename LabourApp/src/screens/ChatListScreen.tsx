import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ChatUser } from '../navigation/types';

type ChatListScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC<ChatListScreenProps> = ({ route, navigation }) => {
  const { userProfile } = route.params || {};

  const chats: ChatUser[] = [
    {
      id: '1',
      name: 'John Doe',
      message: 'Hey, are you available for work?',
      time: '10:30 AM',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Alice Smith',
      message: 'Need a carpenter for tomorrow',
      time: '9:45 AM',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Bob Wilson',
      message: 'How much do you charge per hour?',
      time: 'Yesterday',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      message: 'The work was great, thank you!',
      time: 'Yesterday',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: '5',
      name: 'Mike Brown',
      message: 'Are you free this weekend?',
      time: 'Yesterday',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    }
  ];

  return (
    <View style={styles.container}>
      {/* {userProfile?.location && (
        <View style={styles.locationBanner}>
          <Text style={styles.locationText}>📍 {userProfile.location.address}</Text>
        </View>
      )} */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => navigation.navigate('Chat', { user: item })}
            bottomDivider
          >
            <Avatar rounded source={{ uri: item.avatar }} />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Subtitle right>{item.time}</ListItem.Subtitle>
          </ListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  locationBanner: {
    backgroundColor: '#e7f3f1',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationText: {
    color: '#128C7E',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ChatListScreen;
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
      name: 'Rajesh Kumar',
      message: 'Hey, are you available for work?',
      time: '10:30 AM',
      avatar: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?q=80&w=200&h=200',
    },
    {
      id: '2',
      name: 'Sunil Mistry',
      message: 'Need a carpenter for tomorrow',
      time: '9:45 AM',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200',
    },
    {
      id: '3',
      name: 'Amit Singh',
      message: 'How much do you charge per hour?',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=200&h=200',
    },
    {
      id: '4',
      name: 'Raju Sharma',
      message: 'The work was great, thank you!',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=200&h=200',
    },
    {
      id: '5',
      name: 'Sanjay Murmu',
      message: 'Are you free this weekend?',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1569493086584-33e0b36f3145?q=80&w=200&h=200',
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
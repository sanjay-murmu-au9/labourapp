import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import { Message } from '../components/Message';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const WHATSAPP_GREEN = '#128C7E';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { user } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey, are you available for work?',
      sender: 'them' as const,
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'Yes, I am. What kind of work do you need?',
      sender: 'me' as const,
      timestamp: '10:31 AM',
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: message,
          sender: 'me' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={{
          icon: 'arrow-back',
          onPress: () => navigation.goBack(),
          color: '#fff',
        }}
        centerComponent={{
          text: user.name,
          style: styles.headerText
        }}
        containerStyle={styles.header}
      />
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={message.trim() ? WHATSAPP_GREEN : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: WHATSAPP_GREEN,
    borderBottomWidth: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
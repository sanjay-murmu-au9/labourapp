import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageProps {
  message: {
    text: string;
    sender: 'me' | 'them';
    timestamp: string;
  };
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isMyMessage = message.sender === 'me';

  return (
    <View style={[
      styles.messageContainer,
      isMyMessage ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={[
        styles.messageText,
        isMyMessage ? styles.myMessageText : styles.theirMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  myMessageText: {
    color: '#000',
  },
  theirMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
});
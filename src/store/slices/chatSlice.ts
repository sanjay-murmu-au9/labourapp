import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ChatUser } from '../../navigation/types';

interface Message {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: number;
  read: boolean;
}

interface ChatState {
  conversations: Record<string, Message[]>;
  activeChat: string | null;
  loading: boolean;
  error: string | null;
  unreadCounts: Record<string, number>;
}

const initialState: ChatState = {
  conversations: {},
  activeChat: null,
  loading: false,
  error: null,
  unreadCounts: {},
};

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId: string) => {
    // Will be replaced with Firebase Realtime Database
    const response = await fetch(`/api/chats/${chatId}/messages`);
    return response.json();
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: Omit<Message, 'id' | 'timestamp'>) => {
    // Will be replaced with Firebase Realtime Database
    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
    return response.json();
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.conversations[chatId]) {
        state.conversations[chatId] = [];
      }
      state.conversations[chatId].push(message);

      // Update unread count if not active chat
      if (state.activeChat !== chatId) {
        state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
      }
    },
    markAsRead: (state, action) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.conversations[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.conversations[chatId]) {
          state.conversations[chatId] = [];
        }
        state.conversations[chatId].push(message);
      });
  },
});

export const { setActiveChat, addMessage, markAsRead } = chatSlice.actions;
export default chatSlice.reducer;
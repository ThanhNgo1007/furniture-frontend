import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import type { ChatHistoryResponse, ChatState, Conversation, Message } from "../types/chatTypes";

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
  connected: false,
  typing: false,
  isOpen: false,  // Control widget visibility
};

const API_URL = "/api/chat";

// Fetch all conversations
export const fetchConversations = createAsyncThunk<Conversation[], string>(
  "chat/fetchConversations",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get<Conversation[]>(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch conversations");
    }
  }
);

// Fetch chat history for a conversation
export const fetchChatHistory = createAsyncThunk<
  ChatHistoryResponse,
  { conversationId: number; jwt: string; page?: number; size?: number }
>(
  "chat/fetchChatHistory",
  async ({ conversationId, jwt, page = 0, size = 30 }, { rejectWithValue }) => {
    try {
      const response = await api.get<ChatHistoryResponse>(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { page, size },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat history");
    }
  }
);

// Create a new conversation
export const createConversation = createAsyncThunk<
  Conversation,
  { sellerId: number; orderId?: number; productId?: number; jwt: string }
>(
  "chat/createConversation",
  async ({ sellerId, orderId, productId, jwt }, { dispatch, rejectWithValue }) => {
    try {
      const params: Record<string, number> = { sellerId };
      if (orderId) params.orderId = orderId;
      if (productId) params.productId = productId;

      const response = await api.post<Conversation>(
        `${API_URL}/conversations`,
        null,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params,
        }
      );

      // Immediately fetch messages to get any system-generated messages (like product cards)
      dispatch(fetchChatHistory({ conversationId: response.data.id, jwt }));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create conversation");
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk<
  void,
  { conversationId: number; jwt: string }
>(
  "chat/markMessagesAsRead",
  async ({ conversationId, jwt }, { rejectWithValue }) => {
    try {
      await api.put(`${API_URL}/conversations/${conversationId}/read`, null, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to mark messages as read");
    }
  }
);

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk<number, string>(
  "chat/fetchUnreadCount",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get<{ unreadCount: number }>(`${API_URL}/unread-count`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data.unreadCount;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch unread count");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add a new message to the current conversation
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      // Add to messages if it's for the current conversation
      // Use loose equality to handle potential string/number mismatch from JSON
      if (state.currentConversation?.id == message.conversationId) {
        // Avoid duplicates
        const exists = state.messages.some((m: Message) => m.id === message.id);
        if (!exists) {
          state.messages.push(message);
        }
      }

      // Update conversation's last message preview
      const convIndex = state.conversations.findIndex((c: Conversation) => c.id === message.conversationId);
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessagePreview =
          message.content.length > 50 ? message.content.substring(0, 47) + "..." : message.content;
        state.conversations[convIndex].lastMessageAt = message.createdAt;

        // Move conversation to top
        const [conversation] = state.conversations.splice(convIndex, 1);
        state.conversations.unshift(conversation);
      }
    },

    // Set current conversation
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
      if (action.payload === null) {
        state.messages = [];
      }
    },

    // Set WebSocket connection status
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },

    // Set typing indicator
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.typing = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set chat widget open/closed
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    // Mark all messages in current conversation as read (for read receipt handling)
    // When SELLER reads the conversation, USER's messages are now read -> senderType "USER" should be marked
    // When USER reads the conversation, SELLER's messages are now read -> senderType "SELLER" should be marked
    markMessagesAsReadLocally: (state, action: PayloadAction<{ conversationId: number; readAt: string; readBy?: string }>) => {
      const { conversationId, readAt, readBy } = action.payload;
      if (state.currentConversation?.id === conversationId) {
        // readBy tells us who read the messages
        // If SELLER read, then USER's sent messages are read (senderType = "USER")
        // If USER read, then SELLER's sent messages are read (senderType = "SELLER")
        const senderTypeToMark = readBy === "SELLER" ? "USER" : "SELLER";

        state.messages = state.messages.map((msg) => {
          if (msg.senderType === senderTypeToMark && !msg.isRead) {
            return {
              ...msg,
              isRead: true,
              readAt: readAt,
            };
          }
          return msg;
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch chat history
    builder.addCase(fetchChatHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<ChatHistoryResponse>) => {
      // Reverse messages to show oldest first
      state.messages = action.payload.messages.reverse();
      state.loading = false;
    });
    builder.addCase(fetchChatHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create conversation
    builder.addCase(createConversation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createConversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
      state.loading = false;
      const newConversation = action.payload;

      // Check if conversation already exists in list
      const existingIndex = state.conversations.findIndex(c => c.id === newConversation.id);

      if (existingIndex !== -1) {
        // Update existing conversation (e.g. product context changed)
        state.conversations[existingIndex] = newConversation;
      } else {
        // Add new conversation to top
        state.conversations.unshift(newConversation);
      }

      state.currentConversation = newConversation;
      // Only clear messages if it's a completely new conversation
      if (existingIndex === -1) {
        state.messages = [];
      } else {
        // If existing, we might want to refresh to get latest messages including any system msgs about product
        // But for now let's keep existing messages to avoid flicker, the component will fetch if needed
      }
      state.isOpen = true; // Auto open chat
    });
    builder.addCase(createConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch unread count
    builder.addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    });
  },
});

export const {
  addMessage,
  setCurrentConversation,
  setConnected,
  setTyping,
  clearError,
  setIsOpen,
  markMessagesAsReadLocally,
} = chatSlice.actions;

export default chatSlice.reducer;

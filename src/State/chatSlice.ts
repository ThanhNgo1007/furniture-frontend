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
  { conversationId: number },
  { conversationId: number; jwt: string }
>(
  "chat/markMessagesAsRead",
  async ({ conversationId, jwt }, { rejectWithValue }) => {
    try {
      await api.put(`${API_URL}/conversations/${conversationId}/read`, null, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return { conversationId };
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
    // When we receive read receipt from the OTHER party, we mark OUR OWN sent messages as "read"
    // - If readBy = "SELLER" (seller read the chat), then USER's messages sent TO seller are now read
    //   BUT from USER's perspective, their own messages (USER type) should show "Đã xem" 
    // - If readBy = "USER" (user read the chat), then SELLER's messages sent TO user are now read
    //   BUT from SELLER's perspective, their own messages (SELLER type) should show "Đã xem"
    // 
    // CORRECT LOGIC: readBy tells us WHO read. Their reading marks the OPPOSITE side's messages as read.
    // readBy = "SELLER" means seller read -> marks messages with senderType = "USER" as read (user sent to seller)
    // readBy = "USER" means user read -> marks messages with senderType = "SELLER" as read (seller sent to user)
    markMessagesAsReadLocally: (state, action: PayloadAction<{ conversationId: number; readAt: string; readBy?: string }>) => {
      const { conversationId, readAt, readBy } = action.payload;
      if (state.currentConversation?.id === conversationId) {
        // readBy tells us WHO read the messages (the reader)
        // We mark messages FROM the OPPOSITE party as read
        // If SELLER read -> USER's messages are read by seller -> mark senderType = "USER"
        // If USER read -> SELLER's messages are read by user -> mark senderType = "SELLER"
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

      // Also update unread count in conversations list
      const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex !== -1) {
        // If SELLER read, reset unreadCountSeller
        // If USER read, reset unreadCountUser
        if (readBy === "SELLER") {
          state.conversations[convIndex].unreadCountSeller = 0;
        } else if (readBy === "USER") {
          state.conversations[convIndex].unreadCountUser = 0;
        }
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

    // Mark messages as read - update local state after successful API call
    builder.addCase(markMessagesAsRead.fulfilled, (state, action) => {
      const { conversationId } = action.payload;

      // Mark all messages from the OTHER party as read in current conversation
      if (state.currentConversation?.id === conversationId) {
        // Determine current user type based on context (we need to mark messages FROM the other party)
        // Since this is called when user opens a conversation, we mark messages NOT sent by current user
        state.messages = state.messages.map((msg) => {
          // We don't know the current user role here, so we mark all unread messages
          // The backend already handles the correct logic
          if (!msg.isRead) {
            return {
              ...msg,
              isRead: true,
              readAt: new Date().toISOString(),
            };
          }
          return msg;
        });
      }

      // Reset unread count for the conversation in list
      const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex !== -1) {
        // We can't determine if it's seller or user here easily, so reset both
        // The correct value will be fetched on next refresh
        state.conversations[convIndex].unreadCountUser = 0;
        state.conversations[convIndex].unreadCountSeller = 0;
      }

      // Recalculate total unread count
      state.unreadCount = state.conversations.reduce((total, conv) => {
        return total + (conv.unreadCountUser || 0) + (conv.unreadCountSeller || 0);
      }, 0);
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

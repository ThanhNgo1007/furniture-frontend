export interface Conversation {
  id: number;
  userId: number;
  userName: string;
  sellerId: number;
  sellerName: string;
  orderId?: number;
  orderNumber?: string;
  orderDetails?: string;
  productId?: number;
  productTitle?: string;
  productImage?: string;
  categoryId?: string;
  parentCategoryId?: string;
  lastMessageAt: string;
  unreadCountUser: number;
  unreadCountSeller: number;
  lastMessagePreview: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: "USER" | "SELLER";
  senderName: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "ORDER_LINK" | "PRODUCT";
  isRead: boolean;
  createdAt: string;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  connected: boolean;
  typing: boolean;
  isOpen: boolean;
}

export interface ChatMessageRequest {
  conversationId?: number;
  sellerId?: number;
  orderId?: number;
  content: string;
  messageType?: "TEXT" | "IMAGE" | "ORDER_LINK";
}

export interface ChatHistoryResponse {
  messages: Message[];
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
}

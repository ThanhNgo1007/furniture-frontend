import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Message, ReadReceipt } from "../types/chatTypes";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageCallbacks: Array<(message: Message) => void> = [];
  private readReceiptCallbacks: Array<(receipt: ReadReceipt) => void> = [];
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private currentJwt: string | null = null;
  private isReconnecting = false;
  private lastErrorLogged = 0; // Throttle error logging

  /**
   * Update the JWT token - call this when token is refreshed
   */
  updateToken(jwt: string): void {
    // console.log("[WebSocket] Token updated");
    const tokenChanged = this.currentJwt !== jwt;
    this.currentJwt = jwt;

    // If token changed and we're not connected, reset attempts to allow reconnection
    if (tokenChanged && !this.client?.connected) {
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Connect to WebSocket server with JWT authentication
   */
  connect(jwt: string): Promise<void> {
    // Don't connect if no JWT
    if (!jwt) {
      // console.warn("[WebSocket] No JWT provided, skipping connection");
      return Promise.resolve();
    }

    // Reset reconnect attempts when explicitly connecting with a (new) JWT
    if (this.currentJwt !== jwt) {
      this.reconnectAttempts = 0;
    }
    this.currentJwt = jwt;

    return new Promise((resolve, reject) => {
      // Clean up existing connection
      if (this.client?.connected) {
        this.disconnect();
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:5454/ws`),
        connectHeaders: {
          Authorization: `Bearer ${jwt}`,
        },
        debug: () => { }, // Disable debug logging to reduce console spam
        reconnectDelay: 0, // We handle reconnection manually
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        // console.log("[WebSocket] Connected successfully");
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.notifyConnectionCallbacks(true);

        // Subscribe to user's message queue
        this.subscribeToMessages();

        resolve();
      };

      this.client.onStompError = (frame) => {
        this.throttledError(`STOMP Error: ${frame.headers["message"]}`);
        this.notifyConnectionCallbacks(false);
        reject(new Error(frame.headers["message"]));
      };

      this.client.onWebSocketError = () => {
        // Only log every 30 seconds to avoid console spam
        this.throttledError("WebSocket connection error");
        this.notifyConnectionCallbacks(false);
      };

      this.client.onWebSocketClose = () => {
        this.notifyConnectionCallbacks(false);
        this.attemptReconnect();
      };

      this.client.activate();
    });
  }

  /**
   * Throttle error logging to prevent console spam
   */
  private throttledError(message: string): void {
    const now = Date.now();
    if (now - this.lastErrorLogged > 30000) {
      // console.warn(`[WebSocket] ${message}`);
      this.lastErrorLogged = now;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.isReconnecting || !this.currentJwt) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // console.warn(`[WebSocket] Max reconnect attempts (${this.maxReconnectAttempts}) reached. Stopping.`);
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    // Exponential backoff: 2s, 4s, 8s, 16s, 32s
    const delay = Math.min(2000 * Math.pow(2, this.reconnectAttempts - 1), 32000);

    // console.log(`[WebSocket] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.isReconnecting = false;
      if (this.currentJwt) {
        this.connect(this.currentJwt).catch(() => {
          // Error handled in connect()
        });
      }
    }, delay);
  }

  /**
   * Force reconnect with current or new JWT - resets attempt counter
   */
  forceReconnect(jwt?: string): Promise<void> {
    const tokenToUse = jwt || this.currentJwt;
    if (!tokenToUse) {
      return Promise.resolve();
    }

    // Reset attempts to allow fresh reconnection
    this.reconnectAttempts = 0;
    this.isReconnecting = false;

    // Disconnect without setting max attempts
    if (this.client) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
    }

    this.currentJwt = tokenToUse;
    return this.connect(tokenToUse);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();

      this.client.deactivate();
      this.client = null;
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect after explicit disconnect
      this.notifyConnectionCallbacks(false);
      // console.log("[WebSocket] Disconnected");
    }
  }

  /**
   * Subscribe to user's message queue
   */
  private subscribeToMessages(): void {
    if (!this.client?.connected) {
      // console.error("[WebSocket] Cannot subscribe: not connected");
      return;
    }

    const subscription = this.client.subscribe("/user/queue/messages", (message) => {
      try {
        const messageData: Message = JSON.parse(message.body);
        // console.log("[WebSocket] Received message:", messageData);
        this.notifyMessageCallbacks(messageData);
      } catch (error) {
        // console.error("[WebSocket] Error parsing message:", error);
      }
    });

    this.subscriptions.set("messages", subscription);
  }

  /**
   * Subscribe to a specific conversation
   */
  subscribeToConversation(conversationId: number): void {
    if (!this.client?.connected) {
      // console.error("[WebSocket] Cannot subscribe to conversation: not connected");
      return;
    }

    // Unsubscribe if already subscribed to this conversation
    this.unsubscribeFromConversation(conversationId);

    const subscription = this.client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
      try {
        const data = JSON.parse(message.body);

        // Check if this is a read receipt or a message
        if (data.type === "READ_RECEIPT") {
          // console.log(`[WebSocket] Received read receipt for conversation ${conversationId}:`, data);
          this.notifyReadReceiptCallbacks(data);
        } else {
          const messageData: Message = data;
          // console.log(`[WebSocket] Received message for conversation ${conversationId}:`, messageData);
          this.notifyMessageCallbacks(messageData);
        }
      } catch (error) {
        // console.error("[WebSocket] Error parsing message:", error);
      }
    });

    this.subscriptions.set(`conversation-${conversationId}`, subscription);
    // console.log(`[WebSocket] Subscribed to conversation ${conversationId}`);
  }

  /**
   * Unsubscribe from a specific conversation
   */
  unsubscribeFromConversation(conversationId: number): void {
    const key = `conversation-${conversationId}`;
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key)?.unsubscribe();
      this.subscriptions.delete(key);
      // console.log(`[WebSocket] Unsubscribed from conversation ${conversationId}`);
    }
  }

  /**
   * Send a chat message
   */
  sendMessage(message: {
    conversationId?: number;
    sellerId?: number;
    orderId?: number;
    content: string;
    messageType?: string;
  }): void {
    if (!this.client?.connected) {
      // console.error("[WebSocket] Cannot send message: not connected");
      throw new Error("WebSocket not connected");
    }

    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    // console.log("[WebSocket] Sent message:", message);
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(conversationId: number): void {
    if (!this.client?.connected) {
      return;
    }

    this.client.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({ conversationId }),
    });
  }

  /**
   * Subscribe to typing indicators
   */
  subscribeToTyping(callback: (conversationId: number) => void): void {
    if (!this.client?.connected) {
      // console.error("[WebSocket] Cannot subscribe to typing: not connected");
      return;
    }

    const subscription = this.client.subscribe("/user/queue/typing", (message) => {
      try {
        const conversationId = parseInt(message.body, 10);
        callback(conversationId);
      } catch (error) {
        // console.error("[WebSocket] Error parsing typing indicator:", error);
      }
    });

    this.subscriptions.set("typing", subscription);
  }

  /**
   * Add callback for when messages are received
   */
  addMessageListener(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Remove message listener
   */
  removeMessageListener(callback: (message: Message) => void): void {
    this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback);
  }

  /**
   * Add callback for connection status changes
   */
  addConnectionListener(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  /**
   * Remove connection listener
   */
  removeConnectionListener(callback: (connected: boolean) => void): void {
    this.connectionCallbacks = this.connectionCallbacks.filter((cb) => cb !== callback);
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * Notify all message callbacks
   */
  private notifyMessageCallbacks(message: Message): void {
    this.messageCallbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        // console.error("[WebSocket] Error in message callback:", error);
      }
    });
  }

  /**
   * Notify all connection callbacks
   */
  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        // console.error("[WebSocket] Error in connection callback:", error);
      }
    });
  }

  /**
   * Notify all read receipt callbacks
   */
  private notifyReadReceiptCallbacks(receipt: ReadReceipt): void {
    this.readReceiptCallbacks.forEach((callback) => {
      try {
        callback(receipt);
      } catch (error) {
        // console.error("[WebSocket] Error in read receipt callback:", error);
      }
    });
  }

  /**
   * Add callback for read receipts
   */
  addReadReceiptListener(callback: (receipt: ReadReceipt) => void): void {
    this.readReceiptCallbacks.push(callback);
  }

  /**
   * Remove read receipt listener
   */
  removeReadReceiptListener(callback: (receipt: ReadReceipt) => void): void {
    this.readReceiptCallbacks = this.readReceiptCallbacks.filter((cb) => cb !== callback);
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

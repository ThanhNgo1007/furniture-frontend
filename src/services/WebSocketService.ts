import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Message } from "../types/chatTypes";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private messageCallbacks: Array<(message: Message) => void> = [];
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to WebSocket server with JWT authentication
   */
  connect(jwt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clean up existing connection
      if (this.client?.connected) {
        this.disconnect();
      }

      const socket = new SockJS("http://localhost:5454/ws");

      this.client = new Client({
        webSocketFactory: () => socket as any,
        connectHeaders: {
          Authorization: `Bearer ${jwt}`,
        },
        debug: (str) => {
          console.log("[WebSocket Debug]", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
      });

      this.client.onConnect = (frame) => {
        console.log("[WebSocket] Connected:", frame);
        this.reconnectAttempts = 0;
        this.notifyConnectionCallbacks(true);

        // Subscribe to user's message queue
        this.subscribeToMessages();

        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error("[WebSocket] STOMP Error:", frame.headers["message"]);
        console.error("[WebSocket] Additional details:", frame.body);
        this.notifyConnectionCallbacks(false);
        reject(new Error(frame.headers["message"]));
      };

      this.client.onWebSocketError = (event) => {
        console.error("[WebSocket] WebSocket Error:", event);
        this.notifyConnectionCallbacks(false);
      };

      this.client.onWebSocketClose = (event) => {
        console.log("[WebSocket] Connection closed:", event);
        this.notifyConnectionCallbacks(false);

        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(jwt), 5000);
        }
      };

      this.client.activate();
    });
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
      this.notifyConnectionCallbacks(false);
      console.log("[WebSocket] Disconnected");
    }
  }

  /**
   * Subscribe to user's message queue
   */
  private subscribeToMessages(): void {
    if (!this.client?.connected) {
      console.error("[WebSocket] Cannot subscribe: not connected");
      return;
    }

    const subscription = this.client.subscribe("/user/queue/messages", (message) => {
      try {
        const messageData: Message = JSON.parse(message.body);
        console.log("[WebSocket] Received message:", messageData);
        this.notifyMessageCallbacks(messageData);
      } catch (error) {
        console.error("[WebSocket] Error parsing message:", error);
      }
    });

    this.subscriptions.set("messages", subscription);
  }

  /**
   * Subscribe to a specific conversation
   */
  subscribeToConversation(conversationId: number): void {
    if (!this.client?.connected) {
      console.error("[WebSocket] Cannot subscribe to conversation: not connected");
      return;
    }

    // Unsubscribe if already subscribed to this conversation
    this.unsubscribeFromConversation(conversationId);

    const subscription = this.client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
      try {
        const messageData: Message = JSON.parse(message.body);
        console.log(`[WebSocket] Received message for conversation ${conversationId}:`, messageData);
        this.notifyMessageCallbacks(messageData);
      } catch (error) {
        console.error("[WebSocket] Error parsing message:", error);
      }
    });

    this.subscriptions.set(`conversation-${conversationId}`, subscription);
    console.log(`[WebSocket] Subscribed to conversation ${conversationId}`);
  }

  /**
   * Unsubscribe from a specific conversation
   */
  unsubscribeFromConversation(conversationId: number): void {
    const key = `conversation-${conversationId}`;
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key)?.unsubscribe();
      this.subscriptions.delete(key);
      console.log(`[WebSocket] Unsubscribed from conversation ${conversationId}`);
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
      console.error("[WebSocket] Cannot send message: not connected");
      throw new Error("WebSocket not connected");
    }

    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    console.log("[WebSocket] Sent message:", message);
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
      console.error("[WebSocket] Cannot subscribe to typing: not connected");
      return;
    }

    const subscription = this.client.subscribe("/user/queue/typing", (message) => {
      try {
        const conversationId = parseInt(message.body, 10);
        callback(conversationId);
      } catch (error) {
        console.error("[WebSocket] Error parsing typing indicator:", error);
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
        console.error("[WebSocket] Error in message callback:", error);
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
        console.error("[WebSocket] Error in connection callback:", error);
      }
    });
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

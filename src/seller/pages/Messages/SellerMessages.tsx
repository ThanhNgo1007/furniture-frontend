import {
    Chat as ChatIcon,
    Close as CloseIcon,
    DoneAll as DoneAllIcon,
    Done as DoneIcon,
    Search as SearchIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";
import {
    Avatar,
    Badge,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
    addMessage,
    fetchChatHistory,
    fetchConversations,
    markMessagesAsRead,
    markMessagesAsReadLocally,
    setConnected,
    setCurrentConversation,
} from "../../../State/chatSlice";
import { webSocketService } from "../../../services/WebSocketService";
import type { Message } from "../../../types/chatTypes";

// Shopee color theme
const SHOPEE_RED = "#EE4D2D";

// Helper function to format date for separators
const formatDateSeparator = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hôm nay";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hôm qua";
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
};

// Helper function to check if two dates are different days
const isDifferentDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1).toDateString();
  const d2 = new Date(date2).toDateString();
  return d1 !== d2;
};

const SellerMessages = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const { seller } = useAppSelector((state) => state.seller);
  const { conversations, currentConversation, messages, connected, loading } =
    useAppSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket when component mounts or JWT changes
  useEffect(() => {
    if (!auth.jwt) {
      // No JWT - disconnect and reset
      webSocketService.disconnect();
      dispatch(setConnected(false));
      return;
    }
    
    console.log("[SellerMessages] Connecting WebSocket with JWT...");
    // Update token in service for reconnection
    webSocketService.updateToken(auth.jwt);
    
    // Listen for incoming messages
    const handleMessage = (message: Message) => {
      console.log("[SellerMessages] Received message:", message);
      dispatch(addMessage(message));
    };

    // Listen for read receipts
    const handleReadReceipt = (receipt: { conversationId: number; readAt: string; readBy: string }) => {
      console.log("[SellerMessages] Received read receipt:", receipt);
      dispatch(markMessagesAsReadLocally({ conversationId: receipt.conversationId, readAt: receipt.readAt, readBy: receipt.readBy }));
    };

    webSocketService.addMessageListener(handleMessage);
    webSocketService.addReadReceiptListener(handleReadReceipt);
    
    // Use forceReconnect to ensure reconnection works after JWT refresh
    webSocketService
      .forceReconnect(auth.jwt)
      .then(() => {
        console.log("[SellerMessages] WebSocket connected successfully");
        dispatch(setConnected(true));
      })
      .catch((err) => {
        console.error("[SellerMessages] Failed to connect to WebSocket:", err);
        dispatch(setConnected(false));
      });

    return () => {
      webSocketService.removeMessageListener(handleMessage);
      webSocketService.removeReadReceiptListener(handleReadReceipt);
      // Don't disconnect on cleanup - let the connection persist
    };
  }, [auth.jwt, dispatch]);

  // Load conversations when component mounts
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && conversations.length === 0) {
      dispatch(fetchConversations(jwt));
    }
  }, [conversations.length, dispatch]);

  // Subscribe to current conversation updates
  useEffect(() => {
    console.log("[SellerMessages] Subscription effect - currentConversation:", currentConversation?.id, "connected:", connected);
    if (currentConversation?.id && connected) {
      console.log("[SellerMessages] Subscribing to conversation:", currentConversation.id);
      webSocketService.subscribeToConversation(currentConversation.id);
    }

    return () => {
      if (currentConversation?.id) {
        console.log("[SellerMessages] Unsubscribing from conversation:", currentConversation.id);
        webSocketService.unsubscribeFromConversation(currentConversation.id);
      }
    };
  }, [currentConversation?.id, connected]);

  // Auto-mark new incoming messages as read when viewing the conversation
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (currentConversation && jwt && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // If last message is from the other party (USER) and not read, mark as read
      if (lastMessage.senderType !== "SELLER" && !lastMessage.isRead) {
        dispatch(markMessagesAsRead({ conversationId: currentConversation.id, jwt }));
      }
    }
  }, [messages, currentConversation, dispatch]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversationId: number) => {
    const jwt = localStorage.getItem("jwt");
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation && jwt) {
      dispatch(setCurrentConversation(conversation));
      dispatch(fetchChatHistory({ conversationId, jwt }));
      dispatch(markMessagesAsRead({ conversationId, jwt }));
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation && connected && seller) {
      const messageContent = messageInput.trim();
      
      // Send via WebSocket - server will broadcast back to us and others
      webSocketService.sendMessage({
        conversationId: currentConversation.id,
        content: messageContent,
        messageType: "TEXT",
      });
      
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const participantName = conv.userName;
    const matchesSearch = participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const hasHistory = conv.lastMessagePreview || conv.unreadCountUser > 0 || conv.unreadCountSeller > 0;
    const isCurrent = currentConversation?.id === conv.id;
    return matchesSearch && (hasHistory || isCurrent);
  });

  // Render messages with date separators
  const renderMessagesWithDateSeparators = () => {
    const elements: React.ReactNode[] = [];
    let lastDate: string | null = null;

    messages.forEach((msg) => {
      // Check if we need a date separator
      if (!lastDate || isDifferentDay(lastDate, msg.createdAt)) {
        elements.push(
          <Box
            key={`date-${msg.createdAt}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: "rgba(0,0,0,0.08)",
                borderRadius: 4,
                color: "text.secondary",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {formatDateSeparator(msg.createdAt)}
            </Typography>
          </Box>
        );
      }
      lastDate = msg.createdAt;

      // Determine if this is seller's own message
      const isOwnMessage = msg.senderType === "SELLER";
      
      // Check if this is the last own message that was read (for eye icon)
      const currentIndex = messages.indexOf(msg);
      const isLastReadMessage = isOwnMessage && msg.isRead && 
        (currentIndex === messages.length - 1 || !messages.slice(currentIndex + 1).some(m => m.senderType === "SELLER" && m.isRead));

      elements.push(
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: isOwnMessage ? "flex-end" : "flex-start",
            mb: 0.5, // Reduced margin between messages
          }}
        >
          {!isOwnMessage && (
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "#bdbdbd", fontSize: 14 }}>
              {msg.senderName?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Box sx={{ maxWidth: "70%" }}>
            {msg.messageType === "PRODUCT" ? (
              (() => {
                try {
                  const productData = JSON.parse(msg.content);
                  return (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "white",
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        mb: 0.5,
                        overflow: "hidden"
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {productData.image && (
                          <Box component="img" src={productData.image} sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }} />
                        )}
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Khách hàng quan tâm sản phẩm
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {productData.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                } catch {
                  return <Typography variant="body2" color="error">Lỗi hiển thị sản phẩm</Typography>;
                }
              })()
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  px: 2,
                  bgcolor: isOwnMessage ? "#dcf8c6" : "white", // Keep green for own, white for others currently
                  color: "text.primary",
                  borderRadius: isOwnMessage ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  position: "relative",
                  wordBreak: "break-word"
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.content}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: isOwnMessage ? "flex-end" : "flex-start", gap: 0.5, mt: 0.5, mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10 }}>
                {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              {/* Read receipt for own messages */}
              {isOwnMessage && (
                isLastReadMessage ? (
                  // Eye icon + "Đã xem" for the last read message
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                    <VisibilityIcon sx={{ fontSize: 12, color: "#4fc3f7" }} />
                    <Typography variant="caption" sx={{ fontSize: 10, color: "#4fc3f7" }}>Đã xem</Typography>
                  </Box>
                ) : msg.isRead ? (
                  // Double tick for older read messages
                  <DoneAllIcon sx={{ fontSize: 14, color: "#4fc3f7" }} />
                ) : (
                  // Single tick for unread messages
                  <DoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                )
              )}
            </Box>
          </Box>
        </Box>
      );
    });

    return elements;
  };

  // Main Container with fixed height based on parent/viewport
  // Assuming a header height of roughly 64px - 70px. Adjusted to fit typical dashboard layout.
  return (
    <Box sx={{ 
      height: "calc(100vh - 70px)", // Adjusted height
      display: "flex", 
      bgcolor: "#f5f5f5",
      overflow: "hidden", // Prevent outer scroll
      m: -5, // Negative margin to flush with dashboard padding if necessary, or just remove if layout allows
      borderRadius: 2, // Optional: if want rounded corners for the whole widget
    }}>
      {/* LEFT COLUMN: Conversation List (30%) */}
      <Paper 
        elevation={1}
        sx={{ 
          width: "320px", // Fixed width often better than % for chat list
          flexShrink: 0,
          borderRight: "1px solid #e0e0e0", 
          display: "flex", 
          flexDirection: "column", 
          borderRadius: 0,
          zIndex: 1, // Ensure shadow/border sits above if needed
        }}
      >
        {/* Left Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 1 }}>
          <ChatIcon sx={{ color: SHOPEE_RED }} />
          <Typography variant="h6" fontWeight="bold">
            Tin nhắn ({conversations.length})
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "#f5f5f5",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Conversation List */}
        <List sx={{ 
          overflowY: "auto", // Internal scroll
          flexGrow: 1, 
          p: 0,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: "3px" },
        }}>
          {filteredConversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có cuộc trò chuyện nào
              </Typography>
            </Box>
          ) : (
            filteredConversations.map((conv) => {
              const unread = conv.unreadCountSeller;
              const isSelected = currentConversation?.id === conv.id;

              return (
                <Box key={conv.id}>
                  <ListItemButton
                    onClick={() => handleSelectConversation(conv.id)}
                    selected={isSelected}
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor: isSelected ? "#fff5f2" : "transparent",
                      borderLeft: isSelected ? `4px solid ${SHOPEE_RED}` : "4px solid transparent",
                      "&.Mui-selected": {
                        bgcolor: "#fff5f2",
                        "&:hover": { bgcolor: "#fff5f2" },
                      },
                      "&:hover": { bgcolor: "#f9f9f9" },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={unread}
                        color="error"
                        invisible={unread === 0}
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: SHOPEE_RED,
                            color: "white",
                          }
                        }}
                      >
                        <Avatar sx={{ bgcolor: isSelected ? SHOPEE_RED : "#bdbdbd", width: 45, height: 45 }}>
                          {conv.userName?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={unread > 0 ? 700 : 500} noWrap>
                          {conv.userName}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          {conv.productTitle && (
                            <Typography variant="caption" color="primary" noWrap sx={{ display: "block", fontWeight: 500 }}>
                              📦 {conv.productTitle}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                            {conv.lastMessagePreview ? (
                              conv.lastMessageSenderType === "SELLER" 
                                ? `Bạn: ${conv.lastMessagePreview}`
                                : `${conv.userName}: ${conv.lastMessagePreview}`
                            ) : "Bắt đầu trò chuyện"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </Box>
              );
            })
          )}
        </List>
      </Paper>

      {/* RIGHT COLUMN: Chat Content (Flex Grow) */}
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column", 
        bgcolor: "#f0f2f5", // Slightly different bg for chat area
        overflow: "hidden" 
      }}>
        {currentConversation ? (
          <>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: "1px solid #e0e0e0", 
              display: "flex", 
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between" // Ensure space between title and close button
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: SHOPEE_RED }}>
                  {currentConversation.userName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {currentConversation.userName}
                  </Typography>
                  {currentConversation.productTitle && (
                    <Typography variant="caption" color="text.secondary">
                      Đang hỏi về: {currentConversation.productTitle}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => dispatch(setCurrentConversation(null))}>
                 <CloseIcon />
              </IconButton>
            </Box>

            {/* Product Context Card */}
            {currentConversation.productId && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5,
                  mx: 2,
                  mt: 2,
                  bgcolor: "#fffbf0", 
                  border: "1px solid #ffeab6", 
                  display: "flex", 
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {currentConversation.productImage && (
                  <Box component="img" src={currentConversation.productImage} sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Khách hàng đang trao đổi về sản phẩm
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {currentConversation.productTitle}
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* Messages Area */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: "auto", 
              p: 2,
              display: "flex",
              flexDirection: "column",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: "3px" },
            }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress size={30} sx={{ color: SHOPEE_RED }} />
                </Box>
              ) : (
                <>
                  {renderMessagesWithDateSeparators()}
                  <div ref={messagesEndRef} />
                </>
              )}
            </Box>

            {/* Input Area */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 2, 
                borderTop: "1px solid #e0e0e0",
                bgcolor: "white",
                zIndex: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!connected}
                  multiline
                  maxRows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !connected}
                  sx={{ 
                    bgcolor: SHOPEE_RED, 
                    color: "white",
                    "&:hover": { bgcolor: "#D73211" },
                    "&:disabled": { bgcolor: "#ccc" }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              {!connected && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                  Đang kết nối lại...
                </Typography>
              )}
            </Paper>
          </>
        ) : (
          // Empty State
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <ChatIcon sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chào mừng đến với Tin nhắn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chọn một cuộc trò chuyện để bắt đầu
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SellerMessages;

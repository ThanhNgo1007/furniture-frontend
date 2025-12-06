import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Send as SendIcon
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
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  addMessage,
  fetchChatHistory,
  fetchConversations,
  markMessagesAsRead,
  setConnected,
  setCurrentConversation,
  setIsOpen,
} from "../../../State/chatSlice";
import { webSocketService } from "../../../services/WebSocketService";
import type { Message } from "../../../types/chatTypes";

// Shopee color theme
const SHOPEE_RED = "#EE4D2D";
const SHOPEE_RED_DARK = "#D73211";

const FloatingChatWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector((state) => state);
  const { conversations, currentConversation, messages, unreadCount, connected, loading, isOpen } =
    useAppSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleProductClick = () => {
    if (currentConversation?.productId && currentConversation.categoryId && currentConversation.parentCategoryId) {
      navigate(`/product-details/${currentConversation.parentCategoryId}/${currentConversation.categoryId}/${currentConversation.productTitle}/${currentConversation.productId}`);
    }
  };

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (auth.jwt && !connected) {
      webSocketService
        .connect(auth.jwt)
        .then(() => {
          dispatch(setConnected(true));
        })
        .catch((err) => {
          console.error("Failed to connect to WebSocket:", err);
        });

      // Listen for incoming messages
      const handleMessage = (message: Message) => {
        dispatch(addMessage(message));
      };

      webSocketService.addMessageListener(handleMessage);

      return () => {
        webSocketService.removeMessageListener(handleMessage);
        webSocketService.disconnect();
      };
    }
  }, [auth.jwt, connected, dispatch]);

  // Load conversations when chat opens
  useEffect(() => {
    if (isOpen && auth.jwt) {
      if (conversations.length === 0) {
        dispatch(fetchConversations(auth.jwt));
      }
      // If there is a current conversation but no messages (e.g. reopened), fetch history
      if (currentConversation && messages.length === 0) {
        dispatch(fetchChatHistory({ conversationId: currentConversation.id, jwt: auth.jwt }));
      }
    }
  }, [isOpen, auth.jwt, conversations.length, currentConversation, messages.length, dispatch]);

  // Subscribe to current conversation updates
  useEffect(() => {
    if (currentConversation?.id && connected) {
      webSocketService.subscribeToConversation(currentConversation.id);
    }

    return () => {
      if (currentConversation?.id) {
        webSocketService.unsubscribeFromConversation(currentConversation.id);
      }
    };
  }, [currentConversation?.id, connected]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleChat = () => {
    dispatch(setIsOpen(!isOpen));
  };

  const handleSelectConversation = (conversationId: number) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation && auth.jwt) {
      dispatch(setCurrentConversation(conversation));
      dispatch(fetchChatHistory({ conversationId, jwt: auth.jwt }));
      dispatch(markMessagesAsRead({ conversationId, jwt: auth.jwt }));
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation && connected && auth.user) {
      const messageContent = messageInput.trim();
      
      // Optimistic UI update - add message immediately to the chat
      const optimisticMessage: Message = {
        id: Date.now(), // Temporary ID
        conversationId: currentConversation.id,
        senderId: auth.user.id || 0,
        senderType: "USER",
        senderName: auth.user.fullName || "User",
        content: messageContent,
        messageType: "TEXT",
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      dispatch(addMessage(optimisticMessage));
      
      // Send via WebSocket
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

  const getOtherParticipantName = () => {
    if (!currentConversation) return "";
    const isUser = auth.user?.role === "ROLE_CUSTOMER";
    return isUser ? currentConversation.sellerName : currentConversation.userName;
  };

  // Filter conversations based on search and hide empty ones (unless it's the current active one)
  const filteredConversations = conversations.filter((conv) => {
    const isUser = auth.user?.role === "ROLE_CUSTOMER";
    const participantName = isUser ? conv.sellerName : conv.userName;
    const matchesSearch = participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    
    // Show if it has a last message OR if it's the currently open conversation (even if empty)
    // We check lastMessagePreview or unread counts as proxy for having history
    // But for the "just clicked" case, it might be empty. 
    // We want to show it IF it is selected.
    const hasHistory = conv.lastMessagePreview || conv.unreadCountUser > 0 || conv.unreadCountSeller > 0;
    const isCurrent = currentConversation?.id === conv.id;
    
    return matchesSearch && (hasHistory || isCurrent);
  });

  // ... (previous logic remains the same up to return)

  return (
    <>
      {/* Floating Chat Button - Shopee style */}
      {!isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={handleToggleChat}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: SHOPEE_RED,
              color: "white",
              "&:hover": {
                backgroundColor: SHOPEE_RED_DARK,
              },
              boxShadow: "0 4px 12px rgba(238, 77, 45, 0.4)",
            }}
          >
            <Badge badgeContent={unreadCount} color="error" 
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#fff",
                  color: SHOPEE_RED,
                  fontWeight: "bold",
                }
              }}
            >
              <ChatIcon />
            </Badge>
          </IconButton>
        </Box>
      )}

      {/* Chat Window - Shopee Web Style (Side-by-Side) */}
      {isOpen && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 24,
            width: 900, // Wide layout
            height: 600,
            display: "flex",
            zIndex: 1000,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            overflow: "hidden",
            border: `1px solid #e0e0e0`,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header (Shared across both columns or just top bar? Shopee usually has a header for the chat window) */}
          {/* Actually Shopee has a header for the whole widget usually, or separate. Let's do a top bar for the whole widget to close it. */}
          
          {/* LEFT COLUMN: Conversation List (30%) */}
          <Box sx={{ width: "30%", borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", bgcolor: "white" }}>
            {/* Left Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontWeight="bold" color={SHOPEE_RED}>
                Chat ({conversations.length})
              </Typography>
              {/* Close button only visible if we want to minimize from here */}
            </Box>

            {/* Search */}
            <Box sx={{ p: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm theo tên..."
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

            {/* List */}
            <List sx={{ overflow: "auto", flexGrow: 1, p: 0 }}>
              {filteredConversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy cuộc trò chuyện
                  </Typography>
                </Box>
              ) : (
                filteredConversations.map((conv) => {
                  const isUser = auth.user?.role === "ROLE_CUSTOMER";
                  const participantName = isUser ? conv.sellerName : conv.userName;
                  const unread = isUser ? conv.unreadCountUser : conv.unreadCountSeller;
                  const isSelected = currentConversation?.id === conv.id;

                  return (
                    <React.Fragment key={conv.id}>
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
                          <Avatar src="" sx={{ bgcolor: isSelected ? SHOPEE_RED : "#bdbdbd", width: 40, height: 40 }}>
                            {participantName?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" fontWeight={unread > 0 || isSelected ? 600 : 400} noWrap>
                                {participantName}
                              </Typography>
                              {unread > 0 && (
                                <Badge badgeContent={unread} sx={{ "& .MuiBadge-badge": { bgcolor: SHOPEE_RED, color: "white", transform: "scale(0.8)" } }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                              {conv.productTitle ? `SP: ${conv.productTitle}` : (conv.lastMessagePreview || "Bắt đầu trò chuyện")}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                })
              )}
            </List>
          </Box>

          {/* RIGHT COLUMN: Chat Content (70%) */}
          <Box sx={{ width: "70%", display: "flex", flexDirection: "column", bgcolor: "#f5f5f5" }}>
            {/* Header */}
            <Box sx={{ 
              p: 1.5, 
              bgcolor: "white", 
              borderBottom: "1px solid #e0e0e0", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              height: 60,
            }}>
              {currentConversation ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {getOtherParticipantName()}
                  </Typography>
                  {/* Could add online status here */}
                </Box>
              ) : (
                <Typography variant="subtitle1" fontWeight="bold">Chào mừng đến với Shopee Chat</Typography>
              )}
              
              <Box>
                <IconButton onClick={handleToggleChat} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Main Content Area */}
            {currentConversation ? (
              <>
                {/* Product Context Card (Fixed under header) */}
                {currentConversation.productId && (
                  <Paper 
                    elevation={0} 
                    onClick={handleProductClick}
                    sx={{ 
                      p: 1.5,
                      mx: 2,
                      mt: 2,
                      bgcolor: "#fffbf0", 
                      border: "1px solid #ffeab6", 
                      display: "flex", 
                      alignItems: "center",
                      gap: 2,
                      flexShrink: 0, // Don't shrink
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#fff5d6",
                        borderColor: "#ffd54f"
                      }
                    }}
                  >
                    {currentConversation.productImage && (
                      <Box component="img" src={currentConversation.productImage} sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }} />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Bạn đang trao đổi với Người bán về sản phẩm này
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {currentConversation.productTitle}
                      </Typography>
                      <Typography variant="caption" color={SHOPEE_RED} fontWeight="bold">
                        Nhấn để xem chi tiết sản phẩm
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Messages Area */}
                <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column" }}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <CircularProgress size={30} sx={{ color: SHOPEE_RED }} />
                    </Box>
                  ) : (
                    <>
                      {/* Messages */}
                      {messages.map((msg) => {
                        const isOwnMessage = 
                          (auth.user?.role === "ROLE_CUSTOMER" && msg.senderType === "USER") ||
                          (auth.user?.role === "ROLE_SELLER" && msg.senderType === "SELLER");

                        return (
                          <Box
                            key={msg.id}
                            sx={{
                              display: "flex",
                              justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                              mb: 1.5,
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
                                          borderRadius: 2,
                                          border: "1px solid #e0e0e0",
                                          mb: 0.5
                                        }}
                                      >
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                          {productData.image && (
                                            <Box component="img" src={productData.image} sx={{ width: 50, height: 50, objectFit: "cover", borderRadius: 1 }} />
                                          )}
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                              Sản phẩm đang quan tâm
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500} sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                              {productData.title}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Paper>
                                    );
                                  } catch (e) {
                                    return <Typography variant="body2" color="error">Lỗi hiển thị sản phẩm</Typography>;
                                  }
                                })()
                              ) : (
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 1.5,
                                    bgcolor: isOwnMessage ? "#dcf8c6" : "white", // WhatsApp/Shopee style light green for own, white for others
                                    color: "text.primary",
                                    borderRadius: 2,
                                    border: "1px solid #e0e0e0",
                                    position: "relative",
                                  }}
                                >
                                  <Typography variant="body2">{msg.content}</Typography>
                                </Paper>
                              )}
                              <Typography variant="caption" sx={{ display: "block", mt: 0.5, textAlign: isOwnMessage ? "right" : "left", color: "text.secondary", fontSize: 10 }}>
                                {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Nhập nội dung tin nhắn..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!connected}
                      multiline
                      maxRows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          bgcolor: "#f5f5f5",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || !connected}
                      sx={{ color: SHOPEE_RED }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              // Empty State (Welcome Screen)
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "#fdfdfd" }}>
                <Box 
                  component="img" 
                  src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/4b07872aed19e56e.png" // Shopee chat empty state image placeholder
                  sx={{ width: 150, mb: 2, opacity: 0.5 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chào mừng bạn đến với AptDeco Shop Chat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bắt đầu trò chuyện với người bán ngay!
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default FloatingChatWidget;

import React, { useEffect, useRef, useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Search, Menu, X } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: 'member' | 'creator';
  content: string;
  timestamp: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  memberSince: string;
}

export default function CreatorChat() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [conversations, setConversations] = useState<Array<{ id: string; memberId: string; creatorId: string; lastMessageContent: string | null; lastMessageAt: string | null; otherUserId: string; otherUserName: string | null; otherUserCreatorName: string | null; otherUserProfilePhoto: string | null; unreadCount: number }>>([]);
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string; createdAt: string; status?: 'sending' | 'sent' | 'delivered' | 'read' }>>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refetch conversations function
  const refetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      setConversations(res.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('message', ({ conversationId, message }) => {
      if (conversationId === selectedConversationId) {
        // Only add message if it's not from the current user (to avoid duplicates)
        if (message.senderId !== user?.id) {
          setMessages((prev) => [...prev, { ...message, status: 'read' }]);
        }
      }
      // Conversation list updates are now handled by conversationUpdated event
    });

    socket.on('conversationCreated', ({ conversation }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        if (exists) return prev;
        return [{ ...conversation, lastMessageContent: null, lastMessageAt: null }, ...prev];
      });
    });

    // Handle message confirmation from server
    socket.on('messageSent', ({ messageId, status }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId || msg.id.startsWith('temp-') ? 
          { ...msg, id: messageId, status: status || 'sent' } : msg
      ));
    });

    // Handle conversation list updates
    socket.on('conversationUpdated', ({ conversationId, lastMessageContent, lastMessageAt }) => {
      // Refetch conversations to get accurate unread counts from backend
      refetchConversations();
    });

    return () => {
      socket.off('message');
      socket.off('conversationCreated');
      socket.off('messageSent');
      socket.off('conversationUpdated');
    };
  }, [selectedConversationId, user?.id]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const res = await chatAPI.getConversations();
        setConversations(res.data || []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) return;
      const res = await chatAPI.getMessages(selectedConversationId);
      setMessages(res.data || []);
      socketRef.current?.emit('joinRoom', { conversationId: selectedConversationId });
      // Mark conversation as read when opened
      try {
        await chatAPI.markConversationAsRead(selectedConversationId);
        // Update local state to reflect unread count = 0
        setConversations(prev => prev.map(c => {
          if (c.id === selectedConversationId) {
            return { ...c, unreadCount: 0 };
          }
          return c;
        }));
        // Fetch updated unread count to update sidebar badge
        try {
          const unreadRes = await chatAPI.getUnreadMessageCount();
          const newTotal = unreadRes.data?.unreadCount || 0;
          sessionStorage.setItem('unreadMessageCount', newTotal.toString());
          // Dispatch custom event to update sidebar (if needed)
          window.dispatchEvent(new CustomEvent('unreadCountUpdated', { detail: { count: newTotal } }));
        } catch (unreadError) {
          console.error('Failed to fetch updated unread count:', unreadError);
        }
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    };
    fetchMessages();
  }, [selectedConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId || !user) return;
    
    // Add message optimistically with sending status
    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'sending' as const
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    // Send via socket
    socketRef.current?.emit('message', { conversationId: selectedConversationId, content: newMessage.trim() });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-creator-chat');
      const menuButton = document.getElementById('mobile-menu-button-creator-chat');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="mobile-menu-button-creator-chat"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <h1 className="text-lg font-semibold">Fan Messages</h1>

        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `} id="mobile-sidebar-creator-chat">
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        {!selectedConversationId ? (
          /* Members List View */
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Fan Messages</h1>
                <p className="text-gray-400">Connect with your community</p>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fans..."
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Conversations List */}
              {isLoadingConversations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-32 bg-gray-700" />
                          <Skeleton className="h-4 w-48 bg-gray-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conversations.filter(c => !searchQuery || (c.otherUserCreatorName || c.otherUserName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.lastMessageContent || '').toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedConversationId(c.id)} 
                      className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                            {c.otherUserProfilePhoto ? (
                              <img src={c.otherUserProfilePhoto} alt={c.otherUserCreatorName || c.otherUserName || ''} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-semibold">{(c.otherUserCreatorName || c.otherUserName || 'C').slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          {c.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-800">
                              <span className="text-xs font-bold text-white">{c.unreadCount > 9 ? '9+' : c.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg truncate">{c.otherUserCreatorName || c.otherUserName || 'Conversation'}</h3>
                            {c.unreadCount > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 truncate">{c.lastMessageContent || 'No messages yet'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  {searchQuery ? (
                    <>
                      <h3 className="text-lg font-medium mb-2">No fans found</h3>
                      <p className="text-gray-400">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                      <p className="text-gray-400">Your fan messages will appear here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="h-screen flex flex-col pt-16 lg:pt-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedConversationId(null);
                    // Refetch conversations when going back to ensure fresh data
                    refetchConversations();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div>
                  <h3 className="font-medium">{conversations.find(c => c.id === selectedConversationId)?.otherUserCreatorName || conversations.find(c => c.id === selectedConversationId)?.otherUserName || 'Conversation'}</h3>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`flex items-center space-x-1 mt-1 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.senderId === user?.id && message.status && (
                        <div className="flex items-center space-x-1">
                          {message.status === 'sending' && (
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          )}
                          {message.status === 'sent' && (
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          )}
                          {message.status === 'delivered' && (
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          )}
                          {message.status === 'read' && (
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

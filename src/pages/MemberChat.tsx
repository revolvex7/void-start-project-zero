import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Search, Menu, X, Loader2 } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: 'member' | 'creator';
  content: string;
  timestamp: string;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  isOnline: boolean;
}

export default function MemberChat() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [conversations, setConversations] = useState<Array<{ id: string; memberId: string; creatorId: string; lastMessageContent: string | null; lastMessageAt: string | null; otherUserId: string; otherUserName: string | null; otherUserCreatorName: string | null; otherUserProfilePhoto: string | null; unreadCount: number }>>([]);
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string; createdAt: string; status?: 'sending' | 'sent' | 'delivered' | 'read' }>>([]);
  const [subscribedCreators, setSubscribedCreators] = useState<Array<{ id: string; name: string; creatorName?: string; pageName?: string; profilePhoto?: string; bio?: string }>>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingCreators, setIsLoadingCreators] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Filter out creators who already have conversations
  const creatorsWithoutConversations = useMemo(() => {
    const conversationCreatorIds = new Set(conversations.map(c => c.otherUserId));
    return subscribedCreators.filter(creator => !conversationCreatorIds.has(creator.id));
  }, [subscribedCreators, conversations]);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedCreatorForNewChat, setSelectedCreatorForNewChat] = useState<string | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Note: unread count updates will come from conversationUpdated event
    });

    socket.on('conversationCreated', ({ conversation }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      // Auto-open the new conversation
      setSelectedConversationId(conversation.id);
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
  }, [selectedConversationId]);

  // Refetch conversations function
  const refetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      setConversations(res.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

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
    const fetchSubscribedCreators = async () => {
      try {
        setIsLoadingCreators(true);
        const res = await chatAPI.getSubscribedCreators();
        setSubscribedCreators(res.data || []);
      } catch (error) {
        console.error('Failed to fetch subscribed creators:', error);
      } finally {
        setIsLoadingCreators(false);
      }
    };
    fetchSubscribedCreators();
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

  const handleStartNewConversation = (creatorId: string) => {
    setSelectedCreatorForNewChat(creatorId);
    setShowNewConversation(true);
  };

  const handleSendNewConversation = () => {
    if (!newMessageText.trim() || !selectedCreatorForNewChat || !user) return;
    socketRef.current?.emit('newConversation', { 
      creatorId: selectedCreatorForNewChat, 
      firstMessage: newMessageText.trim() 
    });
    setNewMessageText('');
    setShowNewConversation(false);
    setSelectedCreatorForNewChat(null);
    
    // Refetch conversations after a short delay to get updated data
    setTimeout(() => {
      refetchConversations();
    }, 500);
  };

  const handleCancelNewConversation = () => {
    setShowNewConversation(false);
    setSelectedCreatorForNewChat(null);
    setNewMessageText('');
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
      const sidebar = document.getElementById('mobile-sidebar-member-chat');
      const menuButton = document.getElementById('mobile-menu-button-member-chat');
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
          id="mobile-menu-button-member-chat"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <h1 className="text-lg font-semibold">Messages</h1>

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
      `} id="mobile-sidebar-member-chat">
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        {!selectedConversationId ? (
          /* Creators List View */
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Messages</h1>
                <p className="text-gray-400">Connect with your favorite creators</p>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearching(true);
                      setTimeout(() => setIsSearching(false), 300);
                    }}
                    placeholder="Search creators..."
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 animate-spin" />
                  )}
                </div>
              </div>

              {/* Conversations Section */}
              {isLoadingConversations ? (
                <div className="mb-8">
                  <Skeleton className="h-7 w-40 mb-4 bg-gray-700" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
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
                </div>
              ) : conversations.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">Active Conversations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conversations.filter(c => !searchQuery || (c.otherUserCreatorName || c.otherUserName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.lastMessageContent || '').toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedConversationId(c.id)} 
                        className="group bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-gray-700/60 hover:border-blue-500/60"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-blue-500/30">
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
                              <h3 className="font-semibold text-base truncate group-hover:text-blue-300">{c.otherUserCreatorName || c.otherUserName || 'Conversation'}</h3>
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
                </div>
              ) : null}

              {/* Available Creators Section */}
              {isLoadingCreators ? (
                <div>
                  <Skeleton className="h-7 w-48 mb-4 bg-gray-700" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-5">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-14 h-14 rounded-full bg-gray-700" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                            <Skeleton className="h-3 w-32 bg-gray-700" />
                          </div>
                          <Skeleton className="h-8 w-20 bg-gray-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : creatorsWithoutConversations.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Start a Conversation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {creatorsWithoutConversations.filter(creator => !searchQuery || (creator.creatorName || creator.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((creator) => (
                      <div
                        key={creator.id}
                        className="group bg-gray-800/80 rounded-xl p-5 cursor-pointer hover:bg-gray-750 transition-all hover:shadow-lg hover:-translate-y-0.5 border border-gray-700/60 hover:border-blue-500/60 shadow-sm"
                        onClick={() => handleStartNewConversation(creator.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-blue-500/30">
                              {creator.profilePhoto ? (
                                <img 
                                  src={creator.profilePhoto} 
                                  alt={creator.creatorName || creator.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-base font-semibold text-white">
                                  {(creator.creatorName || creator.name || 'C').slice(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-base truncate text-white group-hover:text-blue-300">{creator.creatorName || creator.name}</h5>
                            <p className="text-sm text-gray-400 truncate line-clamp-1">{creator.bio || 'Creator'}</p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 shrink-0">
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Empty State */}
              {!isLoadingConversations && !isLoadingCreators && conversations.length === 0 && creatorsWithoutConversations.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No subscribed creators</h3>
                  <p className="text-gray-400">Subscribe to creators to start conversations</p>
                </div>
              )}

              {/* No Search Results */}
              {!isLoadingConversations && !isLoadingCreators && searchQuery && 
               conversations.filter(c => (c.otherUserCreatorName || c.otherUserName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.lastMessageContent || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
               creatorsWithoutConversations.filter(creator => (creator.creatorName || creator.name || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400">Try adjusting your search terms</p>
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
                {(() => {
                  const currentConversation = conversations.find(c => c.id === selectedConversationId);
                  return currentConversation ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {currentConversation.otherUserProfilePhoto ? (
                          <img 
                            src={currentConversation.otherUserProfilePhoto} 
                            alt={currentConversation.otherUserCreatorName || currentConversation.otherUserName || ''} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold">
                            {(currentConversation.otherUserCreatorName || currentConversation.otherUserName || 'C').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{currentConversation.otherUserCreatorName || currentConversation.otherUserName}</h3>
                        <p className="text-xs text-gray-400">Creator</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24 bg-gray-700" />
                        <Skeleton className="h-3 w-16 bg-gray-700" />
                      </div>
                    </div>
                  );
                })()}
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

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <p className="text-gray-400 mb-4">
              Send your first message to {subscribedCreators.find(c => c.id === selectedCreatorForNewChat)?.creatorName || 'this creator'}
            </p>
            <div className="space-y-4">
              <textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                rows={4}
              />
              <div className="flex space-x-3">
                <Button
                  onClick={handleSendNewConversation}
                  disabled={!newMessageText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Send Message
                </Button>
                <Button
                  onClick={handleCancelNewConversation}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

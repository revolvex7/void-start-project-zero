import React, { useEffect, useRef, useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [conversations, setConversations] = useState<Array<{ id: string; memberId: string; creatorId: string; lastMessageContent: string | null; lastMessageAt: string | null; otherUserId: string; otherUserName: string | null; otherUserCreatorName: string | null; otherUserProfilePhoto: string | null }>>([]);
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string; createdAt: string }>>([]);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('message', ({ conversationId, message }) => {
      if (conversationId === selectedConversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, lastMessageContent: message.content, lastMessageAt: message.createdAt } : c));
    });

    socket.on('conversationCreated', ({ conversation }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        if (exists) return prev;
        return [{ ...conversation, lastMessageContent: null, lastMessageAt: null }, ...prev];
      });
    });

    return () => {
      socket.off('message');
      socket.off('conversationCreated');
    };
  }, [selectedConversationId]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await chatAPI.getConversations();
      setConversations(res.data || []);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) return;
      const res = await chatAPI.getMessages(selectedConversationId);
      setMessages(res.data || []);
      socketRef.current?.emit('joinRoom', { conversationId: selectedConversationId });
    };
    fetchMessages();
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId || !user) return;
    socketRef.current?.emit('message', { conversationId: selectedConversationId, content: newMessage.trim() });
    setNewMessage('');
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conversations.filter(c => !searchQuery || (c.lastMessageContent || '').toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                  <div key={c.id} onClick={() => setSelectedConversationId(c.id)} className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                          {c.otherUserProfilePhoto ? (
                            <img src={c.otherUserProfilePhoto} alt={c.otherUserCreatorName || c.otherUserName || ''} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-semibold">{(c.otherUserCreatorName || c.otherUserName || 'C').slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{c.otherUserCreatorName || c.otherUserName || 'Conversation'}</h3>
                        <p className="text-sm text-gray-400 truncate">{c.lastMessageContent || 'No messages yet'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {conversations.filter(c => !searchQuery || (c.lastMessageContent || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No fans found</h3>
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
                  onClick={() => setSelectedConversationId(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div>
                  <h3 className="font-medium">Conversation</h3>
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
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
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

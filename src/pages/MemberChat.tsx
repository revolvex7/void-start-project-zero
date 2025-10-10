import React, { useState, useEffect } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Search, Menu, X } from 'lucide-react';

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
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Mock creators list
  const creators: Creator[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'AJ',
      category: 'Tech & Programming',
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'SC',
      category: 'Art & Design',
      isOnline: true
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: 'MR',
      category: 'Fitness & Health',
      isOnline: false
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'EW',
      category: 'Music & Audio',
      isOnline: false
    }
  ];

  // Filter creators based on search
  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock messages for selected creator
  const messages: Message[] = selectedCreator ? [
    {
      id: '1',
      sender: 'creator',
      content: 'Hey! Thanks for subscribing to my content. How can I help you today?',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      sender: 'member',
      content: 'Hi! I love your content. When is your next video coming out?',
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      sender: 'creator',
      content: 'Thank you! I\'m working on a new video about productivity tips. It should be out next week!',
      timestamp: '10:35 AM'
    }
  ] : [];

  const selectedCreatorData = creators.find(c => c.id === selectedCreator);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCreator) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage, 'to creator:', selectedCreator);
      setNewMessage('');
    }
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
        {!selectedCreator ? (
          /* Creators List View */
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Messages</h1>
                <p className="text-gray-400">Connect with your favorite creators</p>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creators..."
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Creators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreators.map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator.id)}
                    className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold">{creator.avatar}</span>
                        </div>
                        {creator.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{creator.name}</h3>
                        <p className="text-sm text-gray-400 truncate">{creator.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {creator.isOnline ? 'Online now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCreators.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No creators found</h3>
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
                  onClick={() => setSelectedCreator(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{selectedCreatorData?.avatar}</span>
                  </div>
                  {selectedCreatorData?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedCreatorData?.name}</h3>
                  <p className="text-sm text-gray-400">{selectedCreatorData?.category}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'member' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'member'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'member' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp}
                    </p>
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

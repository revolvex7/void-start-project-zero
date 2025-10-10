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
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Mock members who have messaged the creator
  const members: Member[] = [
    {
      id: '1',
      name: 'Emma Thompson',
      avatar: 'ET',
      lastMessage: 'Thank you for the amazing content! When is the next video coming?',
      timestamp: '5 min ago',
      isOnline: true,
      memberSince: 'Jan 2024'
    },
    {
      id: '2',
      name: 'David Kim',
      avatar: 'DK',
      lastMessage: 'Love your work! Keep it up 🔥',
      timestamp: '1 hour ago',
      isOnline: true,
      memberSince: 'Dec 2023'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      lastMessage: 'Could you do a tutorial on that topic you mentioned?',
      timestamp: '2 hours ago',
      isOnline: false,
      memberSince: 'Nov 2023'
    },
    {
      id: '4',
      name: 'Mike Rodriguez',
      avatar: 'MR',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '1 day ago',
      isOnline: false,
      memberSince: 'Oct 2023'
    }
  ];

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock messages for selected member
  const messages: Message[] = selectedMember ? [
    {
      id: '1',
      sender: 'member',
      content: 'Hi! I just wanted to say thank you for all the amazing content you create. It really helps me stay motivated!',
      timestamp: '2:30 PM'
    },
    {
      id: '2',
      sender: 'creator',
      content: 'Thank you so much! That really means a lot to me. I\'m glad my content is helping you! 😊',
      timestamp: '2:32 PM'
    },
    {
      id: '3',
      sender: 'member',
      content: 'I was wondering if you could do a deep dive into productivity systems? I struggle with staying organized.',
      timestamp: '2:35 PM'
    },
    {
      id: '4',
      sender: 'creator',
      content: 'That\'s a great suggestion! I\'ve been planning something like that. I\'ll definitely prioritize it.',
      timestamp: '2:37 PM'
    }
  ] : [];

  const selectedMemberData = members.find(m => m.id === selectedMember);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMember) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage, 'to member:', selectedMember);
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
        {!selectedMember ? (
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

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold">{member.avatar}</span>
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{member.name}</h3>
                        <p className="text-sm text-gray-400 truncate">Member since {member.memberSince}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {member.isOnline ? 'Online now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
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
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{selectedMemberData?.avatar}</span>
                  </div>
                  {selectedMemberData?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedMemberData?.name}</h3>
                  <p className="text-sm text-gray-400">Member since {selectedMemberData?.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'creator' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'creator'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'creator' ? 'text-blue-100' : 'text-gray-400'
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

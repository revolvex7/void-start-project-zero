import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Video, 
  Star,
  Check,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_content' | 'message' | 'subscription' | 'like' | 'comment' | 'creator_live';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

export default function MemberNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_content',
      title: 'New Video from Alex Johnson',
      description: 'Alex just posted "10 Productivity Tips for Developers" - check it out!',
      timestamp: '2 hours ago',
      isRead: false,
      creatorName: 'Alex Johnson',
      creatorAvatar: 'AJ'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Sarah Chen',
      description: 'Sarah replied to your message about the art tutorial.',
      timestamp: '4 hours ago',
      isRead: false,
      creatorName: 'Sarah Chen',
      creatorAvatar: 'SC'
    },
    {
      id: '3',
      type: 'new_content',
      title: 'New Podcast Episode',
      description: 'David Kim released "The Future of AI" - Episode 42.',
      timestamp: '1 day ago',
      isRead: true,
      creatorName: 'David Kim',
      creatorAvatar: 'DK'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message from Mike Rodriguez',
      description: 'Mike sent you a message about fitness tips.',
      timestamp: '2 days ago',
      isRead: true,
      creatorName: 'Mike Rodriguez',
      creatorAvatar: 'MR'
    }
  ]);


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_content': return <Video className="w-5 h-5 text-blue-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'subscription': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'like': return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'creator_live': return <Bell className="w-5 h-5 text-orange-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'new_content':
        // Navigate to a dummy post (you can change this to dynamic post ID later)
        navigate('/post/1');
        break;
      case 'message':
        // Navigate to member messages
        navigate('/member/chat');
        break;
      case 'subscription':
      case 'like':
      case 'comment':
        // Navigate to the specific post or creator page
        navigate('/post/1');
        break;
      case 'creator_live':
        // Navigate to creator profile or live page
        navigate('/dashboard/explore');
        break;
      default:
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 sm:w-72 lg:w-80 bg-gray-800 z-50">
        <UnifiedSidebar />
      </div>
      
      {/* Main Content */}
      <div className="ml-64 sm:ml-72 lg:ml-80 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your favorite creators and content</p>
          </div>

          {/* Notifications */}
          <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Notifications</h2>
                {unreadCount > 0 && (
                  <Button 
                    onClick={markAllAsRead}
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      notification.isRead 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-800/50 border-blue-600 shadow-lg'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {notification.creatorAvatar ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">{notification.creatorAvatar}</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {notification.timestamp}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                        {notification.creatorName && (
                          <p className="text-xs text-gray-500 mt-2">From {notification.creatorName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No notifications yet</h3>
                  <p className="text-gray-500">You'll see notifications here when creators you follow post new content or send messages.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

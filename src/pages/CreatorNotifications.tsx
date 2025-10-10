import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  DollarSign,
  Check,
  Clock,
  UserPlus
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_subscriber' | 'message' | 'payment' | 'comment' | 'like' | 'milestone' | 'payout';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  memberName?: string;
  memberAvatar?: string;
  amount?: number;
}

export default function CreatorNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      title: 'New Payment Received',
      description: 'Emma Thompson subscribed to your Premium tier',
      timestamp: '1 hour ago',
      isRead: false,
      memberName: 'Emma Thompson',
      memberAvatar: 'ET',
      amount: 2500
    },
    {
      id: '2',
      type: 'new_subscriber',
      title: 'New Subscriber!',
      description: 'David Kim just subscribed to your content',
      timestamp: '3 hours ago',
      isRead: false,
      memberName: 'David Kim',
      memberAvatar: 'DK'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Johnson sent you a message about your latest video',
      timestamp: '5 hours ago',
      isRead: false,
      memberName: 'Sarah Johnson',
      memberAvatar: 'SJ'
    },
    {
      id: '4',
      type: 'payment',
      title: 'New Payment Received',
      description: 'Mike Rodriguez subscribed to your Basic tier',
      timestamp: '1 day ago',
      isRead: true,
      memberName: 'Mike Rodriguez',
      memberAvatar: 'MR',
      amount: 1000
    }
  ]);


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_subscriber': return <UserPlus className="w-5 h-5 text-green-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
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
      case 'message':
        // Navigate to creator messages
        navigate('/creator/chat');
        break;
      case 'new_subscriber':
      case 'payment':
        // Navigate to insights/analytics to see subscriber details
        navigate('/insights');
        break;
      case 'comment':
      case 'like':
        // Navigate to a dummy post (you can change this to dynamic post ID later)
        navigate('/post/1');
        break;
      case 'payout':
        // Navigate to payouts page
        navigate('/payouts');
        break;
      case 'milestone':
        // Navigate to insights
        navigate('/insights');
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
            <h1 className="text-3xl font-bold mb-2">Creator Notifications</h1>
            <p className="text-gray-400">Stay updated with your subscribers, earnings, and content performance</p>
          </div>

          {/* Notifications */}
          <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
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
                        : 'bg-gray-800/50 border-green-600 shadow-lg'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {notification.memberAvatar ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">{notification.memberAvatar}</span>
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
                            {notification.amount && (
                              <span className="text-sm font-medium text-green-400">
                                +{formatCurrency(notification.amount)}
                              </span>
                            )}
                            <span className="text-sm text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {notification.timestamp}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                        {notification.memberName && (
                          <p className="text-xs text-gray-500 mt-2">From {notification.memberName}</p>
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
                  <p className="text-gray-500">You'll see notifications here when you get new subscribers, messages, or payments.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

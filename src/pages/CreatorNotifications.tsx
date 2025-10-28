import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  DollarSign,
  Check,
  Clock,
  UserPlus,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { notificationAPI, Notification } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatorNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications
  const fetchNotifications = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationAPI.getAll(pageNum, 20, 'creator');
      
      if (reset) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
      
      setHasMore(response.data.notifications.length === 20);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchNotifications(1, true);
    }
  }, [user]);


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

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await notificationAPI.markAsRead(notification.id);
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notification.id ? { ...notif, isRead: true } : notif
          )
        );
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }

    // Navigate based on redirectUrl or fallback to type-based navigation
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    } else {
      // Fallback navigation based on notification type
      switch (notification.type) {
        case 'creator':
          navigate('/creator/chat');
          break;
        default:
          navigate('/insights');
          break;
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-creator-notif');
      const menuButton = document.getElementById('mobile-menu-button-creator-notif');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button id="mobile-menu-button-creator-notif" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Notifications</h1>
        <div className="w-8" />
      </div>
      {showMobileSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`} id="mobile-sidebar-creator-notif">
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-8">
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

              {/* Loading State */}
              {loading && notifications.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                  <span className="ml-2 text-gray-400">Loading notifications...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button 
                    onClick={() => fetchNotifications(1, true)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Notifications List */}
              {!loading && !error && (
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
                          {notification.fromUserProfilePhoto ? (
                            <img 
                              src={notification.fromUserProfilePhoto} 
                              alt={notification.fromUserName || 'User'}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {notification.fromUserName?.charAt(0) || 'U'}
                              </span>
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
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          {notification.fromUserName && (
                            <p className="text-xs text-gray-500 mt-2">From {notification.fromUserName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Load More Button */}
                  {hasMore && !loading && (
                    <div className="text-center py-4">
                      <Button 
                        onClick={loadMore}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                  
                  {/* Loading More */}
                  {loading && notifications.length > 0 && (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-green-400 mx-auto" />
                    </div>
                  )}
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
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

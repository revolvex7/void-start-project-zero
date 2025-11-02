import React, { useState, useEffect } from "react";
import { 
  Home, 
  Search, 
  Users, 
  Bell, 
  Settings, 
  BarChart3,
  DollarSign,
  BookOpen,
  Megaphone,
  MessageSquare,
  LogOut,
  ChevronDown,
  Star,
  ArrowRight,
  Smartphone,
  Plus,
  Calendar
} from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { chatAPI } from "@/lib/api";

interface UnifiedSidebarProps {
  onPageChange?: (page: string) => void;
  currentPage?: string;
  showMobileSidebar?: boolean;
  setShowMobileSidebar?: (show: boolean) => void;
}

export function UnifiedSidebar({ 
  onPageChange, 
  currentPage = 'home',
  showMobileSidebar = false,
  setShowMobileSidebar 
}: UnifiedSidebarProps) {
  const { user, logout } = useAuth();
  const { currentRole, switchRole } = useUserRole();
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  // Initialize from sessionStorage to persist across remounts - prevents flashing to 0
  const [unreadMessageCount, setUnreadMessageCount] = useState(() => {
    const stored = sessionStorage.getItem('unreadMessageCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  const handleLogout = () => {
    logout();
    // Clear role context from sessionStorage
    sessionStorage.removeItem('userRoleContext');
    sessionStorage.removeItem('unreadMessageCount');
    // Use window.location for a clean redirect and full page reload
    window.location.href = '/';
  };

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await chatAPI.getUnreadMessageCount();
        const newCount = res.data?.unreadCount || 0;
        // Update state and persist to sessionStorage
        setUnreadMessageCount(prev => {
          // Always update to new value when we get a response
          sessionStorage.setItem('unreadMessageCount', newCount.toString());
          return newCount;
        });
      } catch (error) {
        console.error('Failed to fetch unread message count:', error);
        // Don't update state on error - keep previous value from sessionStorage
      }
    };

    if (user) {
      // Always fetch on mount and when user changes
      // The state persists from sessionStorage during navigation, so no flash to 0
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      
      // Listen for custom events when conversations are marked as read
      const handleUnreadCountUpdate = (event: CustomEvent) => {
        const newCount = event.detail?.count ?? 0;
        setUnreadMessageCount(newCount);
        sessionStorage.setItem('unreadMessageCount', newCount.toString());
      };
      
      window.addEventListener('unreadCountUpdated', handleUnreadCountUpdate as EventListener);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('unreadCountUpdated', handleUnreadCountUpdate as EventListener);
      };
    } else {
      // Only reset to 0 if user logs out
      setUnreadMessageCount(0);
      sessionStorage.removeItem('unreadMessageCount');
    }
  }, [user]);

  const handleRoleSwitch = (newRole: 'member' | 'creator') => {
    switchRole(newRole);
    setShowProfileSwitcher(false);
    
    if (newRole === 'member') {
      navigate('/dashboard?view=fan');
    } else {
      navigate('/dashboard?view=creator');
    }
  };

  // Member menu items
  const memberMenuItems = [
    { title: "Home", url: "/dashboard?view=fan", icon: Home, page: "home", badge: undefined },
    { title: "Explore", url: "/dashboard/explore", icon: Search, page: "explore", badge: undefined },
    { title: "Messages", url: "/member/chat", icon: MessageSquare, page: "chat", badge: unreadMessageCount > 0 ? unreadMessageCount.toString() : undefined },
    { title: "Notifications", url: "/dashboard/notifications", icon: Bell, page: "notifications", badge: undefined },
    { title: "Settings", url: "/member-settings", icon: Settings, page: "settings", badge: undefined },
  ];

  // Creator menu items
  const creatorMenuItems = [
    { title: "Dashboard", url: "/dashboard?view=creator", icon: Home, page: "dashboard", badge: undefined },
    { title: "Library", url: "/library", icon: BookOpen, page: "library", badge: undefined },
    { title: "Events", url: "/events", icon: Calendar, page: "events", badge: undefined },
    { title: "Insights", url: "/insights", icon: BarChart3, page: "insights", badge: undefined },
    { title: "Messages", url: "/creator/chat", icon: MessageSquare, page: "chat", badge: unreadMessageCount > 0 ? unreadMessageCount.toString() : undefined },
    { title: "Payouts", url: "/payouts", icon: DollarSign, page: "payouts", badge: undefined },
    { title: "Notifications", url: "/notifications", icon: Bell, page: "notifications", badge: undefined },
    { title: "Settings", url: "/creator-settings", icon: Settings, badge: undefined },
  ];

  const menuItems = currentRole === 'member' ? memberMenuItems : creatorMenuItems;
  const basePath = currentRole === 'creator' && creatorUrl ? `/${creatorUrl}` : '';

  const isActive = (item: any) => {
    // Use React Router's location to determine active state
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const fullUrl = currentPath + currentSearch;
    
    // Parse URLs to compare properly
    const itemUrl = item.url;
    const [itemPath, itemQuery] = itemUrl.split('?');
    
    // For exact path and query match
    if (itemQuery) {
      // Item has query params - need exact match
      return fullUrl === itemUrl;
    } else {
      // Item has no query params - match path exactly
      // But don't match if current URL has query params (unless they match)
      if (currentSearch && itemPath === '/dashboard') {
        // Special case: dashboard paths with query params should not match plain /dashboard items
        return false;
      }
      return currentPath === itemPath;
    }
  };

  const getNavUrl = (item: any) => {
    // For both member and creator, use the absolute URL directly
    return item.url;
  };

  const handleMenuClick = (item: any) => {
    if (onPageChange) {
      onPageChange(item.page);
    }
    if (setShowMobileSidebar) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col border-r border-gray-800 w-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-black rounded-full relative">
                <div className="absolute inset-0 bg-white rounded-full" style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
                }}></div>
              </div>
            </div>
            <span className="font-bold text-white">True Fans</span>
            {currentRole === 'creator' && (
              <span className="text-sm text-gray-400">Creator</span>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                {onPageChange ? (
                  <button
                    onClick={() => {
                      handleMenuClick(item);
                      // Also navigate to the URL
                      navigate(getNavUrl(item));
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left ${
                      isActive(item)
                        ? "bg-gray-700 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive(item) ? 'text-white' : 'text-gray-400'}`} />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {parseInt(item.badge) > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </button>
                ) : (
                  <NavLink 
                    to={getNavUrl(item)}
                    end
                    onClick={() => handleMenuClick(item)}
                    className={({ isActive: linkActive }) => 
                      `flex items-center px-3 py-2 rounded-lg transition-colors ${
                        linkActive
                          ? "bg-gray-700 text-white" 
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`
                    }
                  >
                    {({ isActive: linkActive }) => (
                      <>
                        <item.icon className={`w-5 h-5 mr-3 ${linkActive ? 'text-white' : 'text-gray-400'}`} />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {parseInt(item.badge) > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Creator Actions - Only show for creator role */}
        {currentRole === 'creator' && (
          <div className="px-4 mb-4 space-y-2">
            <Button 
              onClick={() => navigate('/create-post')}
              className="w-full bg-white hover:bg-gray-100 text-black flex items-center justify-center space-x-2 text-sm py-2"
            >
              <Plus size={14} />
              <span>Create</span>
            </Button>
          </div>
        )}

        {/* Bottom section with role switcher */}
        <div className="mt-auto p-4 border-t border-gray-800">
          {/* Profile Switcher */}
          <div className="relative mb-3">
            <button
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-700">
                {(currentRole === 'creator' ? (user as any)?.creator?.profilePhoto : (user as any)?.profilePhoto) ? (
                  <img 
                    src={currentRole === 'creator' ? (user as any)?.creator?.profilePhoto : (user as any)?.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    currentRole === 'creator' ? 'bg-pink-600' : 'bg-blue-600'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      {currentRole === 'creator' 
                        ? (user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C')
                        : (user?.name?.charAt(0)?.toUpperCase() || 'U')
                      }
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">
                  {currentRole === 'creator' 
                    ? (user?.creatorName || user?.name || 'Creator')
                    : (user?.name || 'User')
                  }
                </div>
                <div className="text-gray-400 text-xs capitalize">{currentRole}</div>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Profile Switcher Dropdown */}
            {showProfileSwitcher && (
              <div className="absolute bottom-full left-0 w-full bg-gray-700 rounded-lg shadow-lg mb-2 p-2">
                {/* Current Role Option */}
                <button
                  className="w-full flex items-center space-x-3 p-2 rounded bg-gray-600"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-700">
                    {(currentRole === 'creator' ? (user as any)?.creator?.profilePhoto : (user as any)?.profilePhoto) ? (
                      <img 
                        src={currentRole === 'creator' ? (user as any)?.creator?.profilePhoto : (user as any)?.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${
                        currentRole === 'creator' ? 'bg-pink-600' : 'bg-blue-600'
                      }`}>
                        <span className="text-white font-bold text-xs">
                          {currentRole === 'creator' 
                            ? (user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C')
                            : (user?.name?.charAt(0)?.toUpperCase() || 'U')
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {currentRole === 'creator' 
                        ? (user?.creatorName || user?.name || 'Creator')
                        : (user?.name || 'User')
                      }
                    </div>
                    <div className="text-gray-400 text-xs capitalize">{currentRole}</div>
                  </div>
                  <div className="w-4 h-4 text-green-500">✓</div>
                </button>
                
                {/* Switch Role Option */}
                {currentRole === 'member' && user?.creatorName ? (
                  <button
                    onClick={() => handleRoleSwitch('creator')}
                    className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-600"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-700">
                      {(user as any)?.creator?.profilePhoto ? (
                        <img 
                          src={(user as any)?.creator?.profilePhoto}
                          alt="Creator Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-pink-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{user?.creatorName || user?.name || 'Creator'}</div>
                      <div className="text-gray-400 text-xs">Creator</div>
                    </div>
                  </button>
                ) : currentRole === 'creator' ? (
                  <button
                    onClick={() => handleRoleSwitch('member')}
                    className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-600"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-700">
                      {(user as any)?.profilePhoto ? (
                        <img 
                          src={(user as any)?.profilePhoto}
                          alt="Member Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{user?.name || 'User'}</div>
                      <div className="text-gray-400 text-xs">Member</div>
                    </div>
                  </button>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Become Creator CTA - Only show for members without creator profile */}
          {currentRole === 'member' && !user?.creatorName && (
            <Button
              onClick={() => navigate('/dashboard?setup=creator')}
              className="w-full flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-sm py-2 mb-3"
            >
              <Star size={14} />
              <span>Become a Creator</span>
              <ArrowRight size={14} />
            </Button>
          )}

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center space-x-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-sm py-2"
          >
            <LogOut size={14} />
            <span>Log out</span>
          </Button>
        </div>
    </div>
  );
}

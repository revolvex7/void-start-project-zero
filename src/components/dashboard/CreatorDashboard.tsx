import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreatorDashboardContent } from './CreatorDashboardContent';
import { 
  BarChart3,
  Users,
  DollarSign,
  MessageSquare,
  Gift,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Smartphone,
  Plus,
  Menu,
  X
} from 'lucide-react';

const CreatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'library' | 'audience' | 'insights' | 'payouts' | 'promotions' | 'chats' | 'notifications' | 'settings'>('dashboard');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('creator-mobile-sidebar');
      const menuButton = document.getElementById('creator-mobile-menu-button');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchToFan = () => {
    navigate('/dashboard?view=fan');
  };

  // Creator sidebar items
  const creatorSidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: currentPage === 'dashboard', page: 'dashboard' },
    { icon: Users, label: 'Library', active: currentPage === 'library', page: 'library' },
    { icon: Users, label: 'Audience', active: currentPage === 'audience', page: 'audience' },
    { icon: BarChart3, label: 'Insights', active: currentPage === 'insights', page: 'insights' },
    { icon: DollarSign, label: 'Payouts', active: currentPage === 'payouts', page: 'payouts' },
    { icon: Gift, label: 'Promotions', active: currentPage === 'promotions', page: 'promotions' },
    { icon: MessageSquare, label: 'Chats', active: currentPage === 'chats', page: 'chats' },
    { icon: Bell, label: 'Notifications', active: currentPage === 'notifications', page: 'notifications' },
    { icon: Settings, label: 'Settings', active: currentPage === 'settings', page: 'settings' },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'library':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Content Library</h1>
            <p className="text-gray-400">Manage your posts, videos, and exclusive content here.</p>
          </div>
        );
      case 'audience':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Audience</h1>
            <p className="text-gray-400">View and manage your subscribers and fans.</p>
          </div>
        );
      case 'insights':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Insights</h1>
            <p className="text-gray-400">Analytics and performance metrics for your content.</p>
          </div>
        );
      case 'payouts':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Payouts</h1>
            <p className="text-gray-400">Manage your earnings and payment settings.</p>
          </div>
        );
      case 'promotions':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Promotions</h1>
            <p className="text-gray-400">Create and manage promotional campaigns.</p>
          </div>
        );
      case 'chats':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            <p className="text-gray-400">Communicate with your fans and subscribers.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <p className="text-gray-400">No new notifications</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Creator Settings</h1>
            <p className="text-gray-400">Manage your creator profile and preferences.</p>
          </div>
        );
      default:
        return <CreatorDashboardContent creatorName={user?.creatorName || user?.name || 'Creator'} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="creator-mobile-menu-button"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full relative">
              <div className="absolute inset-0 bg-white rounded-full" style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
              }}></div>
            </div>
          </div>
          <span className="font-semibold text-sm">[TrueFans] Creator</span>
        </div>

        <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C'}
          </span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `} id="creator-mobile-sidebar">
        <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
          {/* Logo - Hidden on mobile (shown in header) */}
          <div className="hidden lg:flex items-center mb-6 lg:mb-8">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-black rounded-full relative">
                <div className="absolute inset-0 bg-white rounded-full" style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
                }}></div>
              </div>
            </div>
            <span className="ml-3 font-semibold text-lg">[TrueFans]</span>
            <span className="ml-2 text-sm text-gray-400">Creator</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 lg:mb-8 mt-4 lg:mt-0">
            {creatorSidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setCurrentPage(item.page as any);
                  setShowMobileSidebar(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-colors ${
                  item.active 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm sm:text-base">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Creator Actions */}
          <div className="mb-4 sm:mb-6 lg:mb-8 space-y-2 sm:space-y-3">
            <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Smartphone size={14} />
              <span>Get app</span>
            </Button>
            <Button className="w-full bg-white hover:bg-gray-100 text-black flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Plus size={14} />
              <span>Create</span>
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto space-y-3 sm:space-y-4">
            {/* Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-xs sm:text-sm lg:text-base">{user?.creatorName || user?.name || 'Creator'}</div>
                  <div className="text-gray-400 text-xs lg:text-sm">Creator</div>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Profile Switcher Dropdown */}
              {showProfileSwitcher && (
                <div className="absolute bottom-full left-0 w-full bg-gray-700 rounded-lg shadow-lg mb-2 p-2">
                  {/* Creator Profile Option */}
                  <button
                    className="w-full flex items-center space-x-3 p-2 rounded bg-gray-600"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs sm:text-sm font-medium">{user?.creatorName || user?.name || 'Creator'}</div>
                      <div className="text-gray-400 text-xs">Creator</div>
                    </div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-green-500">✓</div>
                  </button>
                  
                  {/* Fan Profile Option */}
                  <button
                    onClick={handleSwitchToFan}
                    className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-600"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs sm:text-sm font-medium">{user?.name || 'User'}</div>
                      <div className="text-gray-400 text-xs">Member</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center space-x-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with responsive margins */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 overflow-y-auto">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default CreatorDashboard;

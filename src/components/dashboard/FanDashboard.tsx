import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ExplorePage } from './ExplorePage';
import { 
  Home, 
  Search, 
  MessageCircle, 
  Bell, 
  Settings,
  LogOut,
  Star,
  ArrowRight,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const FanDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'explore' | 'community' | 'notifications' | 'settings'>('home');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('fan-mobile-sidebar');
      const menuButton = document.getElementById('fan-mobile-menu-button');
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

  const handleCreatorClick = (creatorName: string) => {
    // Navigate to creator profile page and store the current context
    const creatorUrl = creatorName.toLowerCase().replace(/\s+/g, '');
    // Store that we came from fan dashboard
    sessionStorage.setItem('previousContext', 'fan-dashboard');
    navigate(`/c/${creatorUrl}`);
  };

  const handleSwitchToCreator = () => {
    navigate('/dashboard?view=creator');
  };

  // Fan sidebar items
  const fanSidebarItems = [
    { icon: Home, label: 'Home', active: currentPage === 'home', page: 'home' },
    { icon: Search, label: 'Explore', active: currentPage === 'explore', page: 'explore' },
    { icon: MessageCircle, label: 'Community', active: currentPage === 'community', page: 'community' },
    { icon: Bell, label: 'Notifications', active: currentPage === 'notifications', page: 'notifications' },
    { icon: Settings, label: 'Settings', active: currentPage === 'settings', page: 'settings' },
  ];

  const categories = [
    'All', 'Pop culture', 'Podcasts & shows', 'Entertainment', 'Comedy', 
    'Role playing games', 'True crime', 'Art tutorials', 'Handmade'
  ];

  const featuredCreators = [
    {
      id: 1,
      name: 'Da jungleboy',
      description: 'creating Video Vlogs',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      category: 'Entertainment'
    },
    {
      id: 2,
      name: 'More Than Friends',
      description: 'creating Podcasts',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      category: 'Podcasts'
    },
    {
      id: 3,
      name: 'Dee Shanell',
      description: 'Creating Reaction Videos',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
      category: 'Entertainment'
    },
    {
      id: 4,
      name: 'Insimnia',
      description: 'Creating Sims 4 Custom Content',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      category: 'Gaming'
    },
    {
      id: 5,
      name: 'Brad Evans',
      description: 'Creating entertainment content',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      category: 'Entertainment'
    },
    {
      id: 6,
      name: 'TripleTake Reacts',
      description: 'Creating reaction content',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
      category: 'Entertainment'
    }
  ];

  const popularThisWeek = [
    {
      id: 1,
      name: 'FUT Simple Trader',
      description: 'Creating EA FC 25 Ultimate Team Trading content.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      category: 'Gaming'
    },
    {
      id: 2,
      name: 'matt bernstein',
      description: 'creating accessible social and political commentary',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
      category: 'Commentary'
    },
    {
      id: 3,
      name: 'Zach Campbell',
      description: 'Creating Reaction Videos',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      category: 'Entertainment'
    },
    {
      id: 4,
      name: 'Chapo Trap House',
      description: 'Creating Chapo Trap House Podcast',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      category: 'Podcasts'
    },
    {
      id: 5,
      name: 'Shelf Respect',
      description: 'Judging Books By Their Covers. And Then Some.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
      category: 'Books'
    },
    {
      id: 6,
      name: 'RocketJump',
      description: 'documenting the creation of feature films',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      category: 'Film'
    }
  ];

  const renderHomePage = () => (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search creators or topics"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              index === 0 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Creators for You */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <p className="text-gray-400 text-xs sm:text-sm">Discover amazing creators</p>
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              Creators for you
              <ChevronDown className="ml-2" size={18} />
            </h2>
          </div>
          <div className="hidden lg:flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {featuredCreators.map((creator) => (
            <div 
              key={creator.id} 
              onClick={() => handleCreatorClick(creator.name)}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="aspect-square">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-medium text-xs sm:text-sm mb-1 line-clamp-1">{creator.name}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{creator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular This Week */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center">
            Popular this week
            <ChevronDown className="ml-2" size={18} />
          </h2>
          <div className="hidden lg:flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {popularThisWeek.map((creator) => (
            <div 
              key={creator.id} 
              onClick={() => handleCreatorClick(creator.name)}
              className="flex space-x-3 sm:space-x-4 bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-1">{creator.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{creator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'explore':
        return <ExplorePage onCreatorClick={handleCreatorClick} />;
      case 'community':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Community</h1>
            <p className="text-gray-400">Community features coming soon...</p>
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
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-400">Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderHomePage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="fan-mobile-menu-button"
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
          <span className="font-semibold text-sm">[TrueFans]</span>
        </div>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
      `} id="fan-mobile-sidebar">
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
          </div>

          {/* Navigation */}
          <nav className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 lg:mb-8 mt-4 lg:mt-0">
            {fanSidebarItems.map((item) => (
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

          {/* User Profile Section */}
          <div className="mt-auto space-y-3 sm:space-y-4">
            {/* Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-xs sm:text-sm lg:text-base">{user?.name || 'User'}</div>
                  <div className="text-gray-400 text-xs lg:text-sm">Member</div>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Profile Switcher Dropdown */}
              {showProfileSwitcher && (
                <div className="absolute bottom-full left-0 w-full bg-gray-700 rounded-lg shadow-lg mb-2 p-2">
                  {/* Fan Profile Option */}
                  <button
                    className="w-full flex items-center space-x-3 p-2 rounded bg-gray-600"
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
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-green-500">✓</div>
                  </button>
                  
                  {/* Creator Profile Option */}
                  {user?.creatorName && (
                    <button
                      onClick={handleSwitchToCreator}
                      className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-600"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs sm:text-sm font-medium">{user?.creatorName || user?.name || 'User'}</div>
                        <div className="text-gray-400 text-xs">Creator</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Become a Creator Button - Only show if not a creator */}
            {!user?.creatorName && (
              <Button
                onClick={() => navigate('/dashboard?setup=creator')}
                className="w-full flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs sm:text-sm py-2 sm:py-2.5"
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

export default FanDashboard;

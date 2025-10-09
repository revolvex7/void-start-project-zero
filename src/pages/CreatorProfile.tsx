import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MembershipModal } from '@/components/modals/MembershipModal';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useMembership } from '@/contexts/MembershipContext';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { 
  MoreHorizontal, 
  Share2, 
  Bell, 
  MessageCircle, 
  Users, 
  Heart,
  Play,
  Lock,
  Calendar,
  MapPin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Star,
  ArrowRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Eye,
  Plus
} from 'lucide-react';

const CreatorProfile = () => {
  const { creatorUrl } = useParams<{ creatorUrl: string }>();
  const { user, logout, isCreator } = useAuth();
  const { currentRole } = useUserRole();
  const { tiers, hasTiers } = useMembership();
  const navigate = useNavigate();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Set role context based on where user came from
  useEffect(() => {
    const previousContext = sessionStorage.getItem('previousContext');
    // The UserRoleContext will handle the role management
    // This component just needs to respect the current role
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
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

  // Mock creator data - in a real app, this would come from an API
  const creatorData: { [key: string]: any } = {
    dajungleboy: {
      name: 'Da jungleboy',
      handle: '@dajungleboy',
      description: 'creating Video Vlogs',
      coverImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      postsCount: 247,
      memberCount: '12.5K',
      location: 'Los Angeles, CA',
      joinedDate: 'March 2020',
      isVerified: true,
      socialLinks: {
        website: 'https://dajungleboy.com',
        twitter: '@dajungleboy',
        instagram: '@dajungleboy',
        youtube: 'DaJungleBoyVlogs'
      }
    },
    morethanfriends: {
      name: 'More Than Friends',
      handle: '@morethanfriends',
      description: 'creating Podcasts',
      coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      postsCount: 156,
      memberCount: '8.2K',
      location: 'New York, NY',
      joinedDate: 'January 2021',
      isVerified: true,
      socialLinks: {
        website: 'https://morethanfriends.podcast',
        twitter: '@morethanfriends',
        instagram: '@morethanfriendspod'
      }
    },
    insimnia: {
      name: 'Insimnia',
      handle: '@insimnia',
      description: 'Creating Sims 4 Custom Content',
      coverImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      postsCount: 89,
      memberCount: '5.7K',
      location: 'Toronto, Canada',
      joinedDate: 'June 2021',
      isVerified: false,
      socialLinks: {
        website: 'https://insimnia.com',
        twitter: '@insimnia',
        youtube: 'InsimniaGaming'
      }
    },
    tripletakereacts: {
      name: 'TripleTake Reacts',
      handle: '@tripletakereacts',
      description: 'creating reaction content',
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      postsCount: 203,
      memberCount: '15.3K',
      location: 'Chicago, IL',
      joinedDate: 'September 2019',
      isVerified: true,
      socialLinks: {
        twitter: '@tripletakereacts',
        youtube: 'TripleTakeReacts'
      }
    },
    joebudden: {
      name: 'Joe Budden',
      handle: '@joebudden',
      description: 'creating Podcasts & Commentary',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      postsCount: 412,
      memberCount: '45.2K',
      location: 'New Jersey',
      joinedDate: 'May 2018',
      isVerified: true,
      socialLinks: {
        website: 'https://joebuddenpodcast.com',
        twitter: '@joebudden',
        instagram: '@joebudden'
      }
    },
    shanedawson: {
      name: 'Shane Dawson',
      handle: '@shanedawson',
      description: 'creating Video Content',
      coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=400&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      postsCount: 324,
      memberCount: '32.8K',
      location: 'California',
      joinedDate: 'February 2019',
      isVerified: true,
      socialLinks: {
        website: 'https://shanedawson.com',
        twitter: '@shanedawson',
        youtube: 'ShaneDawson'
      }
    }
  };

  const creator = creatorData[creatorUrl || ''] || creatorData.dajungleboy;

  const tabs = [
    { id: 'home', label: 'Home', active: activeTab === 'home' },
    { id: 'membership', label: 'Membership', active: activeTab === 'membership' },
    { id: 'about', label: 'About', active: activeTab === 'about' },
  ];


  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="mobile-menu-button"
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
          <span className="font-semibold text-sm">TRUE FANS</span>
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
      `} id="mobile-sidebar">
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        {/* Profile Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 object-cover"
              />
              {creator.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                  </div>
              )}
                    </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{creator.name}</h1>
                  <p className="text-gray-400 text-sm sm:text-base">{creator.handle}</p>
                  <p className="text-gray-300 text-sm sm:text-base mt-1">{creator.description}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                  <Button 
                    onClick={() => setShowMembershipModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base font-medium"
                  >
                  Join now
                </Button>
                 
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">{creator.postsCount}</span>
                  <span className="text-gray-400">posts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} className="text-gray-400" />
                  <span className="font-semibold">{creator.memberCount}</span>
                  <span className="text-gray-400">members</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Joined {creator.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-700 mb-6">
            <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
                    tab.active
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="pb-8">
            {activeTab === 'home' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Latest Post */}
                <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">Latest post</h3>
                    <Button
                      onClick={() => setShowMembershipModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                    >
                      Become a member
                    </Button>
                  </div>
                  
                  <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Play className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm sm:text-base">Video preview</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-base sm:text-lg mb-2">Behind the scenes of my latest project</h4>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    Get an exclusive look at what I've been working on. This is just a preview - become a member to see the full content!
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>2 days ago</span>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 hover:text-white">
                        <Heart size={16} />
                        <span>24</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-white">
                        <MessageCircle size={16} />
                        <span>8</span>
                      </button>
                    </div>
                  </div>
                </div>

            {/* Recent Posts Grid */}
            <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                        <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                          <Lock className="w-6 h-6 text-gray-400" />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Members only
                          </div>
                          </div>
                        <div className="p-3 sm:p-4">
                          <h4 className="font-medium text-sm sm:text-base mb-1">Post title {index + 1}</h4>
                          <p className="text-gray-400 text-xs sm:text-sm">3 days ago</p>
                    </div>
                      </div>
                    ))}
                      </div>
                    </div>
                  </div>
            )}

            {/* Membership Tab Content */}
            {activeTab === 'membership' && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Membership Tiers</h2>
                
                {/* Mock membership tiers for the creator */}
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Basic Support</h3>
                        <p className="text-gray-400 mt-1">Get access to exclusive posts and updates</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">$5</div>
                        <div className="text-sm text-gray-400">per month</div>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Exclusive posts</li>
                      <li>• Member-only updates</li>
                      <li>• Discord access</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6 border border-blue-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-400">Premium Support</h3>
                        <p className="text-gray-400 mt-1">Everything in Basic plus early access</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">$15</div>
                        <div className="text-sm text-gray-400">per month</div>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Everything in Basic</li>
                      <li>• Early access to content</li>
                      <li>• Monthly Q&A sessions</li>
                      <li>• Behind-the-scenes content</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6 border border-purple-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-purple-400">VIP Support</h3>
                        <p className="text-gray-400 mt-1">The ultimate fan experience</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">$50</div>
                        <div className="text-sm text-gray-400">per month</div>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Everything in Premium</li>
                      <li>• 1-on-1 monthly video call</li>
                      <li>• Custom content requests</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* About Tab Content */}
            {activeTab === 'about' && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">About {creator.name}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {creator.description || "This creator hasn't added an about section yet."}
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Membership Modal */}
        <MembershipModal 
          open={showMembershipModal}
          onOpenChange={setShowMembershipModal}
          creatorName={creator.name}
        />
      </div>
  );
};

export default CreatorProfile;
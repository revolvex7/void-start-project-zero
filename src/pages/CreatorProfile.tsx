import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MembershipModal } from '@/components/modals/MembershipModal';
import { TipModal } from '@/components/modals/TipModal';
import { SubscriptionRequiredModal } from '@/components/modals/SubscriptionRequiredModal';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useMembership } from '@/contexts/MembershipContext';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { creatorAPI, Creator } from '@/lib/api';
import { useToggleFollow } from '@/hooks/useApi';
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
  Plus,
  Check
} from 'lucide-react';

const CreatorProfile = () => {
  const { creatorUrl } = useParams<{ creatorUrl: string }>();
  const location = useLocation();
  const { user, logout, isCreator } = useAuth();
  const { currentRole } = useUserRole();
  const { tiers, hasTiers } = useMembership();
  const navigate = useNavigate();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toggleFollowMutation = useToggleFollow();

  // Fetch creator data
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!creatorUrl) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get creator ID from navigation state
        const creatorId = location.state?.creatorId;
        
        let response;
        if (creatorId && !creatorId.startsWith('mock-')) {
          // Use creator ID directly for efficient single API call
          response = await creatorAPI.getCreatorById(creatorId);
        } else {
          // Fallback to pageName lookup (for direct URL access or mock data)
          response = await creatorAPI.getCreatorByPageName(creatorUrl);
        }
        
        setCreator(response.data);
        setIsFollowing(response.data.isFollowing || false);
      } catch (err) {
        console.error('Error fetching creator data:', err);
        setError('Failed to load creator profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [creatorUrl, location.state?.creatorId]);

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

  const handleFollow = async () => {
    if (!creator) return;
    
    try {
      await toggleFollowMutation.mutateAsync(creator.id);
      // The mutation will handle updating the cache and UI
      // Update local state as well for immediate feedback
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleFreePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handlePaidPostClick = (postId: string) => {
    if (isSubscribed) {
      navigate(`/post/${postId}`);
    } else {
      setShowSubscriptionModal(true);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'This creator profile could not be loaded.'}</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

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
        {/* Cover Image */}
        <div className="w-full h-48 sm:h-64 lg:h-80 overflow-hidden relative">
          {creator.coverPhoto ? (
            <img
              src={creator.coverPhoto}
              alt={`${creator.creatorName} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No cover image</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
        </div>
        
        {/* Profile Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={creator.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={creator.creatorName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 object-cover shadow-xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{creator.creatorName}</h1>
                  <p className="text-gray-400 text-sm sm:text-base">@{creator.pageName}</p>
                  <p className="text-gray-300 text-sm sm:text-base mt-1">{creator.bio || 'No bio available'}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                  <Button 
                    onClick={handleFollow}
                    disabled={toggleFollowMutation.isPending}
                    variant="outline"
                    className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-medium shadow-lg ${
                      isFollowing 
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                        : 'bg-transparent border-gray-600 text-white hover:bg-gray-700 backdrop-blur-sm'
                    }`}
                  >
                    {toggleFollowMutation.isPending ? (
                      'Loading...'
                    ) : isFollowing ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setShowMembershipModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base font-medium shadow-lg"
                  >
                    Subscribe
                  </Button>
                  <Button
                    onClick={() => setShowTipModal(true)}
                    variant="outline"
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 px-4 sm:px-6 py-2 text-sm sm:text-base font-medium shadow-lg backdrop-blur-sm"
                  >
                    💸 Dash Me
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">{creator.totalPosts}</span>
                  <span className="text-gray-400">posts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} className="text-gray-400" />
                  <span className="font-semibold">{creator.subscribersCount}</span>
                  <span className="text-gray-400">subscribers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} className="text-gray-400" />
                  <span className="font-semibold">{creator.followersCount}</span>
                  <span className="text-gray-400">followers</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Joined {new Date(creator.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                {creator.tags && creator.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-400">#{creator.tags.join(', #')}</span>
                  </div>
                )}
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
                {/* Recent Posts Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent posts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {creator.recentPosts && creator.recentPosts.length > 0 ? (
                      creator.recentPosts.map((post, index) => (
                        <div 
                          key={post.id} 
                          onClick={() => post.public ? handleFreePostClick(post.id) : handlePaidPostClick(post.id)}
                          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                        >
                          <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                            {post.public ? (
                              <Play className="w-8 h-8 text-white" />
                            ) : (
                              <Lock className="w-6 h-6 text-gray-400" />
                            )}
                            <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                              post.public ? 'bg-green-600' : 'bg-blue-600'
                            }`}>
                              {post.public ? 'Free' : 'Members only'}
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-medium text-sm sm:text-base mb-1">{post.title}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                              <button className="flex items-center space-x-1 hover:text-white">
                                <Heart size={14} />
                                <span>{post.totalLikes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-white">
                                <MessageCircle size={14} />
                                <span>{post.totalComments}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-400">No posts available yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popular Products Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Popular products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer">
                        <div className="aspect-square bg-gray-700 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                              📦
                            </div>
                            <p className="text-gray-400 text-sm">Product {index + 1}</p>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h4 className="font-medium text-sm sm:text-base mb-1">Digital Product {index + 1}</h4>
                          <p className="text-blue-400 text-sm font-semibold">${(index + 1) * 9.99}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore Other Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Explore other</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {creator.exploreOthers && creator.exploreOthers.length > 0 ? (
                      creator.exploreOthers.map((post, index) => (
                        <div 
                          key={post.id} 
                          onClick={() => post.public ? handleFreePostClick(post.id) : handlePaidPostClick(post.id)}
                          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                        >
                          <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                            {post.public ? (
                              <Play className="w-6 h-6 text-white" />
                            ) : (
                              <Lock className="w-6 h-6 text-gray-400" />
                            )}
                            <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                              post.public ? 'bg-green-600' : 'bg-blue-600'
                            }`}>
                              {post.public ? 'Free' : 'Members only'}
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-medium text-sm sm:text-base mb-1">{post.title}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                              <button className="flex items-center space-x-1 hover:text-white">
                                <Heart size={14} />
                                <span>{post.totalLikes}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-white">
                                <MessageCircle size={14} />
                                <span>{post.totalComments}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-400">No additional content available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Membership Tab Content */}
            {activeTab === 'membership' && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Membership Options</h2>
                
                {/* Dynamic membership tiers */}
                <div className="space-y-4">
                  {creator.memberships && creator.memberships.length > 0 ? (
                    creator.memberships.map((membership, index) => (
                      <div 
                        key={membership.id} 
                        className={`bg-gray-700 rounded-lg p-6 border ${
                          membership.price === 0 ? 'border-green-500' : 'border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-semibold ${
                              membership.price === 0 ? 'text-green-400' : 'text-blue-400'
                            }`}>
                              {membership.name}
                            </h3>
                            <p className="text-gray-400 mt-1">
                              {membership.price === 0 
                                ? 'Follow to access free content' 
                                : 'Get access to all exclusive content'
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {membership.price === 0 ? 'Free' : `${membership.currency} ${membership.price}`}
                            </div>
                            <div className="text-sm text-gray-400">
                              {membership.price === 0 ? 'forever' : 'per month'}
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-300 mb-4">
                          {membership.price === 0 ? (
                            <>
                              <li>• Access to all free posts</li>
                              <li>• Public updates and announcements</li>
                              <li>• Community discussions</li>
                            </>
                          ) : (
                            <>
                              <li>• Everything in Free</li>
                              <li>• Access to all exclusive posts</li>
                              <li>• Member-only content</li>
                              <li>• Early access to new releases</li>
                              <li>• Behind-the-scenes content</li>
                              <li>• Direct messaging with creator</li>
                            </>
                          )}
                        </ul>
                        <Button 
                          onClick={membership.price === 0 ? handleFollow : () => setShowMembershipModal(true)}
                          disabled={membership.price === 0 ? toggleFollowMutation.isPending : false}
                          variant={membership.price === 0 ? "outline" : "default"}
                          className={`w-full ${
                            membership.price === 0 
                              ? (isFollowing 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-transparent border-green-500 text-green-400 hover:bg-green-900/20')
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {membership.price === 0 
                            ? (toggleFollowMutation.isPending ? 'Loading...' : (isFollowing ? 'Following' : 'Follow for Free'))
                            : 'Subscribe Now'
                          }
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No membership options available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About Tab Content */}
            {activeTab === 'about' && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">About {creator.creatorName}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {creator.bio || "This creator hasn't added an about section yet."}
                  </p>
                  
                  {/* Social Links */}
                  {creator.socialLinks && creator.socialLinks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {creator.socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                          >
                            <span className="text-sm font-medium">{link.platform}</span>
                            <ArrowRight size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {creator.tags && creator.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {creator.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {creator.category && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Category</h3>
                      <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {creator.category}
                      </span>
                    </div>
                  )}
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
          creatorName={creator.creatorName}
        />

        {/* Tip Modal */}
        <TipModal
          open={showTipModal}
          onOpenChange={setShowTipModal}
          creatorName={creator.creatorName}
        />

        {/* Subscription Required Modal */}
        <SubscriptionRequiredModal
          open={showSubscriptionModal}
          onOpenChange={setShowSubscriptionModal}
          creatorName={creator.creatorName}
          onSubscribe={() => setShowMembershipModal(true)}
        />
      </div>
  );
};

export default CreatorProfile;
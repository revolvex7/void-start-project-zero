import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MembershipModal } from '@/components/modals/MembershipModal';
import { TipModal } from '@/components/modals/TipModal';
import { SubscriptionRequiredModal } from '@/components/modals/SubscriptionRequiredModal';
import { ProductPurchaseModal } from '@/components/modals/ProductPurchaseModal';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useMembership } from '@/contexts/MembershipContext';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { creatorAPI, Creator } from '@/lib/api';
import { staticEvents } from '@/data/staticEvents';
import { Event } from '@/types/event';
import { useToggleFollow, useSubscribeMembership, useUnsubscribeMembership } from '@/hooks/useApi';
import { ProfileSkeleton } from '@/components/ui/content-skeletons';
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
  Check,
  ShoppingBag
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
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [eventInterests, setEventInterests] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toggleFollowMutation = useToggleFollow();
  const subscribeMutation = useSubscribeMembership();
  const unsubscribeMutation = useUnsubscribeMembership();

  // Helper function to darken color for hover state
  const darkenColor = (color: string, percent: number = 15) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  };

  // Get theme color with fallback
  const themeColor = creator?.themeColor || '#3b82f6'; // default blue
  const themeColorHover = darkenColor(themeColor, 15);

  // Fetch creator data
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
      setIsSubscribed(response.data.isSubscribed || false);
    } catch (err) {
      console.error('Error fetching creator data:', err);
      setError('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      const response = await toggleFollowMutation.mutateAsync(creator.id);
      
      // Update local state for immediate feedback
      const newFollowingState = response.data.isFollowing;
      setIsFollowing(newFollowingState);
      
      // Update creator's followers count
      setCreator(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: newFollowingState,
          followersCount: newFollowingState 
            ? prev.followersCount + 1 
            : Math.max(0, prev.followersCount - 1)
        };
      });
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

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleEventInterest = (eventId: string, interested: boolean) => {
    setEventInterests(prev => ({
      ...prev,
      [eventId]: interested
    }));
  };

  // Show loading state
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Show error state
  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'This creator profile could not be loaded.'}</p>
          <Button 
            onClick={() => navigate('/')} 
            style={{ backgroundColor: themeColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColorHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColor}
          >
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

        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: themeColor }}
        >
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
                    disabled={isSubscribed}
                    className={`text-white px-4 sm:px-6 py-2 text-sm sm:text-base font-medium shadow-lg transition-colors ${
                      isSubscribed ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    style={{ backgroundColor: themeColor }}
                    onMouseEnter={(e) => !isSubscribed && (e.currentTarget.style.backgroundColor = themeColorHover)}
                    onMouseLeave={(e) => !isSubscribed && (e.currentTarget.style.backgroundColor = themeColor)}
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Subscribed
                      </>
                    ) : (
                      'Subscribe'
                    )}
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
                  className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                    tab.active
                      ? 'text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                  style={tab.active ? { borderBottomColor: themeColor, color: themeColor } : {}}
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
                          <div className="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden">
                            {post.mediaFiles && post.mediaFiles.length > 0 ? (
                              <>
                                <img 
                                  src={post.mediaFiles[0]} 
                                  alt={post.title}
                                  className={`w-full h-full object-cover ${
                                    !post.public && !isSubscribed ? 'blur-md' : ''
                                  }`}
                                />
                                {!post.public && !isSubscribed && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <Lock className="w-12 h-12 text-white" />
                                  </div>
                                )}
                              </>
                            ) : (
                              post.public ? (
                                <Play className="w-8 h-8 text-white" />
                              ) : (
                                <Lock className="w-6 h-6 text-gray-400" />
                              )
                            )}
                            <div 
                              className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded"
                              style={{ backgroundColor: post.public ? '#16a34a' : themeColor }}
                            >
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

                {/* Events Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Events</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {staticEvents.length > 0 ? (
                      staticEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 transition-all"
                          style={{ '--hover-ring-color': themeColor } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.setProperty('--tw-ring-color', themeColor)}
                        >
                          <div className="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden">
                            {event.mediaUrl ? (
                              <img 
                                src={event.mediaUrl} 
                                alt={event.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-700">
                                <Calendar className="w-12 h-12 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-medium text-sm sm:text-base mb-1 line-clamp-1">{event.name}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                              {event.description || 'No description'}
                            </p>
                            {event.eventDate && (
                              <div className="flex items-center text-xs mb-3" style={{ color: themeColor }}>
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(event.eventDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEventInterest(event.id, true)}
                                className={`flex-1 text-xs ${
                                  eventInterests[event.id] === true
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                {eventInterests[event.id] === true ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    Interested
                                  </>
                                ) : (
                                  'Interested'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEventInterest(event.id, false)}
                                className={`flex-1 text-xs ${
                                  eventInterests[event.id] === false
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                {eventInterests[event.id] === false ? 'Not Interested' : 'Not Interested'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No events available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Products Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {creator.products && creator.products.length > 0 ? (
                      creator.products.map((product) => (
                        <div 
                          key={product.id} 
                          className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 transition-all"
                          style={{ '--hover-ring-color': themeColor } as React.CSSProperties}
                          onMouseEnter={(e) => e.currentTarget.style.setProperty('--tw-ring-color', themeColor)}
                        >
                          <div className="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden">
                            {product.mediaUrl ? (
                              <>
                                <img 
                                  src={product.mediaUrl} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                                {/* Lock Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                  <div className="text-center">
                                    <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                                    <p className="text-white text-xs font-medium">Payment Required</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-700">
                                <ShoppingBag className="w-12 h-12 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-medium text-sm sm:text-base mb-1 line-clamp-1">{product.name}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                              {product.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-lg font-bold" style={{ color: themeColor }}>
                                ₦{parseFloat(product.price || '0').toLocaleString()}
                              </p>
                              <Button
                                size="sm"
                                onClick={() => handleProductClick(product)}
                                className="text-white text-xs"
                                style={{ 
                                  backgroundColor: themeColor,
                                  '--hover-bg': themeColorHover 
                                } as React.CSSProperties}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColorHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColor}
                              >
                                <Lock className="w-3 h-3 mr-1" />
                                Buy Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No products available</p>
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
                    creator.memberships.map((membership) => {
                      const isFree = Number(membership.price) === 0;
                      const isUserSubscribed = membership.isSubscribed || false;
                      
                      const handleMembershipAction = async () => {
                        if (isFree) {
                          await handleFollow();
                        } else {
                          if (isUserSubscribed) {
                            // Unsubscribe - send creatorId
                            try {
                              await unsubscribeMutation.mutateAsync(creator.id);
                              await fetchCreatorData();
                            } catch (error) {
                              console.error('Unsubscribe failed:', error);
                            }
                          } else {
                            // Subscribe - send membershipId
                            try {
                              await subscribeMutation.mutateAsync(membership.id);
                              await fetchCreatorData();
                            } catch (error) {
                              console.error('Subscribe failed:', error);
                            }
                          }
                        }
                      };
                      
                      return (
                        <div 
                          key={membership.id} 
                          className={`bg-gray-700 rounded-lg p-6 border-2 transition-all ${
                            isFree 
                              ? 'border-green-500' 
                              : isUserSubscribed 
                                ? 'border-purple-500 bg-gradient-to-br from-gray-700 to-purple-900/20'
                                : 'border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-xl font-semibold ${
                                  isFree ? 'text-green-400' : isUserSubscribed ? 'text-purple-400' : 'text-blue-400'
                                }`}>
                                  {membership.name}
                                </h3>
                                {isUserSubscribed && !isFree && (
                                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check size={12} />
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">
                                {membership.description || (isFree 
                                  ? 'Follow to access free content' 
                                  : 'Get access to all exclusive content')}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold">
                                {isFree ? 'Free' : `${membership.currency} ${membership.price}`}
                              </div>
                              <div className="text-sm text-gray-400">
                                {isFree ? 'forever' : 'per month'}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleMembershipAction}
                            disabled={isFree ? toggleFollowMutation.isPending : (subscribeMutation.isPending || unsubscribeMutation.isPending)}
                            variant={isFree ? "outline" : "default"}
                            className={`w-full transition-colors font-semibold ${
                              isFree 
                                ? (isFollowing 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-transparent border-green-500 text-green-400 hover:bg-green-900/20')
                                : isUserSubscribed
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                  : 'text-white'
                            }`}
                            style={!isFree && !isUserSubscribed ? { backgroundColor: themeColor } : {}}
                            onMouseEnter={!isFree && !isUserSubscribed ? (e) => e.currentTarget.style.backgroundColor = themeColorHover : undefined}
                            onMouseLeave={!isFree && !isUserSubscribed ? (e) => e.currentTarget.style.backgroundColor = themeColor : undefined}
                          >
                            {isFree 
                              ? (toggleFollowMutation.isPending ? 'Loading...' : (isFollowing ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2 inline" />
                                    Following
                                  </>
                                ) : 'Follow for Free'))
                              : (subscribeMutation.isPending || unsubscribeMutation.isPending)
                                ? (
                                  <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isUserSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                                  </span>
                                )
                                : isUserSubscribed
                                  ? (
                                    <>
                                      <Check className="w-4 h-4 mr-2 inline" />
                                      Subscribed - Click to Unsubscribe
                                    </>
                                  )
                                  : 'Subscribe Now'
                            }
                          </Button>
                        </div>
                      );
                    })
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
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ 
                              backgroundColor: `${themeColor}33`, 
                              color: themeColor 
                            }}
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
          creatorId={creator.id}
          memberships={creator.memberships || []}
          onSubscribeSuccess={fetchCreatorData}
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

        {/* Product Purchase Modal */}
        <ProductPurchaseModal
          open={showProductModal}
          onOpenChange={setShowProductModal}
          product={selectedProduct}
          creatorName={creator.creatorName}
          themeColor={creator.themeColor}
        />
      </div>
  );
};

export default CreatorProfile;
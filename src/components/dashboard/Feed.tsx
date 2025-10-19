import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/useApi';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Video, 
  Star,
  Check,
  Clock,
  Play,
  Headphones,
  Image as ImageIcon,
  FileText,
  Calendar,
  User,
  Loader2
} from 'lucide-react';

interface Post {
  postId: string;
  postTitle: string;
  content: string;
  createdAt: string;
  tags: string[];
  attachedMedia: string[];
  creatorId: string;
  creatorImage: string | null;
  pageName: string;
  totalLikes: number;
  totalComments: number;
  isLiked?: boolean;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  subscribers: number;
  isVerified?: boolean;
}

export default function Feed() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: postsData, isLoading: loading, error, refetch } = usePosts(currentPage, 10);
  
  // Extract posts and pagination from response
  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination;
  
  // Local state for like functionality (will be replaced with mutation later)
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  
  // Update local posts when API data changes
  React.useEffect(() => {
    if (posts && Array.isArray(posts) && posts.length > 0) {
      if (currentPage === 1) {
        // First page - replace all posts
        setLocalPosts(posts);
      } else {
        // Subsequent pages - append new posts
        setLocalPosts(prev => {
          // Filter out duplicates by postId
          const newPosts = posts.filter(post => !prev.some(p => p.postId === post.postId));
          return [...prev, ...newPosts];
        });
      }
    } else if (Array.isArray(posts) && posts.length === 0 && currentPage === 1) {
      setLocalPosts([]);
    }
  }, [posts, currentPage]); // Depend on posts and currentPage

  // Keep mock data for fallback/development
  const mockPosts = [
    {
      id: '1',
      title: '10 Productivity Tips for Developers',
      description: 'Learn the essential productivity techniques that will help you become a more efficient developer.',
      creator: {
        name: 'Alex Johnson',
        avatar: 'AJ',
        category: 'Tech & Programming',
        isVerified: true
      },
      publishedAt: '2024-01-20',
      readTime: '8 min read',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      likes: 42,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      title: 'Building Beautiful UIs with React',
      description: 'A comprehensive guide to creating stunning user interfaces using React and modern CSS.',
      creator: {
        name: 'Sarah Chen',
        avatar: 'SC',
        category: 'UI/UX Design'
      },
      publishedAt: '2024-01-19',
      readTime: '12 min read',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=400&fit=crop',
      likes: 28,
      comments: 5,
      isLiked: true
    },
    {
      id: '3',
      title: 'Complete Workout Routine for Beginners',
      description: 'Start your fitness journey with this beginner-friendly workout routine.',
      creator: {
        name: 'Mike Rodriguez',
        avatar: 'MR',
        category: 'Fitness & Health',
        isVerified: true
      },
      publishedAt: '2024-01-18',
      readTime: '25 min',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
      likes: 156,
      comments: 23,
      isLiked: false
    },
    {
      id: '4',
      title: 'The Art of Digital Painting',
      description: 'Explore digital painting techniques and create stunning artwork.',
      creator: {
        name: 'Emma Wilson',
        avatar: 'EW',
        category: 'Art & Design'
      },
      publishedAt: '2024-01-17',
      readTime: '15 min read',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
      likes: 34,
      comments: 12,
      isLiked: false
    },
    {
      id: '5',
      title: 'Podcast: The Future of AI',
      description: 'Join us as we discuss the latest developments in artificial intelligence.',
      creator: {
        name: 'David Kim',
        avatar: 'DK',
        category: 'Technology'
      },
      publishedAt: '2024-01-16',
      readTime: '45 min',
      type: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      likes: 89,
      comments: 17,
      isLiked: true
    }
  ];

  // Mock suggested creators
  const suggestedCreators: Creator[] = [
    {
      id: '1',
      name: 'Lisa Thompson',
      avatar: 'LT',
      category: 'Photography',
      subscribers: 15400,
      isVerified: true
    },
    {
      id: '2',
      name: 'James Wilson',
      avatar: 'JW',
      category: 'Music Production',
      subscribers: 8900
    },
    {
      id: '3',
      name: 'Maria Garcia',
      avatar: 'MG',
      category: 'Cooking',
      subscribers: 23100,
      isVerified: true
    }
  ];


  const getPostIcon = (attachedMedia: string[]) => {
    if (!attachedMedia || attachedMedia.length === 0) {
      return <FileText className="w-4 h-4" />;
    }
    
    const firstMedia = attachedMedia[0];
    if (firstMedia.includes('.mp4') || firstMedia.includes('.webm')) {
      return <Play className="w-4 h-4" />;
    }
    if (firstMedia.includes('.mp3') || firstMedia.includes('.wav')) {
      return <Headphones className="w-4 h-4" />;
    }
    if (firstMedia.includes('.jpg') || firstMedia.includes('.png') || firstMedia.includes('.jpeg')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getPostTypeColor = (attachedMedia: string[]) => {
    if (!attachedMedia || attachedMedia.length === 0) {
      return 'text-blue-400';
    }
    
    const firstMedia = attachedMedia[0];
    if (firstMedia.includes('.mp4') || firstMedia.includes('.webm')) {
      return 'text-red-400';
    }
    if (firstMedia.includes('.mp3') || firstMedia.includes('.wav')) {
      return 'text-purple-400';
    }
    if (firstMedia.includes('.jpg') || firstMedia.includes('.png') || firstMedia.includes('.jpeg')) {
      return 'text-green-400';
    }
    return 'text-blue-400';
  };

  const getPostType = (attachedMedia: string[]) => {
    if (!attachedMedia || attachedMedia.length === 0) {
      return 'article';
    }
    
    const firstMedia = attachedMedia[0];
    if (firstMedia.includes('.mp4') || firstMedia.includes('.webm')) {
      return 'video';
    }
    if (firstMedia.includes('.mp3') || firstMedia.includes('.wav')) {
      return 'audio';
    }
    if (firstMedia.includes('.jpg') || firstMedia.includes('.png') || firstMedia.includes('.jpeg')) {
      return 'image';
    }
    return 'article';
  };

  const getCreatorInitials = (creatorId: string) => {
    // Generate initials from creatorId for now
    return creatorId.substring(0, 2).toUpperCase();
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleCreatorClick = (pageName: string, creatorId?: string) => {
    // Navigate to creator profile using the pageName from API
    // Pass creatorId in state for efficient API calls when available
    navigate(`/${pageName}`, { state: { creatorId } });
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPosts(localPosts.map(post => 
      post.postId === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            totalLikes: post.isLiked ? post.totalLikes - 1 : post.totalLikes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, just navigate to the post detail page where comments can be viewed/added
    navigate(`/post/${postId}`);
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Feed Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Feed</h1>
        <p className="text-gray-400">Latest posts from creators you follow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Loading posts...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">
                {error instanceof Error ? error.message : 'Failed to load posts. Please try again later.'}
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </div>
          ) : localPosts.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-300 mb-3">No posts yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Follow some creators to see their posts in your feed, or check out the explore page to discover new content.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard/explore')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Explore Creators
                </Button>
              </div>
            </div>
          ) : (
            localPosts.map((post) => (
              <div 
                key={post.postId}
                onClick={() => handlePostClick(post.postId)}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreatorClick(post.pageName, post.creatorId);
                    }}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                  >
                    {post.creatorImage ? (
                      <img 
                        src={post.creatorImage} 
                        alt="Creator" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{getCreatorInitials(post.creatorId)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreatorClick(post.pageName, post.creatorId);
                        }}
                        className="font-medium hover:text-blue-400 cursor-pointer transition-colors"
                      >
                        {post.pageName}
                      </h3>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">Creator</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 text-xs ${getPostTypeColor(post.attachedMedia)}`}>
                    {getPostIcon(post.attachedMedia)}
                    <span className="capitalize">{getPostType(post.attachedMedia)}</span>
                  </div>
                </div>

                {/* Post Media */}
                {post.attachedMedia && post.attachedMedia.length > 0 && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.attachedMedia[0]} 
                      alt={post.postTitle}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 hover:text-blue-400 transition-colors">
                    {post.postTitle}
                  </h2>
                  <p className="text-gray-400 line-clamp-3">{truncateContent(post.content)}</p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Footer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="text-blue-400 hover:text-blue-300 transition-colors">
                      Read more →
                    </span>
                  </div>
                  
                  {/* Like and Comment Actions */}
                  <div className="flex items-center space-x-6 pt-3 border-t border-gray-700">
                    <button
                      onClick={(e) => handleLike(post.postId, e)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.isLiked 
                          ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-900/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.totalLikes}</span>
                    </button>
                    
                    <button
                      onClick={(e) => handleComment(post.postId, e)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/10 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.totalComments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Load More - Only show if there are more posts */}
          {localPosts.length > 0 && pagination?.hasNextPage && (
            <div className="text-center py-8">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Creators */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Suggested Creators</h3>
            <div className="space-y-4">
              {suggestedCreators.map((creator) => (
                <div key={creator.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{creator.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h4 className="font-medium text-sm truncate">{creator.name}</h4>
                      {creator.isVerified && (
                        <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{creator.category}</p>
                    <p className="text-xs text-gray-500">{creator.subscribers.toLocaleString()} subscribers</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // For mock creators, use a fallback slug since they don't have pageName
                      const fallbackPageName = creator.name.toLowerCase().replace(/\s+/g, '-');
                      handleCreatorClick(fallbackPageName, creator.id);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-3 py-1"
                  >
                    <User className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

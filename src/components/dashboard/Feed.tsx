import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  User
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
    category: string;
    isVerified?: boolean;
  };
  publishedAt: string;
  readTime?: string;
  type: 'article' | 'video' | 'audio' | 'image';
  thumbnail: string;
  likes: number;
  comments: number;
  isLiked: boolean;
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

  // Mock feed data - showing posts from subscribed creators
  const [posts, setPosts] = useState<Post[]>([
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
  ]);

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


  const getPostIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-400';
      case 'audio': return 'text-purple-400';
      case 'image': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleCreatorClick = (creatorName: string) => {
    navigate(`/${creatorName.toLowerCase().replace(' ', '-')}`);
  };

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, just navigate to the post detail page where comments can be viewed/added
    navigate(`/post/${postId}`);
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
          {posts.map((post) => (
            <div 
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            >
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreatorClick(post.creator.name);
                  }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                >
                  <span className="text-sm font-semibold">{post.creator.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreatorClick(post.creator.name);
                      }}
                      className="font-medium hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {post.creator.name}
                    </h3>
                    {post.creator.isVerified && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">{post.creator.category}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 text-xs ${getPostTypeColor(post.type)}`}>
                  {getPostIcon(post.type)}
                  <span className="capitalize">{post.type}</span>
                </div>
              </div>

              {/* Post Thumbnail */}
              {post.thumbnail && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 line-clamp-2">{post.description}</p>
              </div>

              {/* Post Footer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {post.readTime && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  )}
                  <span className="text-blue-400 hover:text-blue-300 transition-colors">
                    Read more →
                  </span>
                </div>
                
                {/* Like and Comment Actions */}
                <div className="flex items-center space-x-6 pt-3 border-t border-gray-700">
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      post.isLiked 
                        ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                        : 'text-gray-400 hover:text-red-400 hover:bg-red-900/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleComment(post.id, e)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/10 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          <div className="text-center py-8">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Load More Posts
            </Button>
          </div>
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
                      handleCreatorClick(creator.name);
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

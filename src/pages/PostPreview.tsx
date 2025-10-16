import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostById } from '@/hooks/useApi';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Clock,
  Heart,
  MessageSquare,
  Send,
  Menu,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface MediaFile {
  id: string;
  type: string;
  url: string;
  name: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface PostData {
  id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  title: string;
  content: string;
  accessType: string;
  tags: string[];
  totalLikes: number;
  creatorName: string;
  creatorImage: string | null;
  categoryName: string | null;
  mediaFiles: MediaFile[];
  comments: any[];
}

export default function PostPreview() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Fetch post data using React Query
  const { data: post, isLoading, error, refetch } = usePostById(postId || '');
  
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Update likes when post data loads
  useEffect(() => {
    if (post) {
      setLikes(post.totalLikes);
    }
  }, [post]);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      avatar: 'SC',
      content: 'Great tips! The Pomodoro technique has really helped me stay focused during long coding sessions.',
      timestamp: '2 hours ago',
      likes: 5,
      isLiked: false
    },
    {
      id: '2',
      author: 'Mike Rodriguez',
      avatar: 'MR',
      content: 'I especially love the part about automating repetitive tasks. It\'s a game changer!',
      timestamp: '4 hours ago',
      likes: 3,
      isLiked: true
    },
    {
      id: '3',
      author: 'Emma Wilson',
      avatar: 'EW',
      content: 'Thanks for sharing! Will definitely try implementing these in my workflow.',
      timestamp: '6 hours ago',
      likes: 2,
      isLiked: false
    }
  ]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-post');
      const menuButton = document.getElementById('mobile-menu-button-post');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  // Helper functions
  const getCreatorInitials = (creatorName: string) => {
    return creatorName.split(' ').map(name => name[0]).join('').toUpperCase() || 'CR';
  };
  
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };
  
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  };

  const handleGoBack = () => {
    navigate('/dashboard?view=fan');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'YU',
        content: newComment,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="mobile-menu-button-post"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <Button 
          onClick={handleGoBack}
          variant="ghost" 
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Button>

        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `} id="mobile-sidebar-post">
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 z-40">
          <Button 
            onClick={handleGoBack}
            variant="ghost" 
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>

        {/* Post Content */}
        <div className="max-w-4xl mx-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Loading post...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-400 mb-2">Failed to load post</h3>
              <p className="text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </div>
          ) : !post ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Post not found</h3>
              <p className="text-gray-400 mb-4">The post you're looking for doesn't exist or has been removed.</p>
              <Button 
                onClick={handleGoBack}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Feed
              </Button>
            </div>
          ) : (
            <>
              {/* Post Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-xl text-gray-400 mb-6">{stripHtmlTags(post.content)}</p>

                {/* Creator Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {post.creatorImage ? (
                      <img 
                        src={post.creatorImage} 
                        alt="Creator" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{getCreatorInitials(post.creatorName)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{post.creatorName}</h3>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{post.categoryName || 'Creator'}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getReadTime(post.content)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.accessType === 'free' ? 'Free' : 'Premium'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-700">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-900/10'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/10 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">{comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Files */}
              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div className="mb-8">
                  <div className="grid gap-4">
                    {post.mediaFiles.map((media) => (
                      <div key={media.id} className="rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt={media.name}
                            className="w-full h-auto object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <video 
                            src={media.url} 
                            controls
                            className="w-full h-auto"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400">File: {media.name}</p>
                            <a 
                              href={media.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-invert prose-lg max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

                {/* Add Comment */}
                <div className="mb-8">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">YU</span>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mb-3"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{comment.author}</h4>
                            <span className="text-sm text-gray-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className={`flex items-center space-x-1 text-sm transition-colors ${
                                comment.isLiked 
                                  ? 'text-red-400' 
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

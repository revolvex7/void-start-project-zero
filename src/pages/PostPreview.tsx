import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostById } from '@/hooks/useApi';
import { postAPI, Comment } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { PostPreviewSkeleton } from '@/components/ui/content-skeletons';
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
  AlertCircle,
  Trash2
} from 'lucide-react';

interface ApiComment {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userImage: string | null;
  parentId: string | null;
}

interface LocalComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn?: boolean; // To identify user's own comments
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
  isLiked: boolean;
  creatorName: string;
  creatorImage: string | null;
  categoryName: string | null;
  mediaFiles: MediaFile[];
  comments: ApiComment[];
}

export default function PostPreview() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch post data using React Query
  const { data: post, isLoading, error, refetch } = usePostById(postId || '');
  
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null);
  const [comments, setComments] = useState<LocalComment[]>([]);
  
  // Helper function to convert API comments to local comments
  const convertApiCommentsToLocal = (apiComments: ApiComment[]): LocalComment[] => {
    return apiComments.map(apiComment => ({
      id: apiComment.id,
      author: apiComment.userName,
      avatar: getCreatorInitials(apiComment.userName),
      content: apiComment.comment,
      timestamp: formatTimestamp(apiComment.createdAt),
      isOwn: user?.id === apiComment.userId
    }));
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Update likes and comments when post data loads
  useEffect(() => {
    if (post) {
      setLikes(post.totalLikes);
      setIsLiked(post.isLiked);
      setComments(convertApiCommentsToLocal(post.comments));
    }
  }, [post, user]);

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

  const handleLike = async () => {
    if (!postId) return;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    try {
      let response;
      if (isLiked) {
        response = await postAPI.unlike(postId);
      } else {
        response = await postAPI.like(postId);
      }
      
      // Update with real data from API response
      if (response?.data) {
        setIsLiked(response.data.isLiked);
        setLikes(response.data.totalLikes);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
      // Silently continue - UI already updated optimistically
    }
  };


  const handleAddComment = async () => {
    if (!newComment.trim() || !postId) return;
    
    setIsAddingComment(true);
    
    // Add comment optimistically to UI
    const comment: LocalComment = {
      id: Date.now().toString(),
      author: user?.name || 'You',
      avatar: getCreatorInitials(user?.name || 'You'),
      content: newComment,
      timestamp: 'Just now',
      isOwn: true
    };
    setComments([comment, ...comments]);
    setNewComment('');
    
    try {
      await postAPI.addComment(postId, newComment.trim());
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Silently continue - UI already updated optimistically
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsDeletingComment(commentId);
    
    // Remove comment from UI optimistically
    setComments(comments.filter(comment => comment.id !== commentId));
    
    try {
      await postAPI.deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      // Silently continue - UI already updated optimistically
    } finally {
      setIsDeletingComment(null);
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
            <PostPreviewSkeleton />
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

              </div>

              {/* Post Content */}
              <div className="prose prose-invert max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Media Files */}
              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div className="mb-8">
                  <div className={`grid gap-4 ${
                    post.mediaFiles.length === 1 ? 'grid-cols-1' : 
                    post.mediaFiles.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {post.mediaFiles.map((file) => (
                      <div key={file.id} className="rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-auto object-cover"
                          />
                        ) : file.type === 'video' ? (
                          <video 
                            src={file.url} 
                            controls
                            className="w-full h-auto"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-300 mb-2">{file.name}</p>
                            <a 
                              href={file.url} 
                              download={file.name}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Download File
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Like and Comment Buttons */}
              <div className="flex items-center gap-6 py-4 border-t border-b border-gray-700 mb-8">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likes}</span>
                </button>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                  <span>{comments.length}</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6">Comments ({comments.length})</h3>
                
                {/* Add Comment */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {getCreatorInitials(user?.name || 'You')}
                  </div>
                  <div className="flex-1 flex gap-3">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && !isAddingComment && handleAddComment()}
                      disabled={isAddingComment}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={isAddingComment || !newComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
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
                          {/* Delete button - only show for user's own comments */}
                          <div className="flex justify-end">
                            {comment.isOwn && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={isDeletingComment === comment.id}
                                className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeletingComment === comment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            )}
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

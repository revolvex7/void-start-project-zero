import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Clock,
  Heart,
  MessageSquare,
  Send,
  Menu,
  X
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

export default function PostPreview() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [newComment, setNewComment] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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

  // Mock post data - in real app, fetch based on postId
  const post = {
    id: postId,
    title: "10 Productivity Tips for Developers",
    description: "Learn the essential productivity techniques that will help you become a more efficient developer. From time management to code organization, these tips will transform your workflow.",
    content: `
      <h2>Introduction</h2>
      <p>As developers, we're constantly looking for ways to improve our productivity and write better code. In this comprehensive guide, I'll share 10 proven techniques that have helped me and thousands of other developers become more efficient.</p>
      
      <h3>1. Use the Pomodoro Technique</h3>
      <p>Break your work into 25-minute focused sessions followed by 5-minute breaks. This helps maintain concentration and prevents burnout.</p>
      
      <h3>2. Master Your IDE</h3>
      <p>Learn keyboard shortcuts, customize your environment, and use extensions that automate repetitive tasks.</p>
      
      <h3>3. Write Clean, Readable Code</h3>
      <p>Code is read more often than it's written. Focus on clarity and maintainability over cleverness.</p>
      
      <h3>4. Use Version Control Effectively</h3>
      <p>Make small, frequent commits with descriptive messages. Use branching strategies that work for your team.</p>
      
      <h3>5. Automate Repetitive Tasks</h3>
      <p>Whether it's testing, deployment, or code formatting, automation saves time and reduces errors.</p>
    `,
    creator: {
      name: "Alex Johnson",
      avatar: "AJ",
      category: "Tech & Programming"
    },
    publishedAt: "2024-01-20",
    readTime: "8 min read",
    type: "article",
    thumbnail: null
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
          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-gray-400 mb-6">{post.description}</p>
            
            {/* Creator Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{post.creator.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{post.creator.name}</h3>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{post.creator.category}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Like and Comment Actions */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex items-center space-x-6 mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-900/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likes} likes</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/10 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">{comments.length} comments</span>
              </button>
            </div>

            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">YU</span>
                </div>
                <div className="flex-1">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                </div>
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{comment.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-sm">{comment.author}</h4>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 ml-4">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          comment.isLiked 
                            ? 'text-red-400' 
                            : 'text-gray-500 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}

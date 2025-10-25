import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { useMyPosts, useDeletePost } from '@/hooks/useApi';
import { LibrarySkeleton } from '@/components/ui/content-skeletons';
import { 
  Search, 
  MoreHorizontal,
  FileText,
  Trash2,
  Menu,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const Library = () => {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch posts from API
  const { data: postsData, isLoading, error, refetch } = useMyPosts(currentPage, 10);
  const deletePostMutation = useDeletePost();
  
  // Extract posts and pagination from response
  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-library');
      const menuButton = document.getElementById('mobile-menu-button-library');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  // Filter posts based on search query
  const filteredPosts = posts.filter((post: any) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  // Get access type label
  const getAccessLabel = (accessType: string) => {
    if (accessType === 'free') return 'Public';
    if (accessType === 'paid') return 'Paid members';
    return 'Members only';
  };
  
  // Get access type color
  const getAccessColor = (accessType: string) => {
    if (accessType === 'free') return 'bg-green-900 text-green-300';
    if (accessType === 'paid') return 'bg-purple-900 text-purple-300';
    return 'bg-blue-900 text-blue-300';
  };


  const handlePostClick = (postId: string) => {
    navigate(`/create-post?id=${postId}`);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      await deletePostMutation.mutateAsync(postToDelete);
      // Refetch posts after deletion
      await refetch();
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      alert(error.message || 'Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          id="mobile-menu-button-library"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Library</h1>
        <div className="w-8" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `} id="mobile-sidebar-library">
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6">
          {/* Header - Hidden on mobile since it's in the fixed header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Library</h1>
            <p className="text-gray-400">Manage your posts</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white w-full"
              />
            </div>
            <Button
              onClick={handleCreatePost}
              className="bg-white text-black hover:bg-gray-100 font-semibold whitespace-nowrap"
            >
              Create a post
            </Button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LibrarySkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">
                {error instanceof Error ? error.message : 'Failed to load posts'}
              </p>
              <Button 
                onClick={() => refetch()}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Try Again
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">
                Use your library to keep track of everything you publish. Post an update today to kick things off.
              </p>
              <Button
                onClick={handleCreatePost}
                className="bg-white text-black hover:bg-gray-100 font-semibold"
              >
                Create a post
              </Button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                <div className="col-span-6">Title</div>
                <div className="col-span-2 flex items-center cursor-pointer hover:text-white">
                  Publish date
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="col-span-3">Access</div>
              </div>

              {/* Table Content */}
              <div className="divide-y divide-gray-700">
                {filteredPosts.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => handlePostClick(item.id)}
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-white flex-1 pr-2">{item.title || 'Untitled Post'}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === item.id ? null : item.id);
                          }}
                          className="p-1 hover:bg-gray-600 rounded relative"
                        >
                          <MoreHorizontal size={16} className="text-gray-400" />
                          {openMenuId === item.id && (
                            <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-10 w-32">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(item.id);
                                }}
                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center space-x-2"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-300">{formatDate(item.createdAt)}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${getAccessColor(item.accessType)}`}>
                            {getAccessLabel(item.accessType)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="font-medium text-white">{item.title || 'Untitled Post'}</div>
                      </div>
                      <div className="col-span-2 text-gray-300">
                        {formatDate(item.createdAt)}
                      </div>
                      <div className="col-span-3">
                        <span className={`px-2 py-1 rounded text-xs ${getAccessColor(item.accessType)}`}>
                          {getAccessLabel(item.accessType)}
                        </span>
                      </div>
                      <div className="col-span-1 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === item.id ? null : item.id);
                          }}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          <MoreHorizontal size={16} className="text-gray-400" />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-10 w-32">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.id);
                              }}
                              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center space-x-2"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalPosts} total)
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Delete Post?</h3>
                <p className="text-gray-400">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPostToDelete(null);
                }}
                disabled={isDeleting}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

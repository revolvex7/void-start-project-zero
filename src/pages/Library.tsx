import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { 
  Filter, 
  Search, 
  MoreHorizontal,
  FileText,
  Calendar,
  Eye,
  Edit3
} from 'lucide-react';

const Library = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Mock data for posts
  const mockPosts = [
    {
      id: '1',
      title: 'Voluptatem ducimus',
      publishDate: '8 Oct 2025',
      access: 'Public',
      type: '3 words',
      status: 'published'
    },
    {
      id: '2',
      title: 'Behind the scenes content',
      publishDate: '7 Oct 2025',
      access: 'Paid members',
      type: 'Image + text',
      status: 'published'
    },
    {
      id: '3',
      title: 'Monthly update video',
      publishDate: '5 Oct 2025',
      access: 'Free members',
      type: 'Video',
      status: 'published'
    }
  ];

  // Mock data for drafts
  const mockDrafts = [
    {
      id: '4',
      title: 'Upcoming project announcement',
      publishDate: 'Draft',
      access: 'Public',
      type: 'Text + images',
      status: 'draft'
    },
    {
      id: '5',
      title: 'Q&A session recap',
      publishDate: 'Draft',
      access: 'Paid members',
      type: 'Video + text',
      status: 'draft'
    }
  ];

  const currentData = activeTab === 'posts' ? mockPosts : mockDrafts;

  const handlePostClick = (postId: string) => {
    navigate(`/create-post?id=${postId}`);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Library</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `}>
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Library</h1>
            <p className="text-gray-400">Manage your posts and drafts</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'drafts'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Drafts
              </button>
            </nav>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-gray-800 border-gray-600 text-white w-64"
                />
              </div>
            </div>
            <Button
              onClick={handleCreatePost}
              className="bg-white text-black hover:bg-gray-100 font-semibold"
            >
              Create a post
            </Button>
          </div>

          {/* Content */}
          {currentData.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {activeTab === 'posts' ? 'No posts yet' : 'No drafts yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'posts' 
                  ? 'Use your library to keep track of everything you publish. Post an update today to kick things off.'
                  : 'Start writing a post and save it as a draft to see it here.'
                }
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
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                <div className="col-span-1">
                  <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                </div>
                <div className="col-span-4">Title</div>
                <div className="col-span-2 flex items-center cursor-pointer hover:text-white">
                  Publish date
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="col-span-2">Access</div>
                <div className="col-span-2">Post type</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Content */}
              <div className="divide-y divide-gray-700">
                {currentData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => handlePostClick(item.id)}
                  >
                    <div className="col-span-1">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-600 bg-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="font-medium text-white">{item.title}</div>
                    </div>
                    <div className="col-span-2 text-gray-300">
                      {item.publishDate}
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.access === 'Public' 
                          ? 'bg-green-900 text-green-300'
                          : item.access === 'Paid members'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-blue-900 text-blue-300'
                      }`}>
                        {item.access}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-300 flex items-center">
                      <FileText size={14} className="mr-2" />
                      {item.type}
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <MoreHorizontal size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-700 flex items-center justify-center space-x-4">
                <button className="p-2 hover:bg-gray-700 rounded disabled:opacity-50" disabled>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-400">1 - 1 of 1</span>
                <button className="p-2 hover:bg-gray-700 rounded disabled:opacity-50" disabled>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;

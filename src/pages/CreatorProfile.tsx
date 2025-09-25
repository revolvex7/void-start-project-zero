import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Settings, Share, MoreHorizontal, Play, Lock, Heart, MessageCircle, Eye } from 'lucide-react';
import { MembershipModal } from '@/components/modals/MembershipModal';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

// Mock creator data
const creatorData = {
  'dee-shanell': {
    name: 'Dee Shanell',
    posts: '1,822',
    description: 'Here I will be reacting to content I am not able to react to on Youtube such as anime, tv shows, music videos, etc. This is also a personal community where I can be in close contact with my supporters! Youtube.com/DeeShanell',
    avatar: '🎬',
    coverImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&h=400&fit=crop',
    memberCount: '2.1k',
    isVerified: true
  },
  'brad-evans': {
    name: 'Brad Evans',
    posts: '588',
    description: 'Creating entertainment huns!',
    avatar: '🎭',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=400&fit=crop',
    memberCount: '3.8k',
    isVerified: true
  }
};

const posts = [
  {
    id: 1,
    title: 'Cardi B - "Am I The DRAMA?" (album reaction/review)',
    description: 'Latest reaction video to Cardi B\'s new album',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    duration: '1:16:45',
    likes: 212,
    comments: 262,
    views: '3.2k',
    timeAgo: '3 days ago',
    isLocked: false,
    isPinned: true
  },
  {
    id: 2,
    title: 'GloRilla - Briana (Young Thug Diss)',
    description: 'Reaction to the latest diss track',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    duration: '12:30',
    likes: 81,
    comments: 47,
    views: '1.8k',
    timeAgo: '16 September',
    isLocked: true
  },
  {
    id: 3,
    title: 'KATSEYE Performs "Gnarly" | 2025 VMAs',
    description: 'VMA performance reaction',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    duration: '8:45',
    likes: 137,
    comments: 44,
    views: '2.1k',
    timeAgo: '12 September',
    isLocked: true
  },
  {
    id: 4,
    title: 'Doja Cat Performs "Jealous Type" | 2025 VMAs',
    description: 'Another amazing VMA performance',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    duration: '6:22',
    likes: 124,
    comments: 31,
    views: '1.5k',
    timeAgo: '12 September',
    isLocked: true
  }
];

export default function CreatorProfile() {
  const { creatorName } = useParams();
  const navigate = useNavigate();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  
  const creator = creatorData[creatorName as keyof typeof creatorData] || creatorData['dee-shanell'];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Email Verification Banner */}
          <div className="bg-gray-900 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-gray-800">
            <span className="text-xs sm:text-sm text-gray-300">Please verify your email address</span>
            <Button variant="outline" size="sm" className="bg-white text-black border-white hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3">
              Verify email
            </Button>
          </div>

          {/* Creator Header */}
          <div className="relative">
            {/* Cover Image */}
            <div 
              className="h-48 sm:h-64 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800 relative"
              style={{
                backgroundImage: `url(${creator.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Header Actions */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center space-x-2 sm:space-x-3">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 sm:p-2">
                  <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 sm:p-2">
                  <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Creator Info */}
            <div className="px-3 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold -mt-8 sm:-mt-10 border-4 border-black flex-shrink-0">
                    {creator.avatar}
                  </div>
                  <div className="pt-1 sm:pt-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-white">{creator.name}</h1>
                      {creator.isVerified && <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>}
                    </div>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">{creator.posts} posts</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowMembershipModal(true)}
                  className="bg-white text-black hover:bg-gray-100 px-4 sm:px-6 text-sm sm:text-base w-full sm:w-auto"
                >
                  Join now
                </Button>
              </div>

              {/* Description */}
              <div className="mt-4 max-w-3xl">
                <p className="text-gray-300 leading-relaxed">{creator.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="text-sm">
                  <span className="font-semibold text-white">{creator.memberCount}</span>
                  <span className="text-gray-400 ml-1">paid members</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-white">{creator.posts}</span>
                  <span className="text-gray-400 ml-1">Posts</span>
                </div>
              </div>

              {/* Become a Member Button */}
              <div className="mt-6">
                <Button 
                  onClick={() => setShowMembershipModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                >
                  Become a member
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  📷
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  🐦
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-800 px-3 sm:px-6">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              {['Home', 'Posts', 'Collections', 'Chats', 'About'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 sm:py-3 px-1 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab
                      ? 'border-green-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Latest Post Section */}
          <div className="px-3 sm:px-6 py-4 sm:py-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Latest post</h2>
            
            {/* Featured Post */}
            {posts[0] && (
              <div className="mb-8">
                <div className="relative group cursor-pointer">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={posts[0].thumbnail} 
                      alt={posts[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity"></div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                      {posts[0].duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-black ml-1" />
                      </div>
                    </div>
                    {posts[0].isPinned && (
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Pinned
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{posts[0].title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{posts[0].timeAgo}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{posts[0].likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{posts[0].comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                Recent posts
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    ←
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    →
                  </Button>
                </div>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {posts.slice(1).map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className={`w-full h-full object-cover transition-all ${
                          post.isLocked ? 'blur-sm' : 'group-hover:scale-105'
                        }`}
                      />
                      {post.isLocked ? (
                        <>
                          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                              <p className="text-white text-sm">Locked</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {post.duration}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-black ml-0.5" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-white mb-1 group-hover:text-gray-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span>{post.timeAgo}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    </SidebarProvider>
  );
}
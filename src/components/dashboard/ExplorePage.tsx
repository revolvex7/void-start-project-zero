import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Star, Users, Play, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Creator } from '@/lib/api';
import { useCreators, useToggleFollow, useCategories } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/content-skeletons';


const featuredContent = [
  {
    id: 1,
    title: 'Digital Art Masterclass: From Sketch to Finish',
    creator: 'Digital Dreams Studio',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    duration: '45:32',
    likes: '189',
    type: 'video'
  },
  {
    id: 2,
    title: 'The Future of AI in Creative Industries',
    creator: 'Tech Talk Daily',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    duration: '28:15',
    likes: '156',
    type: 'video'
  },
  {
    id: 3,
    title: 'Behind the Beat: Creating Lo-Fi Hip Hop',
    creator: 'Melody Makers',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    duration: '32:48',
    likes: '278',
    type: 'audio'
  }
];

interface ExplorePageProps {
  onCreatorClick: (pageName: string, creatorId: string) => void;
}

export function ExplorePage({ onCreatorClick }: ExplorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCreatorId, setLoadingCreatorId] = useState<string | null>(null);

  // Use React Query hooks
  const { 
    data: creators = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useCreators();
  
  const { 
    data: apiCategories = [], 
    isLoading: categoriesLoading 
  } = useCategories();
  
  const toggleFollowMutation = useToggleFollow();
  
  // Build categories list: Add 'All', 'Trending', 'New creators' + API categories
  const categories = [
    'All', 
    'Trending', 
    'New creators',
    ...apiCategories.map(cat => cat.name)
  ];

  const handleFollowClick = async (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingCreatorId(creatorId);
    try {
      const result = await toggleFollowMutation.mutateAsync(creatorId);
      console.log('Follow toggle result:', result);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      // Small delay to ensure cache update completes
      setTimeout(() => setLoadingCreatorId(null), 100);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesCategory = selectedCategory === 'All' || 
                           selectedCategory === 'Trending' || 
                           selectedCategory === 'New creators' ||
                           creator.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = creator.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (creator.tags && creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Creators</h1>
        <p className="text-gray-400">Discover amazing creators and their content</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, topics, or tags..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categoriesLoading ? (
          // Loading skeleton for categories
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-800 rounded-md animate-pulse" />
            ))}
          </>
        ) : (
          categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              {category}
            </Button>
          ))
        )}
      </div>

      {/* Featured Content Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <TrendingUp className="mr-2" size={24} />
            Featured Content
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map((content) => (
            <div key={content.id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer group">
              <div className="relative">
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {content.type === 'video' ? <Play size={12} className="inline mr-1" /> : '🎵'}
                  {content.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{content.creator}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <Heart size={12} className="mr-1" />
                    {content.likes} likes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creators Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory === 'All' ? 'All Creators' : `${selectedCategory} Creators`}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-300">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <GridSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">{error instanceof Error ? error.message : 'Failed to load creators'}</p>
            <Button 
              onClick={() => refetch()}
              variant="outline" 
              className="bg-gray-800 border-gray-700 text-gray-300"
            >
              Try Again
            </Button>
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No creators found matching your criteria</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="outline" 
              className="bg-gray-800 border-gray-700 text-gray-300"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <div 
                key={creator.id}
                onClick={() => onCreatorClick(creator.pageName, creator.id)}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer group"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={creator.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.creatorName)}&background=6366f1&color=fff&size=64`}
                      alt={creator.creatorName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {creator.subscribersCount > 10 && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star size={12} className="text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                      {creator.creatorName}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {creator.bio || 'No description available'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {creator.subscribersCount} subscribers
                      </span>
                      <span className="flex items-center">
                        <Heart size={12} className="mr-1" />
                        {creator.followersCount} followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded capitalize">
                    {creator.category}
                  </span>
                  <Button 
                    size="sm" 
                    className={creator.isFollowing ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                    onClick={(e) => handleFollowClick(creator.id, e)}
                    disabled={loadingCreatorId === creator.id}
                  >
                    {loadingCreatorId === creator.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Loading...
                      </>
                    ) : (
                      creator.isFollowing ? 'Following' : 'Follow'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {!loading && !error && filteredCreators.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            Load More Creators
          </Button>
        </div>
      )}
    </div>
  );
}

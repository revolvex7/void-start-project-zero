import React, { useState, useMemo } from 'react';
import { Search, Star, Users, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Creator } from '@/lib/api';
import { useCreators, useToggleFollow, useCategories } from '@/hooks/useApi';
import { GridSkeleton } from '@/components/ui/content-skeletons';



interface ExplorePageProps {
  onCreatorClick: (pageName: string, creatorId: string) => void;
}

export function ExplorePage({ onCreatorClick }: ExplorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCreatorId, setLoadingCreatorId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);

  // Use React Query hooks
  const { 
    data: creatorsResponse, 
    isLoading: loading, 
    error,
    refetch 
  } = useCreators(page, 10);
  
  const { 
    data: apiCategories = [], 
    isLoading: categoriesLoading 
  } = useCategories();
  
  const toggleFollowMutation = useToggleFollow();
  
  // Build categories list: Only 'All' + API categories
  const categories = useMemo(() => [
    'All',
    ...apiCategories.map(cat => cat.name)
  ], [apiCategories]);

  // Accumulate creators as pages load
  React.useEffect(() => {
    if (creatorsResponse?.creators) {
      if (page === 1) {
        setAllCreators(creatorsResponse.creators);
      } else {
        setAllCreators(prev => [...prev, ...creatorsResponse.creators]);
      }
    }
  }, [creatorsResponse, page]);

  const pagination = creatorsResponse?.pagination;

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

  const filteredCreators = useMemo(() => {
    return allCreators.filter(creator => {
      const matchesCategory = selectedCategory === 'All' || 
                             creator.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = creator.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (creator.tags && creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [allCreators, selectedCategory, searchQuery]);

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

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
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-800 rounded-md animate-pulse" />
            ))}
          </>
        ) : (
          categories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap capitalize ${
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

      {/* Creators Grid */}
      <div className="mb-8">
        {loading && page === 1 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <div 
                  key={creator.id}
                  onClick={() => onCreatorClick(creator.pageName, creator.id)}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-blue-500/50"
                >
                  {/* Profile Section */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all">
                          <img
                            src={creator.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.creatorName)}&background=6366f1&color=fff&size=128`}
                            alt={creator.creatorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {creator.subscribersCount > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-gray-800">
                            <CheckCircle2 size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors truncate">
                          {creator.creatorName}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {creator.bio || 'No description available'}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 mb-4 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Users size={14} className="mr-1.5" />
                        <span className="font-medium">{creator.subscribersCount}</span>
                        <span className="ml-1">subscribers</span>
                      </span>
                      <span className="flex items-center">
                        <Heart size={14} className="mr-1.5" />
                        <span className="font-medium">{creator.followersCount}</span>
                        <span className="ml-1">followers</span>
                      </span>
                    </div>

                    {/* Tags */}
                    {creator.tags && creator.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {creator.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md capitalize font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {creator.tags.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                            +{creator.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-750/50 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 bg-gray-700 px-3 py-1.5 rounded-md capitalize">
                      {creator.category}
                    </span>
                    <Button 
                      size="sm" 
                      className={creator.isFollowing 
                        ? "bg-gray-600 hover:bg-gray-700 text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      }
                      onClick={(e) => handleFollowClick(creator.id, e)}
                      disabled={loadingCreatorId === creator.id}
                    >
                      {loadingCreatorId === creator.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          <span className="text-xs">Loading...</span>
                        </>
                      ) : (
                        <span className="text-xs font-medium">
                          {creator.isFollowing ? 'Following' : 'Follow'}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {loading && page > 1 && (
              <div className="flex justify-center mt-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Load More */}
      {!loading && !error && pagination && pagination.hasNextPage && filteredCreators.length >= 10 && (
        <div className="text-center mt-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline" 
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-blue-500 transition-all px-8 py-6 text-base font-medium"
          >
            Load More Creators
          </Button>
        </div>
      )}
    </div>
  );
}

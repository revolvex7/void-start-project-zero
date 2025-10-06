import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Star, Users, Play, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  'All', 'Trending', 'New creators', 'Art & Design', 'Music', 'Gaming', 
  'Podcasts', 'Comedy', 'Education', 'Lifestyle', 'Technology', 'Sports'
];

const trendingCreators = [
  {
    id: 1,
    name: 'Digital Dreams Studio',
    description: 'Creating stunning digital art tutorials and speedpaints',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
    category: 'Art & Design',
    subscribers: '12.5K',
    monthlyEarnings: '₦2,400,000',
    isVerified: true,
    tags: ['Digital Art', 'Tutorials', 'Speedpaint']
  },
  {
    id: 2,
    name: 'Tech Talk Daily',
    description: 'Breaking down the latest in tech and innovation',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    category: 'Technology',
    subscribers: '8.9K',
    monthlyEarnings: '₦1,800,000',
    isVerified: true,
    tags: ['Tech News', 'Reviews', 'Innovation']
  },
  {
    id: 3,
    name: 'Melody Makers',
    description: 'Original music production and behind-the-scenes content',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    category: 'Music',
    subscribers: '15.2K',
    monthlyEarnings: '₦3,200,000',
    isVerified: true,
    tags: ['Music Production', 'Original Songs', 'BTS']
  },
  {
    id: 4,
    name: 'Game Dev Chronicles',
    description: 'Indie game development journey and tutorials',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    category: 'Gaming',
    subscribers: '6.7K',
    monthlyEarnings: '₦1,400,000',
    isVerified: false,
    tags: ['Game Dev', 'Indie Games', 'Tutorials']
  },
  {
    id: 5,
    name: 'Comedy Central Hub',
    description: 'Stand-up comedy and sketch content',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    category: 'Comedy',
    subscribers: '22.1K',
    monthlyEarnings: '₦4,800,000',
    isVerified: true,
    tags: ['Stand-up', 'Sketches', 'Comedy']
  },
  {
    id: 6,
    name: 'Fitness Journey',
    description: 'Personal training and wellness content',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
    category: 'Lifestyle',
    subscribers: '18.3K',
    monthlyEarnings: '₦3,600,000',
    isVerified: true,
    tags: ['Fitness', 'Wellness', 'Training']
  }
];

const featuredContent = [
  {
    id: 1,
    title: 'Digital Art Masterclass: From Sketch to Finish',
    creator: 'Digital Dreams Studio',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    duration: '45:32',
    views: '2.1K',
    likes: '189',
    type: 'video'
  },
  {
    id: 2,
    title: 'The Future of AI in Creative Industries',
    creator: 'Tech Talk Daily',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    duration: '28:15',
    views: '1.8K',
    likes: '156',
    type: 'video'
  },
  {
    id: 3,
    title: 'Behind the Beat: Creating Lo-Fi Hip Hop',
    creator: 'Melody Makers',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    duration: '32:48',
    views: '3.2K',
    likes: '278',
    type: 'audio'
  }
];

interface ExplorePageProps {
  onCreatorClick: (creatorName: string) => void;
}

export function ExplorePage({ onCreatorClick }: ExplorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCreators = trendingCreators.filter(creator => {
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
        {categories.map((category) => (
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
        ))}
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
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Users size={12} className="mr-1" />
                    {content.views} views
                  </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div 
              key={creator.id}
              onClick={() => onCreatorClick(creator.name)}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer group"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {creator.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                    {creator.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users size={12} className="mr-1" />
                      {creator.subscribers} subscribers
                    </span>
                    <span className="text-green-400 font-medium">
                      {creator.monthlyEarnings}/mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {creator.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {creator.category}
                </span>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreatorClick(creator.name);
                  }}
                >
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button 
          variant="outline" 
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
        >
          Load More Creators
        </Button>
      </div>
    </div>
  );
}

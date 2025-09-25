import React from 'react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  'All', 'Pop culture', 'Comedy', 'Role playing games', 'True crime', 
  'Art tutorials', 'Handicrafts', 'Illustration', 'Musical education'
];

const creators = [
  {
    name: 'FUT Simple Trader',
    description: 'Creating EA FC 25 Ultimate Team Trading content.',
    avatar: '🏆'
  },
  {
    name: 'CJ Werleman', 
    description: 'Creating Journalism to Expose Injustices Against Muslims',
    avatar: '📰'
  },
  {
    name: 'matt bernstein',
    description: 'creating accessible social and political commentary',
    avatar: '👤'
  },
  {
    name: 'FUTDonk',
    description: 'Creating FC 26 (FIFA) Ultimate team trading tips & investments',
    avatar: '⚽'
  },
  {
    name: 'SFmarket',
    description: 'Best Trading/Investments❤️🔥',
    avatar: '📈'
  },
  {
    name: 'Aleks_FUT communities',
    description: 'Creating EA FC 26 (FIFA) Trading tips & advice',
    avatar: '🎮'
  },
  {
    name: 'Zach Campbell',
    description: 'Creating Reaction Videos',
    avatar: '🎬'
  },
  {
    name: 'Unclear and Present Patreon',
    description: 'creating a podcast about the world of Cold War thrillers.',
    avatar: '🎙️'
  },
  {
    name: 'Chapo Trap House',
    description: 'Creating Chapo Trap House Podcast',
    avatar: '🎧'
  }
];

const topics = [
  { name: 'Podcasts & shows', color: 'bg-red-600', icon: '🎙️' },
  { name: 'Tabletop games', color: 'bg-blue-600', icon: '⚡' },
  { name: 'Music', color: 'bg-orange-500', icon: '♫' },
  { name: 'Writing', color: 'bg-pink-600', icon: '📚' },
  { name: 'Apps & software', color: 'bg-purple-600', icon: '⚙️' }
];

export function DashboardContent() {
  return (
    <div className="flex-1 bg-black text-white overflow-x-auto">
      {/* Top banner */}
      <div className="bg-gray-900 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-gray-800">
        <span className="text-xs sm:text-sm text-gray-300">Please verify your email address</span>
        <Button variant="outline" size="sm" className="bg-white text-black border-white hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3">
          Verify email
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Search creators or topics"
              className="pl-8 sm:pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-offset-0 focus-visible:ring-0 text-sm sm:text-base h-9 sm:h-10"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                index === 0 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              {category}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        {/* Popular this week */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Popular this week</h2>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 sm:p-2">
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 sm:p-2">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {creators.map((creator, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/creator/${creator.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                  {creator.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate text-sm sm:text-base">{creator.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{creator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore topics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Explore topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {topics.map((topic, index) => (
              <div
                key={index}
                className={`${topic.color} rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{topic.icon}</div>
                <h3 className="font-semibold text-xs sm:text-base">{topic.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
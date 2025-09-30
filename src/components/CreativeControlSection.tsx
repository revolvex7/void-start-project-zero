import { Button } from '@/components/ui/button';

const CreativeControlSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-none mb-4">
                Complete
              </h2>
              <h2 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-none mb-8">
                Creative
              </h2>
              <h2 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-none">
                Control
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
                Patreon is your space to create what excites you most, rough or polished, big or small. Hundreds of thousands of creators use Patreon to share videos, podcasts, writing, art, music, recipes, and more with their most passionate fans.
              </p>
              
              <div className="pt-4">
                <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  Create on your terms
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Video/Image Content */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Video Thumbnail 1 */}
              <div className="relative group cursor-pointer">
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop" 
                    alt="Creative content"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-l-8 border-l-black border-y-4 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs text-white bg-black/60 rounded px-2 py-1">
                    Your VIP Pass to Fiction Podcast Royalty
                  </div>
                </div>
              </div>

              {/* Video Thumbnail 2 */}
              <div className="relative group cursor-pointer mt-8">
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=300&fit=crop" 
                    alt="Creative content"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-l-8 border-l-black border-y-4 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs text-white bg-black/60 rounded px-2 py-1">
                    Chronicles of a Hip-Hop Journalist
                  </div>
                </div>
              </div>
            </div>

            {/* Large featured content */}
            <div className="relative group cursor-pointer mt-4">
              <div className="aspect-[16/10] bg-gray-200 rounded-2xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                  alt="Featured creative content"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-l-10 border-l-black border-y-5 border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-sm text-white bg-black/60 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <div className="font-semibold">Game Dev Unlocked</div>
                  <div className="text-xs text-gray-200">Stories from the dev community</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeControlSection;

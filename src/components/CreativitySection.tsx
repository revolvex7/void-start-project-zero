import { useState } from 'react';

const creators = [
  {
    name: "Tina Yu",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    category: "Visual Artist"
  },
  {
    name: "Kevin Woo",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    category: "Podcaster"
  },
  {
    name: "Rachel Maksy",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    category: "Content Creator"
  },
  {
    name: "Tim Chantarangsu",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    category: "Comedian"
  }
];

const CreativitySection = () => {
  const [hoveredCreator, setHoveredCreator] = useState<number | null>(null);

  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background/95 to-patreon-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl lg:text-8xl font-bold text-foreground leading-none mb-4">
                Creativity
              </h2>
              <h2 className="text-6xl lg:text-8xl font-bold text-foreground leading-none">
                powered
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-xl text-foreground/80 max-w-lg leading-relaxed">
                [TrueFans] is the best place to build community with your biggest fans, share exclusive work and turn your passion into a lasting creative business.
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-foreground/60">
                <span>https://www.truefans.com/kevinwoo</span>
              </div>
            </div>
          </div>

          {/* Right Side - Creator Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {creators.map((creator, index) => (
                <div
                  key={creator.name}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    index === 0 ? 'col-span-1 row-span-1' : ''
                  } ${
                    index === 1 ? 'col-span-1 row-span-2' : ''
                  } ${
                    index === 2 ? 'col-span-1 row-span-1' : ''
                  } ${
                    index === 3 ? 'col-span-1 row-span-1' : ''
                  }`}
                  onMouseEnter={() => setHoveredCreator(index)}
                  onMouseLeave={() => setHoveredCreator(null)}
                >
                  <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                    index === 1 ? 'aspect-[3/4]' : 'aspect-square'
                  } ${
                    hoveredCreator === index ? 'transform scale-105' : ''
                  }`}>
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Creator Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {creator.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {creator.category}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className={`absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                      hoveredCreator === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 text-8xl lg:text-9xl font-bold text-foreground/5 pointer-events-none">
              by
            </div>
            <div className="absolute -top-8 -left-8 text-6xl lg:text-7xl font-bold text-patreon-secondary/20 pointer-events-none">
              fandom
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativitySection;
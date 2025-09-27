import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Pause, Heart, MessageCircle, Share2, Settings, ArrowRight, Volume2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import videoCreatorsHero from '@/assets/video-creators-hero.png';
import videoCreatorsTestimonial from '@/assets/video-creators-testimonial.png';
import videoCreatorsFooter from '@/assets/video-creators-footer.png';

const VideoCreators = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoHovered, setVideoHovered] = useState(false);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced mouse tracking for hero section with 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setAnimatedItems((prev) => ({ ...prev, [entry.target.id]: true }));
            }, 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.keys(itemRefs.current).forEach((id) => {
      const item = itemRefs.current[id];
      if (item) {
        observer.observe(item);
      }
    });

    return () => {
      Object.keys(itemRefs.current).forEach((id) => {
        const item = itemRefs.current[id];
        if (item) {
          observer.unobserve(item);
        }
      });
    };
  }, []);

  const VideoPlayer = ({ hovered }: { hovered: boolean }) => (
    <div className={`relative w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${hovered ? 'scale-110 rotate-3 shadow-blue-500/50' : 'scale-100 rotate-0'}`}>
      {/* Video Player Header */}
      <div className="bg-black text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChevronLeft className="w-5 h-5 text-white/60" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
            <span className="font-medium text-sm">Rachel Maksy</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1">
            <Settings className="w-4 h-4 text-white/60" />
          </button>
          <button className="p-1">
            <Maximize2 className="w-4 h-4 text-white/60" />
          </button>
          <span className="text-white/60 text-xs">•••</span>
        </div>
      </div>

      {/* Video Content Area */}
      <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 aspect-video">
        <img 
          src="https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=2"
          alt="Video creator content"
          className="w-full h-full object-cover"
        />
        
        {/* Play/Pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button 
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
          >
            {isVideoPlaying ? 
              <Pause className="w-6 h-6 text-black ml-0.5" /> : 
              <Play className="w-6 h-6 text-black ml-1" />
            }
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
          <div className="flex items-center space-x-2 text-white text-xs">
            <span>15:00</span>
            <div className="flex-1 bg-white/30 rounded-full h-1">
              <div className="bg-white rounded-full h-1 w-1/3 transition-all duration-300"></div>
            </div>
            <Volume2 className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Video Details */}
      <div className="bg-black text-white p-4">
        <h3 className="font-semibold text-lg mb-2">A little Autumn-themed Mail Time!</h3>
        <p className="text-gray-300 text-sm mb-3">4 days ago</p>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          Hey there, beautiful people! Welcome back to another delightful episode of MAIL TIME! Today, 
          we're spicing it up with an Autumn-themed unboxing. Could it get any cozier? I think not!
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          So, I've been collecting your packages for a while now (my apologies to the mailman), and today 
          we're diving in! Remember, each of these gifts is like a leaf on an autumn tree—unique, 
          appreciated, and a crucial part of this beautiful community we're building together.
        </p>
        
        {/* Engagement stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">25 comments</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                <Heart className="w-2.5 h-2.5 text-gray-300" />
              </div>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-gray-400 text-sm">35</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url(${videoCreatorsHero})`,
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/40 transition-all duration-1000"></div>
        
        {/* Floating elements with enhanced parallax */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
          <div 
            className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
          ></div>
          <div 
            className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping"
            style={{ transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-white rounded-full animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)` }}
          ></div>
        </div>
        
        {/* Content with 3D transform */}
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left transform transition-transform duration-700"
          style={{ transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)` }}
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl">
            Patreon for
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">video creators</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Create on your own terms, strengthen your relationship with your community, and diversify how you get paid.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Create on Patreon
          </Button>
        </div>
      </section>

      {/* Turn Viewers Into People Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="turn-viewers-content"
              ref={el => itemRefs.current['turn-viewers-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['turn-viewers-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <div 
                onMouseEnter={() => setVideoHovered(true)}
                onMouseLeave={() => setVideoHovered(false)}
                className="cursor-pointer"
              >
                <VideoPlayer hovered={videoHovered} />
              </div>
            </div>
            
            <div 
              id="turn-viewers-text"
              ref={el => itemRefs.current['turn-viewers-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['turn-viewers-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
                Turn your
                <br />
                viewers into
                <br />
                <span className="text-blue-900">your people</span>
              </h2>
              
              <div className="space-y-6 text-lg text-blue-900">
                <p>
                  Patreon gives you a space to connect directly with fans outside of the ad-based, 
                  algorithmically curated social media ecosystem.
                </p>
                <p>
                  Hang out with your community in real-time group chats, stay close through DMs and comments, 
                  and even reach out directly over email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Get Paid Section */}
      <section 
        id="more-ways-to-get-paid"
        ref={el => itemRefs.current['more-ways-to-get-paid'] = el as HTMLDivElement}
        className={`py-20 lg:py-32 bg-gradient-to-br from-blue-500 to-blue-700 transition-all duration-1000 ease-out ${animatedItems['more-ways-to-get-paid'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
                More ways
                <br />
                <span className="text-blue-900">to get paid</span>
              </h2>
              
              <p className="text-lg text-blue-900 mb-8">
                Not only can you earn recurring income on Patreon through paid membership, you can 
                also sell bonus videos, archived series, and more to all of your fans in your personal 
                online shop.
              </p>
            </div>
            
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-4 text-white text-center">
                    <div className="w-12 h-12 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <p className="text-sm font-medium">THE AMANDAVERSE</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-4 text-white text-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-black font-bold text-lg">S</span>
                    </div>
                    <p className="text-sm font-medium">SEALES</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-3 hover:scale-105 transition-all duration-200">
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${videoCreatorsTestimonial})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-red-800/40 to-black/80"></div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl">
            "My Patreon community has given me the freedom to 
            branch out, try new things, and not feel 'tied down' to one type of 
            <span className="text-red-300">content"</span>
          </blockquote>
        </div>
      </section>

      {/* Other Creators Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${videoCreatorsFooter})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        
        <div 
          id="other-creators-content"
          ref={el => itemRefs.current['other-creators-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transform transition-all duration-1000 ease-out ${animatedItems['other-creators-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl">
                Explore how other video creators are using Patreon to take creative and 
                financial control of their futures.
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl">
                <h3 className="text-2xl font-bold text-black mb-3">Rachel Maksy</h3>
                <p className="text-gray-600">
                  is creating a space for vlogs, makeup transformations and whimsy
                </p>
              </div>
              
              <Button className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-xl transform transition-all duration-300">
                Explore creators
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default VideoCreators;
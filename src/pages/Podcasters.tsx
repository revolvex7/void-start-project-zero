import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Using a high-quality podcast-themed hero background
const podcastHeroBg = 'https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

// High-quality images for content sections
const spotifySyncImage = 'https://images.pexels.com/photos/3784324/pexels-photo-3784324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const multiplePodcastsImage = 'https://images.pexels.com/photos/3784393/pexels-photo-3784393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const Podcasters = () => {
  const featuredPodcasters = [
    {
      name: "Amanda Seales",
      handle: "@amandaseales",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Comedy & Commentary"
    },
    {
      name: "Straight Up Sisters",
      handle: "@straightupsisters", 
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Lifestyle"
    },
    {
      name: "Chelsea Devantez",
      handle: "@chelseadevantez",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Entertainment"
    },
    {
      name: "Cinema Therapy",
      handle: "@cinematherapy",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Movies & TV"
    },
    {
      name: "Royals of Malibu",
      handle: "@royalsofmalibu",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Fiction"
    }
  ];

  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
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
            // Add a slight delay for staggered animations
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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-crosshair"
        style={{ 
          backgroundImage: `url(${podcastHeroBg})`,
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/40 transition-all duration-700"></div>
        
        {/* Animated overlay particles */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left transform group-hover:scale-105 transition-transform duration-500">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl">
            Where
            <br />
            podcasts
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">grow</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Podcasters like you earned more than ₦472 million on True Fans in 2024
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Start creating
          </Button>
        </div>
      </section>

      {/* A True Home Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#99ad83' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#99ad83]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
              A true home
              <br />
              <span className="text-gray-800">for podcasters</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Grow Your Income */}
            <div 
              id="grow-income-card"
              ref={el => itemRefs.current['grow-income-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out ${animatedItems['grow-income-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🌹</span>
                  </div>
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-pink-600 mb-2">Rose Stems</h3>
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-3xl font-bold text-black">₦10</span>
                      <span className="text-gray-500 ml-2">/ month</span>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 transform hover:scale-105 transition-transform duration-200">
                      Join
                    </Button>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Grow your income</h3>
              <p className="text-gray-800 leading-relaxed">
                Build your membership business and showcase exclusive episodes on both True Fans and Spotify to drive discovery and conversion.
              </p>
            </div>

            {/* Strengthen Your Audience */}
            <div 
              id="strengthen-audience-card"
              ref={el => itemRefs.current['strengthen-audience-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-200 ${animatedItems['strengthen-audience-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 -rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:-rotate-1">
                <div className="w-80 h-80 mx-auto bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    Live
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/card:bg-white/30 transition-colors duration-300">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-sm">2 Black Girls, 1 Rose</p>
                      <div className="flex items-center justify-center mt-4 space-x-2">
                        <div className="flex -space-x-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-2 border-gray-900"></div>
                          ))}
                        </div>
                        <span className="text-white text-xs">+445 Here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Strengthen your audience</h3>
              <p className="text-gray-800 leading-relaxed">
                Go live to build hype in real time, and connect directly with your listeners in community chats, comments, and DMs.
              </p>
            </div>

            {/* Run Your Business */}
            <div 
              id="run-business-card"
              ref={el => itemRefs.current['run-business-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-400 ${animatedItems['run-business-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-2'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="text-white h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-90">2 Black Girls, 1 Rose</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">2 Black Girls, 1 Rose</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-sm">249 members • 1,000 posts • ₦2,500/month</span>
                    </div>
                    <p className="text-sm opacity-90 mb-6 flex-1">
                      Why don't reality dating shows look or feel like reality? Where are all the rose ceremonies and romantic getaways when dating IRL? Is popular TV teaching us anything about modern dating, relationships, and marriage? ...MORE
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        Join for free
                      </Button>
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        Membership options
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Run your business</h3>
              <p className="text-gray-800 leading-relaxed">
                Host your entire podcast, manage multiple shows, and distribute to listeners via RSS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Turn Reach Into Revenue */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#a1b58b' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#a1b58b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
              Turn reach into
              <br />
              <span className="text-gray-800">revenue</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="spotify-sync-content"
              ref={el => itemRefs.current['spotify-sync-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['spotify-sync-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Image for Spotify Sync */}
              <img
                src={spotifySyncImage}
                alt="Spotify Sync"
                className="w-full h-auto rounded-2xl shadow-xl mb-8 hover:shadow-2xl hover:scale-105 transition-all duration-500"
              />
              <h3 className="text-3xl font-semibold mb-6 text-black">Sync to Spotify</h3>
              <p className="text-lg text-gray-800 mb-8 leading-relaxed">
                Share True Fans exclusives directly on Spotify to reach and convert more listeners. 15% of listeners who visit a True Fans via the Spotify integration become paying members.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800 hover:scale-105 px-8 py-3 rounded-full transition-all duration-300">
                Learn more
              </Button>
            </div>
            <div 
              id="be-found-content"
              ref={el => itemRefs.current['be-found-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['be-found-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h3 className="text-3xl font-semibold mb-6 text-black">Be found right here</h3>
              <p className="text-lg text-gray-800 leading-relaxed">
                Tap into a network of the most valuable fans on the internet. Over 60% of new paid memberships come from fans already on True Fans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Make It Your Own */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#99ad83' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#99ad83]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="make-it-your-own-text"
              ref={el => itemRefs.current['make-it-your-own-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['make-it-your-own-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
                Make it
                <br />
                <span className="text-gray-800">your own</span>
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Showcase your work, your way. Curate your page to feature new releases, fan favorites, and everything in between—making it the go-to destination for your listeners.
              </p>
            </div>
            <div 
              id="make-it-your-own-card"
              ref={el => itemRefs.current['make-it-your-own-card'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['make-it-your-own-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold">2 Black Girls, 1 Rose</h3>
                        <p className="text-sm opacity-90">249 members • 1,000 posts • ₦2,500/month</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">Home</Button>
                      <Button size="sm" variant="ghost" className="text-white">Posts</Button>
                      <Button size="sm" variant="ghost" className="text-white">Collections</Button>
                      <Button size="sm" variant="ghost" className="text-white">Chats</Button>
                      <Button size="sm" variant="ghost" className="text-white">Shop</Button>
                      <Button size="sm" className="bg-red-700 text-white">Join for free</Button>
                      <Button size="sm" variant="ghost" className="text-white">Log in</Button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    Latest posts
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-2 opacity-60">🎵</div>
                          <div className="text-xs">32:52</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Go Live */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#a1b58b' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#a1b58b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="go-live-text"
              ref={el => itemRefs.current['go-live-text'] = el as HTMLDivElement}
              className={`lg:order-2 transition-all duration-1000 ease-out ${animatedItems['go-live-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
                Go live
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Host AMAs, give behind-the-scenes looks, or just hang out with your most loyal listeners in exclusive True Fans livestreams.
              </p>
            </div>
            <div 
              id="go-live-card"
              ref={el => itemRefs.current['go-live-card'] = el as HTMLDivElement}
              className={`lg:order-1 transition-all duration-1000 ease-out delay-200 ${animatedItems['go-live-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 -rotate-3'}`}
            >
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 opacity-80"></div>
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Live
                  </div>
                  <div className="absolute top-4 right-4 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-8 h-8 bg-white/30 rounded-full border border-white/50"></div>
                        ))}
                      </div>
                      <span className="text-sm">+445 Here</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-semibold mb-2">2 Black Girls, 1 Rose</h3>
                      <p className="text-sm opacity-90">Live Q&A Session</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-900">
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold text-red-400">Alex Brown:</span> Clearing my schedule immediately. This is gonna be GOOD
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold text-red-400">Samantha Lee:</span> This is the commentary we all were thinking but too scared to say 🔥🔥
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools to Grow */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#99ad83' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#99ad83]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="tools-grow-text"
              ref={el => itemRefs.current['tools-grow-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['tools-grow-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-12 text-black">
                Tools to grow
                <br />
                <span className="text-gray-800">with ease</span>
              </h2>
              
              <div className="space-y-12">
                <div
                  id="podcast-syncing-item"
                  ref={el => itemRefs.current['podcast-syncing-item'] = el as HTMLDivElement}
                  className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['podcast-syncing-item'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-8 rotate-2'}`}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-black">Podcast syncing</h3>
                  <p className="text-gray-800 mb-6 leading-relaxed">
                    Bring your whole catalog to True Fans by automatically syncing your public and exclusive episodes from a third party host — no double posting required.
                  </p>
                  <Button className="bg-black text-white hover:bg-gray-800 hover:scale-105 px-6 py-3 rounded-full transition-all duration-300">
                    Learn more
                  </Button>
                </div>
                
                <div
                  id="multiple-podcasts-item"
                  ref={el => itemRefs.current['multiple-podcasts-item'] = el as HTMLDivElement}
                  className={`transition-all duration-1000 ease-out delay-400 ${animatedItems['multiple-podcasts-item'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-8 -rotate-2'}`}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-black">Multiple podcasts</h3>
                  <p className="text-gray-800 leading-relaxed">
                    Set up multiple shows under a single True Fans to create a home for your entire media business and give your fans a personalized listening experience.
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              id="tools-grow-card"
              ref={el => itemRefs.current['tools-grow-card'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['tools-grow-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              {/* Image for Multiple Podcasts */}
              <img
                src={multiplePodcastsImage}
                alt="Multiple Podcasts"
                className="w-full h-auto rounded-2xl shadow-2xl mb-8 hover:shadow-3xl hover:scale-105 transition-all duration-500"
              />
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">37:21</span>
                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">🌹</span>
                        </div>
                      </div>
                      <h4 className="text-white font-semibold">2 Black Girls, 1 Rose</h4>
                      <p className="text-gray-400 text-sm">Our 5 Most Treacherous Bachelor(ette) Finale Breakups</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">🌹</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">2 Black Girls, 1 Rose</h4>
                          <p className="text-gray-400 text-sm">Our 5 Favorite TV Moms</p>
                          <span className="text-gray-500 text-xs">32:52</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">🌹</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">2 Black Girls, 1 Rose</h4>
                          <p className="text-gray-400 text-sm">Episode Title Here</p>
                          <span className="text-gray-500 text-xs">40:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcasters Thrive */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#a1b58b' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#a1b58b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="podcasters-thrive-heading"
            ref={el => itemRefs.current['podcasters-thrive-heading'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['podcasters-thrive-heading'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
              Podcasters thrive
              <br />
              <span className="text-gray-800">on True Fans</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredPodcasters.map((podcaster, index) => (
              <div 
                key={index} 
                id={`podcaster-card-${index}`}
                ref={el => itemRefs.current[`podcaster-card-${index}`] = el as HTMLDivElement}
                className={`group/card cursor-pointer transition-all duration-1000 ease-out delay-${index * 100} ${animatedItems[`podcaster-card-${index}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={podcaster.image} 
                    alt={podcaster.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover/card:from-black/40 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm">{podcaster.name}</h3>
                      <p className="text-white/80 text-xs">{podcaster.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            id="your-world-cta"
            ref={el => itemRefs.current['your-world-cta'] = el as HTMLDivElement}
            className={`text-center mt-16 transition-all duration-1000 ease-out delay-500 ${animatedItems['your-world-cta'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h3 className="text-4xl lg:text-5xl font-light mb-8 text-black">
              Your world to create
            </h3>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 hover:scale-105 px-8 py-4 text-lg rounded-full transition-all duration-300">
              Get started
            </Button>
            <p className="mt-4 text-gray-800">
              Already have an account? <a href="/login" className="text-black underline hover:text-gray-600 transition-colors">Log in</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Podcasters;
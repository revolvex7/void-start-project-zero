import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ChevronRight, Gamepad2, Code, Zap } from 'lucide-react';

const GameDevs = () => {
  const featuredGameDevs = [
    {
      name: "Sebastian Graves",
      handle: "@sebastiangraves",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Indie Games"
    },
    {
      name: "FarmRPG",
      handle: "@farmrpg", 
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "RPG"
    },
    {
      name: "Paralives",
      handle: "@paralives",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Simulation"
    },
    {
      name: "Freehold Games",
      handle: "@freeholdgames",
      image: "https://images.pexels.com/photos/1571949/pexels-photo-1571949.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Strategy"
    },
    {
      name: "PixelCraft Studio",
      handle: "@pixelcraft",
      image: "https://images.pexels.com/photos/3764958/pexels-photo-3764958.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Pixel Art"
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
          backgroundImage: `url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
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
            [TrueFans] for
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">game devs</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Create community around your games and mods, sell to a dedicated fanbase, and get paid securely and quickly, all in one place.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Create on True Fans
          </Button>
        </div>
      </section>

      {/* A Safe Way to Get Paid Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-400 to-blue-500 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="safe-payment-content"
              ref={el => itemRefs.current['safe-payment-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['safe-payment-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Payment Interface Mockup */}
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment method</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                        <span className="text-gray-900">****7890</span>
                      </div>
                    </div>
                    <div className="w-full bg-green-500 text-white text-center py-2 rounded-lg font-medium">
                      Continue
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Order summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Game Dev Kit</span>
                      <span className="text-gray-900">₦1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Beta Access</span>
                      <span className="text-gray-900">₦2,500</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total due today</span>
                      <span>₦4,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="safe-payment-text"
              ref={el => itemRefs.current['safe-payment-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['safe-payment-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                A safe way to
                <br />
                get paid
              </h2>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                True Fans has processed billions of naira in payments to millions of creators, so you can be confident that your membership income and shop sales will always be paid out securely, reliably, and quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selling Made Simple Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="selling-simple-text"
              ref={el => itemRefs.current['selling-simple-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['selling-simple-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
                Selling
                <br />
                <span className="text-blue-100">made simple</span>
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                Not only can you earn recurring income on True Fans through paid membership, you can also sell exclusive mods, custom art/skins, and more to all of your fans in your personal online shop.
              </p>
            </div>
            
            <div 
              id="selling-simple-visual"
              ref={el => itemRefs.current['selling-simple-visual'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['selling-simple-visual'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              {/* Game Development Mobile Interface */}
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  {/* Mobile game interface */}
                  <div className="p-4 text-white h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="w-6 h-6 text-green-400" />
                        <span className="font-bold">Game Dev Studio</span>
                      </div>
                      <div className="text-green-400 text-sm">₦4,805</div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-4">New game</div>
                    <div className="text-white text-lg font-bold mb-6">670</div>
                    
                    <div className="space-y-3 flex-1">
                      <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">Latest source code</div>
                          <div className="text-gray-400 text-sm">Build 1.2.3</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">Character Skins Pack</div>
                          <div className="text-gray-400 text-sm">Exclusive designs</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">Behind the Scenes</div>
                          <div className="text-gray-400 text-sm">Development diary</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-white">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
                        made easy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where Real Community Thrives */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-black/60 to-green-800/80"></div>
        
        <div 
          id="community-content"
          ref={el => itemRefs.current['community-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['community-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
            Where real community thrives
          </h2>
          
          <p className="text-lg text-green-100 leading-relaxed mb-12 max-w-4xl mx-auto">
            Hang out in real-time community group chats, stay close through DMs and comments, or even reach out directly over email. Explore fan profiles to get to know the people behind all the love.
          </p>
          
          {/* Featured Game Devs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredGameDevs.slice(0, 4).map((dev, index) => (
              <div 
                key={index}
                className="group/card hover:scale-105 transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={dev.image} 
                    alt={dev.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <h3 className="text-white font-bold text-lg">{dev.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Paralives */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-black/60 to-red-800/80 group-hover:from-orange-900/60 group-hover:via-black/40 group-hover:to-red-800/60 transition-all duration-700"></div>
        
        <div 
          id="paralives-testimonial"
          ref={el => itemRefs.current['paralives-testimonial'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['paralives-testimonial'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8 transform group-hover:scale-105 transition-transform duration-700">
            "With True Fans, we don't have to sacrifice our vision. We can take creative risks like test new game mechanics and ideas 
            <span className="text-orange-300 animate-pulse">from our community."</span>
          </blockquote>
          <cite className="text-xl text-orange-200 font-medium transform group-hover:translate-y-[-5px] transition-transform duration-500">— Paralives</cite>
        </div>
      </section>

      {/* Explore Other Game Devs Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/40 to-black/80 group-hover:from-black/60 group-hover:via-blue-900/20 group-hover:to-black/60 transition-all duration-700"></div>
        
        <div 
          id="explore-devs-content"
          ref={el => itemRefs.current['explore-devs-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ease-out ${animatedItems['explore-devs-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="transform group-hover:translate-x-2 transition-transform duration-700">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
                Explore how other
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">game devs</span> are using
                <br />
                True Fans to take creative
                <br />
                and financial control of
                <br />
                their
                <br />
                <span className="text-blue-300 animate-pulse">futures.</span>
              </h2>
            </div>
            
            <div className="space-y-8 transform group-hover:translate-x-[-8px] transition-transform duration-700">
              <div className="grid grid-cols-2 gap-4">
                {featuredGameDevs.slice(0, 4).map((dev, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-3xl group/card">
                    <h3 className="text-2xl font-bold text-black mb-2 group-hover/card:text-blue-600 transition-colors duration-300">{dev.name}</h3>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button className="bg-white text-black hover:bg-blue-50 hover:text-blue-600 hover:scale-110 hover:rotate-1 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                  Explore creators
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              <div className="text-center mt-12">
                <h3 className="text-4xl lg:text-5xl font-light mb-8 text-white">
                  Your world to create
                </h3>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg rounded-full transition-all duration-300 mr-4">
                  Get started
                </Button>
                <p className="mt-4 text-blue-100">
                  Already have an account? <a href="/login" className="text-white underline hover:text-blue-200 transition-colors">Log in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GameDevs;
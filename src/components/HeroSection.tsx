import { ChevronDown, ChevronRight } from 'lucide-react';
import AnimatedHeroText from './AnimatedHeroText';
import CreatorSpotlight from './CreatorSpotlight';
import { useEffect, useRef, useState } from 'react';

// Using images from public folder - reference with / prefix
const backgroundImages = [
  '/man-singing.jpg',
  '/giving-interview.jpg',
  '/studio.jpg',
  '/orange-girl.jpg',
  '/cooking.jpg',
  '/playing-game.png'
];

const heroSlides = [
  {
    title: "Closer than followers",
    subtitle: "creative reality",
    description: "Your inner circle, your true fans",
    background: backgroundImages[0], // man-singing.jpg
    creator: {
      name: "Jade Novah",
      description: "is fusing her loves of music, writing, and comedy"
    }
  },
  {
    title: "Nurturing the next great podcast",
    subtitle: "grow",
    description: "We're here to help you build, grow, and enjoy making the podcast you've always dreamed of.",
    background: backgroundImages[1], // giving-interview.jpg
    creator: {
      name: "Elliott Wilson",
      description: "is building community around hip-hop journalism"
    }
  },
  {
    title: "Build your own community of fans",
    subtitle: "art",
    description: "Own your content, control your earnings",
    background: backgroundImages[2], // studio.jpg
    creator: {
      name: "RossDraws",
      description: "is creating, sharing and teaching the art of worldbuilding"
    }
  },
  {
    title: "From you to your people",
    subtitle: "crew",
    description: "Build a direct connection with your most loyal fans",
    background: backgroundImages[3], // orange-girl.jpg
    creator: {
      name: "Rachel Maksy",
      description: "is creating a space for vlogs, makeup transformations and whimsy"
    }
  },
  {
    title: "You're in charge here",
    subtitle: "rules",
    description: "Host online and real life events for your fans",
    background: backgroundImages[4], // cooking.jpg
    creator: {
      name: "Tim Chantarangsu",
      description: "is dropping podcast episodes and spitting fire"
    }
  },
  {
    title: "Content creator is now a career",
    subtitle: "career",
    description: "Get paid for doing what you love the most",
    background: backgroundImages[5], // playing-game.png
    creator: {
      name: "Jon Bernthal",
      description: "Real Ones is diving deep into the biggest issues of our time"
    }
  }
];

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [wasManuallyClicked, setWasManuallyClicked] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true to prevent flash

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check if device supports hover (desktop)
      const hasHoverSupport = window.matchMedia('(hover: hover)').matches;
      setIsTouchDevice(!hasHoverSupport);
    };
    checkTouchDevice();
  }, []);

  useEffect(() => {
    console.log('currentSlideIndex changed to:', currentSlideIndex);
  }, [currentSlideIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering && !wasManuallyClicked) {
        setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, wasManuallyClicked]);

  // Reset manual click flag after 8 seconds to resume auto-slide
  useEffect(() => {
    if (wasManuallyClicked) {
      const timeout = setTimeout(() => {
        setWasManuallyClicked(false);
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [wasManuallyClicked]);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const nextSlide = () => {
    console.log('nextSlide called - current:', currentSlideIndex, 'next:', (currentSlideIndex + 1) % heroSlides.length);
    const newIndex = (currentSlideIndex + 1) % heroSlides.length;
    setCurrentSlideIndex(newIndex);
    console.log('State updated to:', newIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable hover preview on touch devices or small screens
    if (isTouchDevice || !containerRef.current || window.innerWidth < 768) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    setCursorPos({ x: localX, y: localY });

    // Check if cursor is over the button
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const isOverButton = 
        e.clientX >= buttonRect.left &&
        e.clientX <= buttonRect.right &&
        e.clientY >= buttonRect.top &&
        e.clientY <= buttonRect.bottom;
      setIsHoveringButton(isOverButton);
    }
  };

  const currentSlide = heroSlides[currentSlideIndex];
  const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
  const nextSlideData = heroSlides[nextIndex];

  const blobSize = 180; // px
  const half = blobSize / 2;
  const navbarHeight = 64; // Assuming a navbar height of 64px (h-16)

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" 
      ref={containerRef}
      onMouseEnter={() => {
        // Only enable hover on non-touch devices and desktop screens
        if (!isTouchDevice && window.innerWidth >= 768) {
          setIsHovering(true);
        }
      }}
      onMouseLeave={() => {
        // Only on non-touch devices and desktop screens
        if (!isTouchDevice && window.innerWidth >= 768) {
          setIsHovering(false);
        }
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Images with Transition */}
      {heroSlides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `url(${slide.background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}

      {/* Cursor-following amoeba preview of next slide - Desktop only */}
      {!isTouchDevice && isHovering && cursorPos.y > navbarHeight && !isHoveringButton && (
        <div
          className="absolute z-50 pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 max-md:hidden"
          style={{
            left: `${cursorPos.x - half}px`,
            top: `${cursorPos.y - half}px`,
            width: `${blobSize}px`,
            height: `${blobSize}px`,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animation: 'amoeba-morph 5s ease-in-out infinite',
            backgroundImage: `url(${nextSlideData.background})`,
            backgroundSize: `${containerSize.w}px ${containerSize.h}px`,
            backgroundPosition: `${-(cursorPos.x - half)}px ${-(cursorPos.y - half)}px`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}
          onClick={(e) => { 
            console.log('Amoeba clicked! Going to slide:', nextIndex); 
            e.stopPropagation(); 
            e.preventDefault();
            setCurrentSlideIndex(nextIndex);
            setWasManuallyClicked(true);
            console.log('State updated to:', nextIndex);
          }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentSlideIndex(nextIndex); setWasManuallyClicked(true); } }}
        >
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <ChevronRight className="w-7 h-7 text-white/90 drop-shadow" />
          </div>
        </div>
      )}
      
      {/* Enhanced Overlay for Better Mobile Readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
          {/* Left Column - Hero Text */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="animate-fade-up">
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-none tracking-tight">
                  {currentSlide.title}
                </h1>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-none tracking-tight">
                  {currentSlide.subtitle}
                </h1>
              </div>
            </div>
            
            <div className="animate-fade-up delay-300">
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-normal max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {currentSlide.description}
              </p>
            </div>
            
            <div className="animate-fade-up delay-500">
              <button 
                ref={buttonRef}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300 patreon-hover-glow shadow-lg w-full sm:w-auto"
              >
                Start my page
              </button>
            </div>
          </div>
          
        
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
      </div>
    </section>
  );
};

export default HeroSection;
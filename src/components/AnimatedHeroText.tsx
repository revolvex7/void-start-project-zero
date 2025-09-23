import { useState, useEffect } from 'react';

const heroTexts = [
  "Your wildest",
  "Where podcasts",
  "Make it making",
  "From you to your",
  "Your house Your",
  "Creator is now a"
];

const secondLines = [
  "creative reality",
  "grow",
  "art", 
  "crew",
  "rules",
  "career"
];

const AnimatedHeroText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroTexts.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1 sm:space-y-2">
      <div 
        className={`transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-none tracking-tight">
          {heroTexts[currentIndex]}
        </h1>
      </div>
      
      <div 
        className={`transform transition-all duration-500 ease-out delay-100 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-none tracking-tight">
          {secondLines[currentIndex]}
        </h1>
      </div>
    </div>
  );
};

export default AnimatedHeroText;
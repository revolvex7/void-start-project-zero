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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div 
        className={`transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground patreon-text-shadow leading-none">
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
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground patreon-text-shadow leading-none">
          {secondLines[currentIndex]}
        </h1>
      </div>
    </div>
  );
};

export default AnimatedHeroText;
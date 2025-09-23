import creatorImage from '@/assets/creator-jade.jpg';

interface CreatorSpotlightProps {
  name: string;
  description: string;
  image?: string;
  className?: string;
}

const CreatorSpotlight = ({ 
  name, 
  description, 
  image = creatorImage,
  className = "" 
}: CreatorSpotlightProps) => {
  return (
    <div className={`group cursor-pointer ${className}`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 border border-white/20">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary/50 transition-colors flex-shrink-0">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="font-semibold text-white group-hover:text-primary-hover transition-colors text-sm sm:text-base">
                {name}
              </span>
              <span className="text-white/60 text-sm sm:text-base">is</span>
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <p className="text-xs sm:text-sm text-white/80 mt-1 group-hover:text-white/90 transition-colors leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSpotlight;
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
      <div className="patreon-card rounded-lg p-6 hover:bg-card/80 transition-all duration-300 patreon-hover-glow">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary/50 transition-colors">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground group-hover:text-primary-hover transition-colors">
                {name}
              </span>
              <span className="text-foreground/60">is</span>
              <svg 
                className="w-4 h-4 text-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <p className="text-sm text-foreground/80 mt-1 group-hover:text-foreground/90 transition-colors">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSpotlight;
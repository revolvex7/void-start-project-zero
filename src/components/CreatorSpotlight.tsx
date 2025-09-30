import creatorImage from '@/assets/creator-jade.jpg';
import { ChevronRight } from 'lucide-react';

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
    <div className={`group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group-hover:border-primary-light/50 overflow-hidden relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-primary transition-colors duration-300 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white text-lg group-hover:text-primary transition-colors duration-300">
                {name}
              </span>
              <span className="text-white/70 text-base">is</span>
              <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1" />
            </div>
            <p className="text-sm text-white/80 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSpotlight;
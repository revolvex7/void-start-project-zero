import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Modern Logo Icon */}
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand-primary))" />
              <stop offset="50%" stopColor="hsl(var(--brand-coral))" />
              <stop offset="100%" stopColor="hsl(var(--brand-purple))" />
            </linearGradient>
            <linearGradient id="logoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand-gold))" />
              <stop offset="100%" stopColor="hsl(var(--brand-coral))" />
            </linearGradient>
          </defs>
          
          {/* Main Logo Shape - Modern geometric design */}
          <path
            d="M20 2L32 10L32 30L20 38L8 30L8 10L20 2Z"
            fill="url(#logoGradient)"
            className="drop-shadow-sm"
          />
          
          {/* Inner Accent - Star/Fan symbol */}
          <path
            d="M20 8L26 16L20 20L14 16L20 8Z"
            fill="url(#logoAccent)"
            className="opacity-90"
          />
          
          {/* Bottom accent - representing connection/community */}
          <circle
            cx="20"
            cy="28"
            r="4"
            fill="hsl(var(--brand-light))"
            className="opacity-80"
          />
          
          {/* Small dots representing fans/community */}
          <circle cx="12" cy="24" r="1.5" fill="hsl(var(--brand-light))" className="opacity-60" />
          <circle cx="28" cy="24" r="1.5" fill="hsl(var(--brand-light))" className="opacity-60" />
        </svg>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <span className={cn(
          'font-bold bg-gradient-primary bg-clip-text text-transparent',
          textSizeClasses[size]
        )}>
          True Fans
        </span>
      )}
    </div>
  );
};

export default Logo; 
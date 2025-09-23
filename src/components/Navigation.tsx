import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/30' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="#creators" isScrolled={isScrolled}>Creators</NavLink>
              <NavLink href="#features" isScrolled={isScrolled}>Features</NavLink>
              <NavLink href="#pricing" isScrolled={isScrolled}>Pricing</NavLink>
              <NavLink href="#resources" isScrolled={isScrolled}>Resources</NavLink>
              <NavLink href="#updates" variant="outlined" isScrolled={isScrolled}>Updates</NavLink>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <a 
              href="/" 
              className={`text-2xl font-bold tracking-wider transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-foreground'
              } hover:text-primary`}
            >
              PATREON
            </a>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className={`hidden lg:flex items-center space-x-2 rounded-full px-6 transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find a Creator</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className={`hidden lg:block rounded-full px-6 transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              Log in
            </Button>
            
            <Button 
              className={`rounded-full px-6 font-medium transition-all duration-300 ${
                isScrolled 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-foreground text-background hover:bg-foreground/90 patreon-hover-glow'
              }`}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined';
  isScrolled?: boolean;
}

const NavLink = ({ href, children, variant = 'default', isScrolled = false }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className={`text-sm font-medium transition-all duration-200 ${
        variant === 'outlined'
          ? `border rounded-full px-4 py-2 transition-colors ${
              isScrolled 
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400' 
                : 'border-white/20 hover:bg-secondary hover:border-white/40'
            }`
          : `relative after:content-[""] after:absolute after:w-0 after:h-0.5 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full ${
              isScrolled 
                ? 'text-gray-700 hover:text-gray-900 after:bg-gray-900' 
                : 'hover:text-primary-hover after:bg-primary'
            }`
      }`}
    >
      {children}
    </a>
  );
};

export default Navigation;
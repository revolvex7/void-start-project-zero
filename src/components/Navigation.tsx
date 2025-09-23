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
        ? 'bg-background/95 backdrop-blur-xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Navigation */}
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="#creators">Creators</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#resources">Resources</NavLink>
              <NavLink href="#updates" variant="outlined">Updates</NavLink>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <a 
              href="/" 
              className="text-2xl font-bold tracking-wider text-foreground hover:text-primary-hover transition-colors"
            >
              PATREON
            </a>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden lg:flex items-center space-x-2 text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-full px-6"
            >
              <Search className="w-4 h-4" />
              <span>Find a Creator</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="hidden lg:block text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-full px-6"
            >
              Log in
            </Button>
            
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 font-medium patreon-hover-glow transition-all duration-300"
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
}

const NavLink = ({ href, children, variant = 'default' }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className={`text-sm font-medium transition-all duration-200 ${
        variant === 'outlined'
          ? 'border border-white/20 rounded-full px-4 py-2 hover:bg-secondary hover:border-white/40'
          : 'hover:text-primary-hover relative after:content-[""] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full'
      }`}
    >
      {children}
    </a>
  );
};

export default Navigation;
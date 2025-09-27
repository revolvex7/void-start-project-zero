import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronRight } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = (dropdownId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(dropdownId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay before closing
    setHoverTimeout(timeout);
  };

  // Exact Patreon menu structure
  const menuItems = {
    creators: {
      title: 'Creators',
      sections: [
        {
          title: 'Podcasters',
          items: [
            'Get to know your listeners',
            'Cut through the noise',
            'More ways to get paid',
            'Other podcasters on Patreon'
          ]
        },
        {
          title: 'Video creators',
          items: [
            'Turn your viewers into your people',
            'Reach every fan, every time',
            'More ways to get paid',
            'Other video creators on Patreon'
          ]
        },
        {
          title: 'Musicians',
          items: [
            'From your mind to their ears',
            'Share more than music',
            'More ways to get paid',
            'Other musicians on Patreon'
          ]
        },
        {
          title: 'Artists',
          items: [
            'Earning made easy',
            'Create what inspires you',
            'Build community around your art',
            'Other artists on Patreon'
          ]
        },
        {
          title: 'Game devs',
          items: [
            'A safe way to get paid',
            'Selling made simple',
            'Where real community thrives',
            'Other game devs on Patreon'
          ]
        }
      ]
    },
    features: {
      title: 'Features',
      sections: [
        {
          title: 'Create on your terms',
          items: [
            'Getting started on Patreon',
            'Make it your own',
            'Reach every fan, every time',
            'Showcase your work'
          ]
        },
        {
          title: 'Build real community',
          items: [
            'Every post, every time',
            'More ways to stay close',
            'Get to know your fans'
          ]
        },
        {
          title: 'Expand your reach',
          items: [
            'Bring in new fans',
            'Unlock growth',
            'App integrations'
          ]
        },
        {
          title: 'Get business support',
          items: [
            'Help when you need it',
            'Policies to protect you',
            'Payments powered by Patreon'
          ]
        },
        {
          title: 'Earning made easy',
          items: [
            'Run a membership',
            'Sell digital products'
          ]
        }
      ]
    },
    pricing: {
      title: 'Pricing',
      sections: [
        {
          title: 'Starting a Patreon is free',
          items: [
            'Powerful core features',
            'Earning made easy',
            'Paid membership',
            'Commerce',
            'Payments powered by Patreon'
          ]
        }
      ]
    },
    resources: {
      title: 'Resources',
      sections: [
        {
          title: 'Creator Hub',
          items: [
            'Resources to get started',
            'Grow your membership',
            'Connect with creators'
          ]
        },
        {
          title: 'Newsroom',
          items: [
            'Patreon HQ',
            'Read latest policy updates',
            'Explore product updates'
          ]
        },
        {
          title: 'Help Centre',
          items: [
            'Getting started',
            'Patreon payments',
            'Member management',
            'Content & engagement'
          ]
        },
        {
          title: 'Partners & integrations',
          items: [
            'Featured integrations',
            'Full app directory'
          ]
        },
        {
          title: 'Mobile',
          items: [
            'Download the app'
          ]
        }
      ]
    },
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || activeDropdown
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className={`p-2 transition-colors ${
                  isScrolled || activeDropdown
                    ? 'text-gray-700 hover:bg-gray-100/80' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            {/* Left Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              {Object.entries(menuItems).map(([key, item]) => (
                <NavLinkWithDropdown
                  key={key}
                  id={key}
                  title={item.title}
                  sections={item.sections}
                  isScrolled={isScrolled}
                  isActive={activeDropdown === key}
                  hasActiveDropdown={!!activeDropdown}
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
              <a 
                href="#updates" 
                className={`nav-menu-item-hover text-sm font-medium transition-all duration-200 relative px-3 py-2 ${
                  activeDropdown === 'updates' ? 'nav-menu-item-hover-active' : ''
                } ${
                  isScrolled || activeDropdown === 'updates' ? 'text-gray-800' : 'text-white'
                }`}
                onMouseEnter={() => handleMouseEnter('updates')}
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-menu-item-text">Updates</span>
              </a>
            </div>

            {/* Center Logo */}
            <div className="flex-1 flex justify-center lg:flex-initial">
              <Link 
                to="/" 
                className={`text-xl sm:text-2xl font-bold tracking-wider transition-colors ${
                  isScrolled || activeDropdown ? 'text-gray-900' : 'text-white'
                }`}
              >
                TRUE FANS
              </Link>
            </div>

            {/* Right Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <a 
                href="#find-creator"
                className={`nav-menu-item-hover flex items-center space-x-2 rounded-full px-6 py-2 ${
                  isScrolled || activeDropdown
                    ? 'text-gray-800' 
                    : 'text-white'
                }`}
                onMouseEnter={() => setActiveDropdown(null)} // Close dropdown on hover
                onMouseLeave={handleMouseLeave}
              >
                <Search className="w-4 h-4" />
                <span className="nav-menu-item-text">Find a Creator</span>
              </a>
              
              <Link 
                to="/login"
                className={`nav-menu-item-hover rounded-full px-6 py-2 ${
                  isScrolled || activeDropdown
                    ? 'text-gray-800' 
                    : 'text-white'
                }`}
                onMouseEnter={() => setActiveDropdown(null)} // Close dropdown on hover
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-menu-item-text">Log in</span>
              </Link>
              
              <Link to="/signup">
              <Button 
                  className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
                    isScrolled || activeDropdown
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                Get Started
              </Button>
              </Link>
            </div>

            {/* Mobile Get Started Button */}
            <div className="lg:hidden">
              <Link to="/signup">
              <Button 
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isScrolled || activeDropdown
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                Get Started
              </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeDropdown && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl mega-menu"
            onMouseEnter={() => {
              if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
            }}
            onMouseLeave={handleMouseLeave}
            style={{
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
                        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-8">
              <div className="grid grid-cols-5 gap-6">
                {menuItems[activeDropdown as keyof typeof menuItems]?.sections.map((section, sectionIndex) => {
                  const getSectionLink = (title: string) => {
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('podcaster')) return '/creators/podcasts';
                    if (titleLower.includes('video')) return '/creators/video';
                    if (titleLower.includes('musician')) return '/creators/music';
                    if (titleLower.includes('artist')) return '/creators/visualartists';
                    if (titleLower.includes('game')) return '/creators/gaming';
                    return '#';
                  };

                  const getItemLink = (item: string, sectionTitle: string) => {
                    const itemSlug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
                    const sectionLink = getSectionLink(sectionTitle);
                    if (activeDropdown === 'features') {
                      if (item.toLowerCase().includes('getting started') || 
                          item.toLowerCase().includes('make it your own') || 
                          item.toLowerCase().includes('showcase')) {
                        return '/product/create#' + itemSlug;
                      }
                      return '/product/create#' + itemSlug;
                    }
                    return sectionLink + '#' + itemSlug;
                  };

                  return (
                    <div key={sectionIndex} className="space-y-3 mega-menu-item">
                      <Link to={getSectionLink(section.title)} onClick={() => setActiveDropdown(null)}>
                        <h3 className="text-[15px] font-semibold text-gray-900 tracking-wide flex items-center hover:text-gray-700 cursor-pointer">
                          {section.title}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </h3>
                      </Link>
                      <div className="space-y-0.5">
                        {section.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            to={getItemLink(item, section.title)}
                            onClick={() => setActiveDropdown(null)}
                            className="block text-sm text-gray-600 hover:text-gray-800 transition-colors py-1"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <MobileNavLink href="/creators/podcasts" onClick={toggleMobileMenu}>Creators</MobileNavLink>
              <MobileNavLink href="/product/create" onClick={toggleMobileMenu}>Features</MobileNavLink>
              <MobileNavLink href="#pricing" onClick={toggleMobileMenu}>Pricing</MobileNavLink>
              <MobileNavLink href="#resources" onClick={toggleMobileMenu}>Resources</MobileNavLink>
              <MobileNavLink href="#updates" onClick={toggleMobileMenu}>Updates</MobileNavLink>
              
              <div className="pt-4 border-t border-gray-200/20">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start items-center space-x-2 rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Creator</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-full px-4 py-3 text-gray-700 hover:bg-gray-100 mt-2"
                >
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface NavLinkWithDropdownProps {
  id: string;
  title: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  isScrolled: boolean;
  isActive: boolean;
  hasActiveDropdown: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NavLinkWithDropdown = ({ 
  title, 
  isScrolled, 
  isActive,
  hasActiveDropdown,
  onMouseEnter, 
  onMouseLeave 
}: NavLinkWithDropdownProps) => {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button 
        className={`nav-menu-item-hover text-sm font-medium transition-all duration-200 relative px-3 py-2 ${
          isActive ? 'nav-menu-item-hover-active' : ''
        } ${
          isScrolled || hasActiveDropdown
            ? 'text-gray-800' 
            : 'text-white'
        }`}
      >
        <span className="nav-menu-item-text">{title}</span>
      </button>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined';
  isScrolled?: boolean;
  hasActiveDropdown?: boolean;
}

const NavLink = ({ href, children, variant = 'default', isScrolled = false, hasActiveDropdown = false }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className={`text-sm font-medium transition-all duration-200 ${
        variant === 'outlined'
          ? `border rounded-full px-4 py-2 transition-colors ${
              isScrolled || hasActiveDropdown
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400' 
                : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
            }`
          : `relative ${
              isScrolled || hasActiveDropdown
                ? 'text-gray-700 hover:text-gray-900' 
                : 'text-white hover:text-white/80'
            }`
      }`}
    >
      {children}
    </a>
  );
};

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink = ({ href, children, onClick }: MobileNavLinkProps) => {
  return (
    <Link 
      to={href} 
      onClick={onClick}
      className="block text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg px-3 py-2 transition-colors"
    >
      {children}
    </Link>
  );
};

export default Navigation;